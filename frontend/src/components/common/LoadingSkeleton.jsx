export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: '48px', width: '100%', borderRadius: 'var(--radius-sm)' }}
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="skeleton" style={{ height: '24px', width: '40%' }} />
      <div className="skeleton" style={{ height: '36px', width: '70%' }} />
      <div className="skeleton" style={{ height: '16px', width: '50%' }} />
    </div>
  );
};
