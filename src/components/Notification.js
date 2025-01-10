import React, { useEffect } from 'react';

function Notification({ type, message, duration, onClose }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-teal-primary/10 text-teal-primary border-teal-primary';
      case 'error':
        return 'bg-coral-red/10 text-coral-red border-coral-red';
      case 'warning':
        return 'bg-amber-accent/10 text-amber-accent border-amber-accent';
      case 'info':
        return 'bg-blue-primary/10 text-blue-primary border-blue-primary';
      default:
        return 'bg-slate-gray/10 text-slate-gray border-slate-gray';
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg border ${getTypeStyles()} 
        shadow-lg transition-all duration-300 transform translate-y-0`}
    >
      <div className="flex items-center justify-between">
        <p className="mr-8">{message}</p>
        <button
          onClick={onClose}
          className="text-current hover:opacity-75 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Notification; 