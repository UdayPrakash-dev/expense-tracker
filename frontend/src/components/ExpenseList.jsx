import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { deleteExpense } from '../api/expenses';

const ExpenseList = ({ expenses, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      setLoading(true);
      await deleteExpense(id);
      onRefresh();
    } catch (err) {
      setError('Failed to delete expense.');
    } finally {
      setLoading(false);
    }
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="glass-panel text-center" style={{ padding: '3rem' }}>
        <p className="text-secondary">No expenses found.</p>
        <Link to="/create" className="btn btn-primary mt-4">Add your first expense</Link>
      </div>
    );
  }

  return (
    <div className="glass-panel table-container">
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Merchant</th>
            <th>Amount</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{new Date(expense.Date).toLocaleDateString()}</td>
              <td>{expense.Category}</td>
              <td>{expense.Merchant}</td>
              <td>${Number(expense.Amount).toFixed(2)}</td>
              <td>
                <div className="flex items-center gap-2" style={{ justifyContent: 'center' }}>
                  <button 
                    onClick={() => navigate(`/${expense.id}`)}
                    className="btn btn-secondary" 
                    title="View Details"
                    style={{ padding: '0.5rem' }}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => navigate(`/edit/${expense.id}`)}
                    className="btn btn-secondary" 
                    title="Edit"
                    style={{ padding: '0.5rem' }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(expense.id)}
                    className="btn btn-danger" 
                    disabled={loading}
                    title="Delete"
                    style={{ padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
