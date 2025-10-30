import { sql } from '@vercel/postgres';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext, hashEmail } from '@/lib/monitoring/log-utils';

export interface Conversation {
  id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_company?: string;
  slack_thread_ts: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender: 'user' | 'drew';
  message_text: string;
  sent_at: Date;
  read_by_user: boolean;
  slack_ts?: string;
}

/**
 * Create a new conversation
 */
export async function createConversation(data: {
  user_name: string;
  user_email: string;
  user_phone: string;
  user_company?: string;
  slack_thread_ts: string;
}): Promise<Conversation> {
  const startTime = performance.now();

  try {
    const result = await sql<Conversation>`
      INSERT INTO conversations (user_name, user_email, user_phone, user_company, slack_thread_ts)
      VALUES (${data.user_name}, ${data.user_email}, ${data.user_phone}, ${data.user_company || null}, ${data.slack_thread_ts})
      RETURNING *
    `;

    const conversation = result.rows[0];

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'createConversation',
        conversation_id: conversation.id,
        user_email: data.user_email,
        duration_ms: performance.now() - startTime,
      }),
      'Conversation created in database'
    );

    return conversation;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'createConversation',
        user_email: data.user_email,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to create conversation'
    );
    throw error;
  }
}

/**
 * Get conversation by ID
 */
export async function getConversation(id: number): Promise<Conversation | null> {
  const startTime = performance.now();

  try {
    const result = await sql<Conversation>`
      SELECT * FROM conversations WHERE id = ${id}
    `;

    const conversation = result.rows[0] || null;

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getConversation',
        conversation_id: id,
        found: !!conversation,
        duration_ms: performance.now() - startTime,
      }),
      conversation ? 'Conversation retrieved' : 'Conversation not found'
    );

    return conversation;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getConversation',
        conversation_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get conversation'
    );
    throw error;
  }
}

/**
 * Get conversation by Slack thread timestamp
 */
export async function getConversationByThreadTs(thread_ts: string): Promise<Conversation | null> {
  const startTime = performance.now();

  try {
    const result = await sql<Conversation>`
      SELECT * FROM conversations WHERE slack_thread_ts = ${thread_ts}
    `;

    const conversation = result.rows[0] || null;

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getConversationByThreadTs',
        conversation_id: conversation?.id,
        thread_ts,
        found: !!conversation,
        duration_ms: performance.now() - startTime,
      }),
      conversation ? 'Conversation found by thread_ts' : 'No conversation found for thread_ts'
    );

    return conversation;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getConversationByThreadTs',
        thread_ts,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get conversation by thread_ts'
    );
    throw error;
  }
}

/**
 * Add a message to a conversation
 */
export async function addMessage(data: {
  conversation_id: number;
  sender: 'user' | 'drew';
  message_text: string;
  slack_ts?: string;
}): Promise<Message> {
  const startTime = performance.now();

  try {
    const result = await sql<Message>`
      INSERT INTO messages (conversation_id, sender, message_text, slack_ts)
      VALUES (${data.conversation_id}, ${data.sender}, ${data.message_text}, ${data.slack_ts || null})
      RETURNING *
    `;

    const message = result.rows[0];

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'addMessage',
        conversation_id: data.conversation_id,
        sender: data.sender,
        message_length: data.message_text.length,
        duration_ms: performance.now() - startTime,
      }),
      `Message added to conversation (sender: ${data.sender})`
    );

    return message;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'addMessage',
        conversation_id: data.conversation_id,
        sender: data.sender,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to add message'
    );
    throw error;
  }
}

/**
 * Get all messages for a conversation
 */
export async function getMessages(conversation_id: number): Promise<Message[]> {
  const startTime = performance.now();

  try {
    const result = await sql<Message>`
      SELECT * FROM messages
      WHERE conversation_id = ${conversation_id}
      ORDER BY sent_at ASC
    `;

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getMessages',
        conversation_id,
        message_count: result.rows.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${result.rows.length} messages`
    );

    return result.rows;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getMessages',
        conversation_id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get messages'
    );
    throw error;
  }
}

/**
 * Get messages after a certain timestamp (for polling)
 */
export async function getNewMessages(conversation_id: number, after: Date): Promise<Message[]> {
  const startTime = performance.now();

  try {
    const result = await sql<Message>`
      SELECT * FROM messages
      WHERE conversation_id = ${conversation_id}
      AND sent_at > ${after.toISOString()}
      ORDER BY sent_at ASC
    `;

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getNewMessages',
        conversation_id,
        new_message_count: result.rows.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${result.rows.length} new messages`
    );

    return result.rows;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getNewMessages',
        conversation_id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get new messages'
    );
    throw error;
  }
}

