import { useEffect } from 'react';

export default function Notification({ message, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="notification">
      {message}
    </div>
  );
}
