import React from 'react';

const Badge = ({ children, variant = 'primary', style }) => {
  const variantMap = {
    aktif: 'success',
    nonaktif: 'muted',
    active: 'success',
    pending: 'warning',
    confirmed: 'info',
    completed: 'success',
    cancelled: 'danger',
    rejected: 'danger',
    approved: 'success',
    primary: 'primary',
    info: 'info',
    warning: 'warning',
    success: 'success',
    danger: 'danger',
  };

  const cssClass = variantMap[variant] || variantMap[children?.toLowerCase?.()] || 'primary';

  return (
    <span className={`badge badge-${cssClass}`} style={style}>
      {children}
    </span>
  );
};

export default Badge;