/**
 * Mark messages as read by user
 */
export async function markMessagesAsRead(conversation_id: number): Promise<void> {
  const startTime = performance.now();

  try {
    const result = await sql`
      UPDATE messages
      SET read_by_user = true
      WHERE conversation_id = ${conversation_id}
      AND sender = 'drew'
      AND read_by_user = false
    `;

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'markMessagesAsRead',
        conversation_id,
        rows_updated: result.rowCount,
        duration_ms: performance.now() - startTime,
      }),
      `Marked ${result.rowCount} messages as read`
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'markMessagesAsRead',
        conversation_id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to mark messages as read'
    );
    throw error;
  }
}

/**
 * Get all conversations for an email address (most recent first)
 */
export async function getConversationsByEmail(email: string): Promise<Conversation[]> {
  const startTime = performance.now();

  try {
    const result = await sql<Conversation>`
      SELECT * FROM conversations
      WHERE user_email = ${email}
      ORDER BY updated_at DESC
    `;

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getConversationsByEmail',
        user_email: email,
        conversation_count: result.rows.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${result.rows.length} conversations for user`
    );

    return result.rows;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getConversationsByEmail',
        user_email: email,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get conversations by email'
    );
    throw error;
  }
}

/**
 * Get the last N messages from a conversation
 */
export async function getLastMessages(conversation_id: number, limit: number = 3): Promise<Message[]> {
  const startTime = performance.now();

  try {
    const result = await sql<Message>`
      SELECT * FROM messages
      WHERE conversation_id = ${conversation_id}
      ORDER BY sent_at DESC
      LIMIT ${limit}
    `;

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getLastMessages',
        conversation_id,
        limit,
        message_count: result.rows.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved last ${result.rows.length} messages`
    );

    // Reverse so they're in chronological order
    return result.rows.reverse();
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getLastMessages',
        conversation_id,
        limit,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get last messages'
    );
    throw error;
  }
}

/**
 * Get the most recently active conversation
 * (The one with the most recent message or creation time)
 */
export async function getRecentActiveConversation(): Promise<Conversation | null> {
  const startTime = performance.now();

  try {
    const result = await sql<Conversation>`
      SELECT c.*
      FROM conversations c
      LEFT JOIN messages m ON m.conversation_id = c.id
      WHERE c.status = 'active'
      GROUP BY c.id
      ORDER BY COALESCE(MAX(m.sent_at), c.created_at) DESC
      LIMIT 1
    `;

    const conversation = result.rows[0] || null;

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getRecentActiveConversation',
        conversation_id: conversation?.id,
        found: !!conversation,
        duration_ms: performance.now() - startTime,
      }),
      conversation ? 'Found recent active conversation' : 'No active conversation found'
    );

    return conversation;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getRecentActiveConversation',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get recent active conversation'
    );
    throw error;
  }
}

/**
 * Close a conversation (set status to 'closed')
 */
export async function closeConversation(id: number): Promise<void> {
  const startTime = performance.now();

  try {
    const result = await sql`
      UPDATE conversations
      SET status = 'closed', updated_at = NOW()
      WHERE id = ${id}
    `;

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'closeConversation',
        conversation_id: id,
        rows_updated: result.rowCount,
        duration_ms: performance.now() - startTime,
      }),
      'Conversation closed'
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'closeConversation',
        conversation_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to close conversation'
    );
    throw error;
  }
}

/**
 * Close all active conversations for a given email
 */
export async function closeActiveConversationsForEmail(email: string): Promise<void> {
  const startTime = performance.now();

  try {
    const result = await sql`
      UPDATE conversations
      SET status = 'closed', updated_at = NOW()
      WHERE user_email = ${email} AND status = 'active'
    `;

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'closeActiveConversationsForEmail',
        user_email: email,
        rows_updated: result.rowCount,
        duration_ms: performance.now() - startTime,
      }),
      `Closed ${result.rowCount} active conversations for user`
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'closeActiveConversationsForEmail',
        user_email: email,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to close active conversations for email'
    );
    throw error;
  }
}
