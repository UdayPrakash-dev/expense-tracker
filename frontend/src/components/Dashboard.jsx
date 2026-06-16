import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, DollarSign, ListOrdered } from 'lucide-react';
import ExpenseList from './ExpenseList';
import { getExpenses, getExpensesByMonth, getTotalExpenses } from '../api/expenses';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [month, setMonth] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch total separately because of the specific requirement
      const totalData = await getTotalExpenses();
      setTotal(totalData.sum);

      if (month === 'all') {
        const data = await getExpenses();
        setExpenses(data);
      } else {
        const data = await getExpensesByMonth(month);
        setExpenses(data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>Expense Tracker</h1>
          <p className="text-secondary mt-4">Manage your finances effortlessly</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <PlusCircle size={20} />
          New Expense
        </Link>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-accent" size={24} />
            <span className="stat-title mb-0">Total Spent</span>
          </div>
          <span className="stat-value">${Number(total).toFixed(2)}</span>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="flex items-center gap-2 mb-4">
            <ListOrdered className="text-accent" size={24} />
            <span className="stat-title mb-0">Transactions Displayed</span>
          </div>
          <span className="stat-value">{expenses.length}</span>
        </div>
      </div>

      <div className="flex-between mb-4">
        <h2 style={{ fontWeight: 600, fontSize: '1.25rem' }}>Recent Expenses</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="monthFilter" className="text-secondary">Filter:</label>
          <select 
            id="monthFilter"
            className="form-input" 
            style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 1rem' }}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <ExpenseList expenses={expenses} onRefresh={fetchDashboardData} />
      )}
    </div>
  );
};

export default Dashboard;
