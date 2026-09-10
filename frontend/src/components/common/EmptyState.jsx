import { Link } from 'react-router-dom';
import { Receipt, PlusCircle } from 'lucide-react';

const EmptyState = ({
  title = 'No expenses found',
  description = 'Start tracking your spending by recording your first expense.',
  actionText = 'Add Expense',
  actionLink = '/create',
  icon: Icon = Receipt,
}) => {
  return (
    <div className="glass-panel empty-state">
      <div className="empty-icon">
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.925rem' }}>
        {description}
      </p>
      {actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          <PlusCircle size={18} />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
