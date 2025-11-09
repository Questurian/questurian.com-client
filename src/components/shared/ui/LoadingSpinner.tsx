interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
  className?: string;
  variant?: 'default' | 'fullscreen' | 'inline';
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({
  message = "Loading...",
  subMessage,
  className = "",
  variant = 'default',
  size = 'medium'
}: LoadingSpinnerProps) {
  // Size mappings for spinner
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4',
  };

  if (variant === 'fullscreen') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center space-y-4">
          <div className={`animate-spin mx-auto ${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full`}></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {message}
          </h2>
          {subMessage && (
            <p className="text-gray-600 dark:text-gray-400">
              {subMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`animate-spin ${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full ${className}`}></div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mx-auto`}></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
      {subMessage && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">{subMessage}</p>
      )}
    </div>
  );
}