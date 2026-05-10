import React from 'react';
import Spinner from '../atoms/Spinner';

const DataTable = ({ columns, data, loading, onRowClick, emptyMessage = 'Tidak ada data' }) => {
  if (loading) return <Spinner />;

  if (!data || data.length === 0) {
    return (
      <div style={{
        padding: '40px', textAlign: 'center', color: 'var(--text-muted)',
        background: 'var(--bg-card)', borderRadius: '16px',
        border: '1px solid var(--border)'
      }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
        <thead>
          <tr style={{ background: 'rgba(108, 99, 255, 0.05)', borderBottom: '1px solid var(--border)' }}>
            {columns.map((col, i) => (
              <th key={i} style={{
                padding: '16px 20px', textAlign: col.align || 'left',
                color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem',
                textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--border)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => onRowClick && (e.currentTarget.style.background = 'var(--bg-card-hover)')}
              onMouseLeave={e => onRowClick && (e.currentTarget.style.background = 'transparent')}
            >
              {columns.map((col, j) => (
                <td key={j} style={{
                  padding: '16px 20px', textAlign: col.align || 'left',
                  color: 'var(--text-primary)', fontSize: '0.9rem'
                }}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
