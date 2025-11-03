import { NextResponse } from 'next/server';
import { getMessages, addMessage, getConversation, markMessagesAsRead } from '@/lib/db/conversations';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext, sanitizeMessage } from '@/lib/monitoring/log-utils';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';

/**
 * GET /api/conversations/[id]/messages
 * Fetch all messages for a conversation
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = performance.now();

  try {
    const { id } = await params;
    const conversationId = parseInt(id);

    if (isNaN(conversationId)) {
      logger.warn(
        createLogContext({
          action: 'invalid_conversation_id',
          endpoint: '/api/conversations/[id]/messages',
          provided_id: id,
          duration_ms: performance.now() - startTime,
        }),
        'Invalid conversation ID provided'
      );
      return NextResponse.json(
        { error: 'Invalid conversation ID' },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await getConversation(conversationId);
    if (!conversation) {
      logger.warn(
        createLogContext({
          action: 'conversation_not_found',
          endpoint: '/api/conversations/[id]/messages',
          conversation_id: conversationId,
          duration_ms: performance.now() - startTime,
        }),
        'Conversation not found'
      );
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Get all messages
    const messages = await getMessages(conversationId);

    // Check if we should mark messages as read
    // Use ?markAsRead=true to mark messages as read (default: true for backwards compatibility)
    const url = new URL(request.url);
    const markAsRead = url.searchParams.get('markAsRead') !== 'false';

    if (markAsRead) {
      // Mark Drew's messages as read
      await markMessagesAsRead(conversationId);
      logger.debug(
        createLogContext({
          action: 'messages_marked_read',
          endpoint: '/api/conversations/[id]/messages',
          conversation_id: conversationId,
        }),
        'Messages marked as read'
      );
    }

    logger.info(
      createLogContext({
        action: 'messages_fetched',
        endpoint: '/api/conversations/[id]/messages',
        conversation_id: conversationId,
        message_count: messages.length,
        duration_ms: performance.now() - startTime,
      }),
      'Messages retrieved successfully'
    );

    return NextResponse.json({
      conversation,
      messages
    });

  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        route: '/api/conversations/[id]/messages',
        action: 'fetch_messages',
        method: 'GET'
      },
      extra: {
        duration_ms: performance.now() - startTime
      }
    });

    logger.error(
      createLogContext({
        action: 'fetch_messages_error',
        endpoint: '/api/conversations/[id]/messages',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Error fetching messages'
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations/[id]/messages
 * Send a new message in the conversation
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = performance.now();

  try {
    const { id } = await params;
    const conversationId = parseInt(id);

    if (isNaN(conversationId)) {
      logger.warn(
        createLogContext({
          action: 'invalid_conversation_id',
          endpoint: '/api/conversations/[id]/messages',
          provided_id: id,
          duration_ms: performance.now() - startTime,
        }),
        'Invalid conversation ID provided for message post'
      );
      return NextResponse.json(
        { error: 'Invalid conversation ID' },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await getConversation(conversationId);
    if (!conversation) {
      logger.warn(
        createLogContext({
          action: 'conversation_not_found',
          endpoint: '/api/conversations/[id]/messages',
          conversation_id: conversationId,
          duration_ms: performance.now() - startTime,
        }),
        'Conversation not found for message post'
      );
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      logger.warn(
        createLogContext({
          action: 'message_validation_failed',
          endpoint: '/api/conversations/[id]/messages',
          conversation_id: conversationId,
          user_email: conversation.user_email,
          duration_ms: performance.now() - startTime,
        }),
        'Message validation failed - empty or invalid message'
      );
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    logger.info(
      createLogContext({
        action: 'user_message_received',
        endpoint: '/api/conversations/[id]/messages',
        conversation_id: conversationId,
        user_email: conversation.user_email,
        message_preview: sanitizeMessage(message, 50),
      }),
      'User message received'
    );

    // Store message in database
    const newMessage = await addMessage({
      conversation_id: conversationId,
      sender: 'user',
      message_text: message.trim()
    });

    // Send message to Slack as a threaded reply
    const slackToken = process.env.SLACK_BOT_TOKEN;
    const slackUserId = process.env.SLACK_USER_ID;

    if (!slackToken || !slackUserId) {
      logger.error(
        createLogContext({
          action: 'slack_config_missing',
          endpoint: '/api/conversations/[id]/messages',
          conversation_id: conversationId,
          user_email: conversation.user_email,
          duration_ms: performance.now() - startTime,
        }),
        'Slack integration not configured'
      );
      return NextResponse.json(
        { error: 'Slack integration not configured' },
        { status: 500 }
      );
    }

    const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${slackToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: slackUserId,
        thread_ts: conversation.slack_thread_ts, // Keep all messages in the same thread
        text: `💬 *${conversation.user_name}*:\n${message}`,
        unfurl_links: false,
        unfurl_media: false
      })
    });

    const slackData = await slackResponse.json();

    if (!slackData.ok) {
      logger.error(
        createLogContext({
          action: 'slack_thread_reply_failed',
          endpoint: '/api/conversations/[id]/messages',
          conversation_id: conversationId,
          user_email: conversation.user_email,
          slack_error: slackData.error,
          status: slackResponse.status,
          duration_ms: performance.now() - startTime,
        }),
        'Slack thread reply failed'
      );
      // Don't fail the request - message is already saved
      // Return warning in response for debugging
      return NextResponse.json({
        success: true,
        message: newMessage,
        slack_warning: `Slack notification failed: ${slackData.error || 'Unknown error'}`
      });
    }

    logger.info(
      createLogContext({
        action: 'message_sent_successfully',
        endpoint: '/api/conversations/[id]/messages',
        conversation_id: conversationId,
        user_email: conversation.user_email,
        slack_ts: slackData.ts,
        duration_ms: performance.now() - startTime,
      }),
      'User message sent and Slack notification delivered'
    );

    return NextResponse.json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        route: '/api/conversations/[id]/messages',
        action: 'send_message',
        method: 'POST'
      },
      extra: {
        duration_ms: performance.now() - startTime,
        slackConfigured: !!(process.env.SLACK_BOT_TOKEN && process.env.SLACK_USER_ID)
      }
    });

    logger.error(
      createLogContext({
        action: 'send_message_error',
        endpoint: '/api/conversations/[id]/messages',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Error sending message'
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    );
  }
}
