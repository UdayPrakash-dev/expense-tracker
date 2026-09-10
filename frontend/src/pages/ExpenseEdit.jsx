import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, IndianRupee, Calendar, Store, Tag } from 'lucide-react';
import { getExpenseById, updateExpense } from '../api/expenses';
import { useToast } from '../context/ToastContext';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

const COMMON_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Utilities & Bills',
  'Entertainment',
  'Healthcare',
  'Groceries',
  'Education',
  'Personal Care',
];

const ExpenseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    Merchant: '',
    Category: '',
    Amount: '',
    Date: '',
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const data = await getExpenseById(id);
        const formattedDate = new Date(data.Date).toISOString().split('T')[0];
        setFormData({
          Merchant: data.Merchant || '',
          Category: data.Category || '',
          Amount: String(data.Amount || ''),
          Date: formattedDate,
        });
      } catch (err) {
        console.error('Fetch error:', err);
        const msg = err.response?.data?.message || err.response?.data?.error || 'Expense not found.';
        setError(msg);
        addToast(msg, 'error');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchExpense();
  }, [id, addToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryPill = (cat) => {
    setFormData((prev) => ({ ...prev, Category: cat }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Merchant.trim() || !formData.Category.trim() || !formData.Amount || !formData.Date) {
      setError('All fields are required.');
      return;
    }

    const numAmount = Number(formData.Amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateExpense(id, formData);
      addToast(`Updated expense for "${formData.Merchant}"!`, 'success');
      navigate('/');
    } catch (err) {
      console.error('Update error:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to update expense.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary btn-icon" title="Back to Dashboard">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Edit Expense</h1>
            <p className="subtitle">Update transaction information</p>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--danger-light)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="form-group">
            <label className="form-label" htmlFor="expense-amount">Amount (₹)</label>
            <div className="input-with-icon">
              <IndianRupee className="input-icon-left" size={18} />
              <input
                id="expense-amount"
                name="Amount"
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                placeholder="0.00"
                value={formData.Amount}
                onChange={handleChange}
                required
                style={{ fontSize: '1.25rem', fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Merchant */}
          <div className="form-group">
            <label className="form-label" htmlFor="expense-merchant">Merchant / Store Name</label>
            <div className="input-with-icon">
              <Store className="input-icon-left" size={18} />
              <input
                id="expense-merchant"
                name="Merchant"
                type="text"
                className="form-input"
                placeholder="e.g. Starbucks, Amazon, Apple"
                value={formData.Merchant}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="expense-category">Category</label>
            <div className="input-with-icon" style={{ marginBottom: '0.75rem' }}>
              <Tag className="input-icon-left" size={18} />
              <input
                id="expense-category"
                name="Category"
                type="text"
                className="form-input"
                placeholder="Select below or type custom category"
                value={formData.Category}
                onChange={handleChange}
                required
              />
            </div>

            {/* Quick Category Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {COMMON_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryPill(cat)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: formData.Category === cat ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                    color: formData.Category === cat ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="expense-date">Transaction Date</label>
            <div className="input-with-icon">
              <Calendar className="input-icon-left" size={18} />
              <input
                id="expense-date"
                name="Date"
                type="date"
                className="form-input"
                value={formData.Date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span>Updating...</span>
              ) : (
                <>
                  <Save size={18} />
                  <span>Update Expense</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseEdit;
