"use client";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  const defaultIcon = (
    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <circle cx="8" cy="10" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );

  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon || defaultIcon}
      </div>
      <h3 className="text-xl font-semibold text-gray-300 mb-2">
        {title}
      </h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}