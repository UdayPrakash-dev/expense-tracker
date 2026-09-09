import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { addExpense, getExpenseById, updateExpense } from '../api/expenses';

const ExpenseForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Category: '',
    Amount: '',
    Merchant: '',
    Date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchExpense = async () => {
        try {
          const data = await getExpenseById(id);
          // Format date for input type="date"
          const formattedDate = new Date(data.Date).toISOString().split('T')[0];
          setFormData({
            Category: data.Category,
            Amount: data.Amount,
            Merchant: data.Merchant,
            Date: formattedDate
          });
        } catch (err) {
          setError('Failed to fetch expense details.');
        } finally {
          setInitLoading(false);
        }
      };
      fetchExpense();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateExpense(id, formData);
      } else {
        await addExpense(formData);
      }
      navigate('/');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} expense.`);
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0 }}>
            {isEditMode ? 'Edit Expense' : 'Add New Expense'}
          </h1>
        </div>
      </header>

      <div className="glass-panel">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Date">Date</label>
            <input
              type="date"
              id="Date"
              name="Date"
              className="form-input"
              value={formData.Date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Merchant">Merchant</label>
            <input
              type="text"
              id="Merchant"
              name="Merchant"
              className="form-input"
              placeholder="e.g. Amazon, Starbucks, Rent"
              value={formData.Merchant}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Category">Category</label>
            <input
              type="text"
              id="Category"
              name="Category"
              className="form-input"
              placeholder="e.g. Food, Utilities, Entertainment"
              value={formData.Category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Amount">Amount ($)</label>
            <input
              type="number"
              id="Amount"
              name="Amount"
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              value={formData.Amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex" style={{ justifyContent: 'flex-end', marginTop: '2rem' }}>
            <Link to="/" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
              ) : (
                <><Save size={20} /> {isEditMode ? 'Update Expense' : 'Save Expense'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
