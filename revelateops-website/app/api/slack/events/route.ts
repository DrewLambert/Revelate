import { NextResponse } from 'next/server';
import { getConversationByThreadTs, addMessage } from '@/lib/db/conversations';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext, sanitizeMessage } from '@/lib/monitoring/log-utils';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';

/**
 * POST /api/slack/events
 * Webhook endpoint for Slack Events API
 * Receives your replies from Slack and stores them in the database
 */
export async function POST(request: Request) {
  const startTime = performance.now();

  try {
    const body = await request.json();

    // Handle Slack URL verification challenge
    if (body.type === 'url_verification') {
      logger.info(
        createLogContext({
          action: 'slack_url_verification',
          endpoint: '/api/slack/events',
          duration_ms: performance.now() - startTime,
        }),
        'Slack URL verification challenge received'
      );
      return NextResponse.json({
        challenge: body.challenge
      });
    }

    // Handle events
    if (body.type === 'event_callback') {
      const event = body.event;

      // Only process message events from Drew (not from the bot)
      if (event.type === 'message') {
        // Ignore bot messages, message edits/deletes, and messages from other apps
        if (event.subtype || event.bot_id) {
          logger.debug(
            createLogContext({
              action: 'slack_event_ignored',
              endpoint: '/api/slack/events',
              event_type: event.type,
              subtype: event.subtype,
              has_bot_id: !!event.bot_id,
            }),
            'Slack event ignored (bot message or subtype)'
          );
          return NextResponse.json({ ok: true });
        }

        // This is a message from Drew - determine which conversation it belongs to
        // If it's a threaded reply, use the thread_ts to find the conversation
        // Otherwise, use the most recently active conversation

        const slackUserId = process.env.SLACK_USER_ID;

        // Verify this is a DM to/from the expected user
        if (event.channel_type === 'im' && event.user) {
          let conversation = null;

          // Check if this is a threaded reply
          if (event.thread_ts) {
            // Find conversation by thread timestamp
            conversation = await getConversationByThreadTs(event.thread_ts);
            if (conversation) {
              logger.debug(
                createLogContext({
                  action: 'conversation_found_by_thread',
                  endpoint: '/api/slack/events',
                  conversation_id: conversation.id,
                  thread_ts: event.thread_ts,
                }),
                'Found conversation by thread_ts'
              );
            }
          }

          // Fallback: Get the most recent active conversation if no thread match
          if (!conversation) {
            const { getRecentActiveConversation } = await import('@/lib/db/conversations');
            conversation = await getRecentActiveConversation();
            if (conversation) {
              logger.debug(
                createLogContext({
                  action: 'using_recent_conversation',
                  endpoint: '/api/slack/events',
                  conversation_id: conversation.id,
                }),
                'Using most recent active conversation (no thread match)'
              );
            }
          }

          if (conversation) {
            // Store Drew's reply
            await addMessage({
              conversation_id: conversation.id,
              sender: 'drew',
              message_text: event.text,
              slack_ts: event.ts
            });

            logger.info(
              createLogContext({
                action: 'drew_reply_stored',
                endpoint: '/api/slack/events',
                conversation_id: conversation.id,
                message_preview: sanitizeMessage(event.text, 50),
                via_thread: !!event.thread_ts,
                slack_ts: event.ts,
                duration_ms: performance.now() - startTime,
              }),
              'Drew\'s reply stored in database'
            );
          } else {
            logger.warn(
              createLogContext({
                action: 'no_conversation_found',
                endpoint: '/api/slack/events',
                thread_ts: event.thread_ts,
                duration_ms: performance.now() - startTime,
              }),
              'No conversation found for Drew\'s message'
            );
          }
        }
      }
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        route: '/api/slack/events',
        action: 'slack_webhook_processing'
      },
      extra: {
        duration_ms: performance.now() - startTime,
        slackConfigured: !!process.env.SLACK_USER_ID
      }
    });

    logger.error(
      createLogContext({
        action: 'slack_webhook_error',
        endpoint: '/api/slack/events',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Slack events webhook processing failed'
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
