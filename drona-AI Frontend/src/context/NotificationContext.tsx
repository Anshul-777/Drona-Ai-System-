"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageAdapter, USE_LOCAL_STORAGE } from "@/lib/storageAdapter";

export type NotificationType = "system" | "agent" | "alert" | "achievement" | "default";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  href?: string;
  timestamp: number;
  achievementId?: string;
}

export interface ToastNotification extends Notification {
  visible: boolean;
}

interface NotificationContextProps {
  notifications: Notification[];
  activeToasts: ToastNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "isRead" | "timestamp">, options?: { silent?: boolean }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeToasts, setActiveToasts] = useState<ToastNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await storageAdapter.getNotifications();
      if (data) {
        setNotifications(data);
      }
      setIsLoaded(true);
    };
    fetchNotifications();
  }, []);

  // Sync to local storage if needed
  useEffect(() => {
    if (isLoaded && USE_LOCAL_STORAGE) {
      storageAdapter.saveNotifications(notifications);
    }
  }, [notifications, isLoaded]);

  const addNotification = async (notif: Omit<Notification, "id" | "isRead" | "timestamp">, options?: { silent?: boolean }) => {
    const newNotif: Notification = {
      ...notif,
      id: uuidv4(),
      isRead: false,
      timestamp: Date.now(),
    };
    
    // Optimistic UI update
    setNotifications((prev) => [newNotif, ...prev]);
    
    // DB or LocalStorage insert
    await storageAdapter.insertNotification(newNotif);

    // Skip toast entirely if silent
    if (options?.silent) return;

    // Add to toasts
    setActiveToasts((prev) => [...prev, { ...newNotif, visible: true }]);
    
    // Auto-remove standard toasts after 5 seconds
    if (newNotif.type !== "achievement") {
      setTimeout(() => {
        setActiveToasts((prev) => 
          prev.map(t => t.id === newNotif.id ? { ...t, visible: false } : t)
        );
        // Clean up from DOM shortly after fade out
        setTimeout(() => {
          removeToast(newNotif.id);
        }, 500);
      }, 5000);
    }
  };

  const removeToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await storageAdapter.updateNotificationReadStatus(id, false);
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await storageAdapter.updateNotificationReadStatus(null, true);
  };

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await storageAdapter.deleteNotification(id, false);
  };

  const clearAll = async () => {
    setNotifications([]);
    await storageAdapter.deleteNotification(null, true);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        activeToasts,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        removeToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
