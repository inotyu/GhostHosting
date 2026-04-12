import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './Toast.module.css';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} style={{ color: '#10b981' }} />;
      case 'error':
        return <AlertCircle size={20} style={{ color: '#ef4444' }} />;
      default:
        return <Info size={20} style={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastContent}>
        <span className={styles.toastIcon}>{getIcon()}</span>
        <span className={styles.toastMessage}>{message}</span>
      </div>
      <button 
        className={styles.toastClose}
        onClick={() => onClose(id)}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
