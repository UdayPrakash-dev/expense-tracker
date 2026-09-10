const StatCard = ({ title, value, icon: Icon, subtitle, color = 'var(--primary)' }) => {
  return (
    <div className="glass-panel stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon" style={{ color, background: `${color}18` }}>
          <Icon size={20} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
