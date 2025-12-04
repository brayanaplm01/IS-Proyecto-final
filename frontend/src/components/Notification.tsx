"use client";

interface NotificationProps {
  type: 'error' | 'warning' | 'success';
  message: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export default function Notification({ type, message, actionButton }: NotificationProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 border-red-400/20';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400/20';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 border-green-400/20';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400/20';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed top-6 right-6 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-md border backdrop-blur-sm ${getTypeStyles()}`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="flex-1">{message}</span>
        {actionButton && (
          <button 
            onClick={actionButton.onClick}
            className="underline font-semibold hover:opacity-80 transition-opacity"
          >
            {actionButton.text}
          </button>
        )}
      </div>
    </div>
  );
}