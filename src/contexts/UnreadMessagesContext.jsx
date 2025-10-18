"use client";

import { createContext, useContext, useState } from "react";

const UnreadMessagesContext = createContext();

export function UnreadMessagesProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export function useUnreadMessages() {
  const context = useContext(UnreadMessagesContext);
  // Return default values if not within provider (for public pages)
  if (!context) {
    return { unreadCount: 0, setUnreadCount: () => {} };
  }
  return context;
}
