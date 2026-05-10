import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon,
  style,
  type = 'button',
}) => {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled || loading ? 0.6 : 1,
    fontFamily: 'inherit',
  };

  const sizes = {
    sm: { padding: '6px 14px', fontSize: '0.8rem' },
    md: { padding: '10px 20px', fontSize: '0.9rem' },
    lg: { padding: '14px 28px', fontSize: '1rem' },
  };

  const variants = {
    primary: {
      background: 'var(--gradient-primary)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(108, 99, 255, 0.4)',
    },
    secondary: {
      background: 'rgba(108, 99, 255, 0.15)',
      color: 'var(--primary-light)',
      border: '1px solid rgba(108, 99, 255, 0.3)',
    },
    danger: {
      background: 'rgba(255, 77, 106, 0.15)',
      color: 'var(--danger)',
      border: '1px solid rgba(255, 77, 106, 0.3)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)',
    },
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !loading) {
      if (variant === 'primary') {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(108, 99, 255, 0.5)';
      } else {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.opacity = '0.85';
      }
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = variant === 'primary' ? '0 4px 15px rgba(108, 99, 255, 0.4)' : 'none';
    e.currentTarget.style.opacity = disabled || loading ? '0.6' : '1';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading ? (
        <span style={{
          width: '14px', height: '14px',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          display: 'inline-block',
        }} />
      ) : icon}
      {children}
    </button>
  );
};

export default Button;
