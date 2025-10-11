/**
 * Notifications API
 * 
 * Functions for managing user notifications.
 */

import { get, patch } from "./client";

/**
 * Get all notifications for current user
 */
export async function getNotifications(params = {}) {
  return get("/notifications/", params);
}

/**
 * Mark notification as read/unread
 */
export async function markNotificationAsRead(notificationId, isRead = true) {
  return patch(`/notifications/${notificationId}/read/`, { is_read: isRead });
}
