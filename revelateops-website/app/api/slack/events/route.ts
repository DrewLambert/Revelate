import { NextResponse } from 'next/server';
import { getConversationByThreadTs, addMessage } from '@/lib/db/conversations';

export const runtime = 'nodejs';

/**
 * POST /api/slack/events
 * Webhook endpoint for Slack Events API
 * Receives your replies from Slack and stores them in the database
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle Slack URL verification challenge
    if (body.type === 'url_verification') {
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
          return NextResponse.json({ ok: true });
        }

        // This is a message from Drew - we need to determine which conversation it belongs to
        // Since messages are no longer threaded, we'll use a simple heuristic:
        // Store the message in the most recently active conversation

        const slackUserId = process.env.SLACK_USER_ID;

        // Verify this is a DM to/from the expected user
        if (event.channel_type === 'im' && event.user) {
          // Get the most recent active conversation
          const { getRecentActiveConversation } = await import('@/lib/db/conversations');
          const conversation = await getRecentActiveConversation();

          if (conversation) {
            // Store Drew's reply
            await addMessage({
              conversation_id: conversation.id,
              sender: 'drew',
              message_text: event.text,
              slack_ts: event.ts
            });

            console.log('Stored Drew\'s reply:', {
              conversation_id: conversation.id,
              message: event.text.substring(0, 50)
            });
          } else {
            console.log('No active conversation found for Drew\'s message');
          }
        }
      }
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Slack events webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
