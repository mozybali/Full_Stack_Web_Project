/**
 * Toast Notification Component
 * Başarı, hata, uyarı ve bilgi mesajları göstermek için
 */

import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      Icon: FaCheckCircle,
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      Icon: FaTimesCircle,
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      Icon: FaExclamationTriangle,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      Icon: FaInfoCircle,
    },
  };

  const style = styles[type];
  const Icon = style.Icon;

  return (
    <div className={`${style.bg} border rounded-lg p-4 flex items-start gap-3 animate-slide-in`}>
      <Icon className={`${style.icon} flex-shrink-0 mt-0.5`} />
      <p className={`${style.text} flex-1`}>{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
