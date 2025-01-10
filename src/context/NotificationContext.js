import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((type, message, duration = 5000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message, duration }]);
    return id;
  }, []);

  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return showNotification('success', message, duration);
  }, [showNotification]);

  const error = useCallback((message, duration) => {
    return showNotification('error', message, duration);
  }, [showNotification]);

  const warning = useCallback((message, duration) => {
    return showNotification('warning', message, duration);
  }, [showNotification]);

  const info = useCallback((message, duration) => {
    return showNotification('info', message, duration);
  }, [showNotification]);

  const value = {
    showNotification,
    hideNotification,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map(({ id, type, message, duration }) => (
        <Notification
          key={id}
          type={type}
          message={message}
          duration={duration}
          onClose={() => hideNotification(id)}
        />
      ))}
    </NotificationContext.Provider>
  );
} 