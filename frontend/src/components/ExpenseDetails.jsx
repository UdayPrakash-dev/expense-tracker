import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Calendar, Tag, Building2, DollarSign } from 'lucide-react';
import { getExpenseById, deleteExpense } from '../api/expenses';

const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const data = await getExpenseById(id);
        setExpense(data);
      } catch (err) {
        setError('Failed to fetch expense details. It may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      setDeleteLoading(true);
      await deleteExpense(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete expense.');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="glass-panel text-center" style={{ padding: '3rem' }}>
        <p className="text-danger">{error || 'Expense not found'}</p>
        <Link to="/" className="btn btn-primary mt-4">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0 }}>Expense Details</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/edit/${id}`} className="btn btn-secondary">
            <Pencil size={20} /> Edit
          </Link>
          <button 
            onClick={handleDelete} 
            className="btn btn-danger"
            disabled={deleteLoading}
          >
            <Trash2 size={20} /> Delete
          </button>
        </div>
      </header>

      <div className="glass-panel">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div className="detail-item" style={{ marginBottom: '1.5rem' }}>
            <div className="text-secondary flex items-center gap-2 mb-2" style={{ fontWeight: 500, textTransform: 'uppercase', fontSize: '0.875rem' }}>
              <DollarSign size={18} className="text-accent" /> Amount
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ${Number(expense.Amount).toFixed(2)}
            </div>
          </div>

          <div className="detail-item" style={{ marginBottom: '1.5rem' }}>
            <div className="text-secondary flex items-center gap-2 mb-2" style={{ fontWeight: 500, textTransform: 'uppercase', fontSize: '0.875rem' }}>
              <Building2 size={18} className="text-accent" /> Merchant
            </div>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              {expense.Merchant}
            </div>
          </div>

          <div className="detail-item" style={{ marginBottom: '1.5rem' }}>
            <div className="text-secondary flex items-center gap-2 mb-2" style={{ fontWeight: 500, textTransform: 'uppercase', fontSize: '0.875rem' }}>
              <Tag size={18} className="text-accent" /> Category
            </div>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              {expense.Category}
            </div>
          </div>

          <div className="detail-item" style={{ marginBottom: '1.5rem' }}>
            <div className="text-secondary flex items-center gap-2 mb-2" style={{ fontWeight: 500, textTransform: 'uppercase', fontSize: '0.875rem' }}>
              <Calendar size={18} className="text-accent" /> Date
            </div>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              {new Date(expense.Date).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExpenseDetails;
