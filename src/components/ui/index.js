import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClass = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-primary text-white hover:bg-blue-600 focus:ring-blue-primary/50',
    secondary: 'bg-teal-primary text-white hover:bg-teal-600 focus:ring-teal-primary/50',
    danger: 'bg-coral-red text-white hover:bg-red-600 focus:ring-coral-red/50',
    warning: 'bg-amber-accent text-white hover:bg-amber-600 focus:ring-amber-accent/50',
    outline: 'border border-gray-300 text-slate-gray hover:bg-gray-50 focus:ring-blue-primary/50'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantClass = variants[variant];
  const sizeClass = sizes[size];
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export const Input = ({
  label,
  error,
  touched,
  className = '',
  ...props
}) => {
  const inputClass = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors';
  const errorClass = error && touched ? 'border-coral-red focus:ring-coral-red/20' : 'border-gray-300 focus:ring-blue-primary/20';
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-gray mb-1">
          {label}
        </label>
      )}
      <input
        className={`${inputClass} ${errorClass}`.trim()}
        {...props}
      />
      {error && touched && (
        <p className="mt-1 text-sm text-coral-red">
          {error}
        </p>
      )}
    </div>
  );
};

export const Select = ({
  label,
  error,
  touched,
  options = [],
  className = '',
  ...props
}) => {
  const selectClass = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors appearance-none bg-white';
  const errorClass = error && touched ? 'border-coral-red focus:ring-coral-red/20' : 'border-gray-300 focus:ring-blue-primary/20';
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-gray mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`${selectClass} ${errorClass}`.trim()}
          {...props}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-gray">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && touched && (
        <p className="mt-1 text-sm text-coral-red">
          {error}
        </p>
      )}
    </div>
  );
};

export const Card = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export const Badge = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-primary/10 text-blue-primary',
    success: 'bg-teal-primary/10 text-teal-primary',
    warning: 'bg-amber-accent/10 text-amber-accent',
    danger: 'bg-coral-red/10 text-coral-red',
    info: 'bg-cyan-accent/10 text-cyan-accent'
  };
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};

export const Alert = ({
  children,
  type = 'info',
  className = '',
  onClose,
  ...props
}) => {
  const types = {
    info: 'bg-blue-primary/10 text-blue-primary',
    success: 'bg-teal-primary/10 text-teal-primary',
    warning: 'bg-amber-accent/10 text-amber-accent',
    error: 'bg-coral-red/10 text-coral-red'
  };
  
  return (
    <div
      className={`rounded-lg p-4 ${types[type]} ${className}`.trim()}
      role="alert"
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {type === 'info' && (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {type === 'success' && (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {type === 'warning' && (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {type === 'error' && (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium">
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600"
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 