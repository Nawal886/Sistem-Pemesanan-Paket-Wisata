import React from 'react';
import Button from '../atoms/Button';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', padding: '16px 0' }}>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ← Prev
      </Button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            width: '36px', height: '36px',
            borderRadius: '8px',
            border: p === page ? 'none' : '1px solid var(--border)',
            background: p === page ? 'var(--gradient-primary)' : 'transparent',
            color: p === page ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: p === page ? '700' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {p}
        </button>
      ))}

      <Button
        size="sm"
        variant="ghost"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next →
      </Button>
    </div>
  );
};

export default Pagination;
