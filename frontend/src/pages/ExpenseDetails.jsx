import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Calendar, Tag, Store, IndianRupee, Clock } from 'lucide-react';
import { getExpenseById, deleteExpense } from '../api/expenses';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { getCategoryBadgeClass } from '../components/expenses/ExpenseCharts';

const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const data = await getExpenseById(id);
        setExpense(data);
      } catch (err) {
        console.error('Fetch detail error:', err);
        const msg = err.response?.data?.message || err.response?.data?.error || 'Expense not found.';
        setError(msg);
        addToast(msg, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, addToast]);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteExpense(id);
      addToast(`Expense deleted successfully.`, 'success');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Delete error:', err);
      addToast(err.response?.data?.message || 'Failed to delete expense.', 'error');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <CardSkeleton />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="glass-panel" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          {error || 'Expense details could not be loaded.'}
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary btn-icon" title="Back to Dashboard">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Transaction Details</h1>
            <p className="subtitle">ID: {expense._id || expense.id}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/edit/${expense._id || expense.id}`} className="btn btn-secondary">
            <Pencil size={16} />
            <span>Edit</span>
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="btn btn-danger"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="glass-panel">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          
          {/* Amount */}
          <div style={{ gridColumn: '1 / -1', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
              Total Amount
            </span>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>
              ₹{Number(expense.Amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Merchant */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Store size={16} color="var(--primary)" />
              <span>Merchant</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
              {expense.Merchant}
            </div>
          </div>

          {/* Category */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Tag size={16} color="var(--accent)" />
              <span>Category</span>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <span className={getCategoryBadgeClass(expense.Category)} style={{ fontSize: '0.9rem', padding: '0.35rem 0.85rem' }}>
                {expense.Category}
              </span>
            </div>
          </div>

          {/* Date */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Calendar size={16} color="var(--warning)" />
              <span>Date</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
              {new Date(expense.Date).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          {/* User ID / Ownership */}
          {expense.userId && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                <Clock size={16} />
                <span>Account Owner</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontFamily: 'monospace' }}>
                {expense.userId}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message={`Are you sure you want to permanently delete this ${expense.Category} expense from ${expense.Merchant} (₹${Number(expense.Amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})?`}
        confirmText="Delete Expense"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default ExpenseDetails;
