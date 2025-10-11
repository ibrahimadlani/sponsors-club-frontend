/**
 * Messaging API
 * 
 * Functions for managing threads and messages.
 */

import { get, post, patch } from "./client";

/**
 * Get all threads for current user
 */
export async function getThreads(params = {}) {
  return get("/messaging/threads/", params);
}

/**
 * Create a new thread
 */
export async function createThread(data) {
  return post("/messaging/threads/", data);
}

/**
 * Get messages for a thread
 */
export async function getThreadMessages(threadId, params = {}) {
  return get(`/messaging/threads/${threadId}/messages/`, params);
}

/**
 * Send a message in a thread
 */
export async function sendMessage(threadId, data) {
  return post(`/messaging/threads/${threadId}/messages/`, data);
}

/**
 * Mark message as read/unread
 */
export async function markMessageAsRead(messageId, isRead = true) {
  return patch(`/messaging/messages/${messageId}/read/`, { is_read: isRead });
}
