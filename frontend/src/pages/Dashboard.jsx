import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Receipt, Calculator, PlusCircle, RefreshCw } from 'lucide-react';
import { getExpenses, getExpensesByMonth, getTotalExpenses, deleteExpense } from '../api/expenses';
import StatCard from '../components/common/StatCard';
import ExpenseFilter from '../components/expenses/ExpenseFilter';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseCharts from '../components/expenses/ExpenseCharts';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [month, setMonth] = useState('all');
  const [year, setYear] = useState('all');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch total spent aggregation
      const totalData = await getTotalExpenses();
      setTotalSpent(Number(totalData.sum || totalData.Total || 0));

      // 2. Fetch all user expenses
      const data = await getExpenses();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to load expenses.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Extract unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const set = new Set(expenses.map((e) => e.Category).filter(Boolean));
    return Array.from(set).sort();
  }, [expenses]);

  // Extract unique years from actual expense data
  const availableYears = useMemo(() => {
    const yearsSet = new Set(
      expenses.map((e) => new Date(e.Date).getFullYear()).filter((y) => !isNaN(y))
    );
    // Always include current year
    yearsSet.add(new Date().getFullYear());
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [expenses]);

  // Filter expenses by search query, category, month, and year
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const expDate = new Date(e.Date);
      const expMonth = expDate.getMonth() + 1;
      const expYear = expDate.getFullYear();

      // Search match (merchant or category)
      const matchSearch =
        search === '' ||
        e.Merchant?.toLowerCase().includes(search.toLowerCase()) ||
        e.Category?.toLowerCase().includes(search.toLowerCase());

      // Category match
      const matchCategory = category === 'all' || e.Category === category;

      // Month match
      const matchMonth = month === 'all' || expMonth === Number(month);

      // Year match
      const matchYear = year === 'all' || expYear === Number(year);

      return matchSearch && matchCategory && matchMonth && matchYear;
    });
  }, [expenses, search, category, month, year]);

  // Calculate stats
  const transactionCount = filteredExpenses.length;
  const filteredTotal = filteredExpenses.reduce((sum, e) => sum + Number(e.Amount || 0), 0);
  const averageSpent = transactionCount > 0 ? filteredTotal / transactionCount : 0;

  // Handle Delete Confirmation
  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExpense) return;
    const id = selectedExpense._id || selectedExpense.id;
    setDeleting(true);
    try {
      await deleteExpense(id);
      addToast(`Deleted expense for ${selectedExpense.Merchant}`, 'success');
      setDeleteModalOpen(false);
      setSelectedExpense(null);
      loadDashboardData();
    } catch (err) {
      console.error('Delete error:', err);
      addToast(err.response?.data?.message || 'Failed to delete expense.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h1>Financial Dashboard</h1>
          <p className="subtitle">Track, monitor, and optimize your spending</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={loadDashboardData}
            className="btn btn-secondary"
            title="Refresh Data"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <Link to="/create" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stats-grid">
        <StatCard
          title="All-Time Total"
          value={`₹${totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={IndianRupee}
          subtitle="Cumulative recorded expenditure"
          color="#10b981"
        />
        <StatCard
          title="Transactions"
          value={transactionCount}
          icon={Receipt}
          subtitle={month === 'all' ? 'All records in view' : `Filtered for selected month`}
          color="#6366f1"
        />
        <StatCard
          title="Average / Transaction"
          value={`₹${averageSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Calculator}
          subtitle="Mean cost across active records"
          color="#f59e0b"
        />
      </div>

      {/* Category Breakdown & Progress Charts */}
      {!loading && expenses.length > 0 && (
        <ExpenseCharts
          expenses={filteredExpenses}
          totalSpent={filteredTotal > 0 ? filteredTotal : totalSpent}
        />
      )}

      {/* Filter Toolbar */}
      <ExpenseFilter
        search={search}
        onSearchChange={setSearch}
        month={month}
        onMonthChange={setMonth}
        year={year}
        onYearChange={setYear}
        category={category}
        onCategoryChange={setCategory}
        categories={uniqueCategories}
        years={availableYears}
      />

      {/* Error Alert */}
      {error && (
        <div
          style={{
            padding: '1rem',
            background: 'var(--danger-light)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{error}</span>
          <button onClick={loadDashboardData} className="btn btn-secondary btn-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Expenses Table or Empty State */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="flex-between mb-4">
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Recent Expenses</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Showing {filteredExpenses.length} of {expenses.length} records
          </span>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : filteredExpenses.length === 0 ? (
          <EmptyState
            title={expenses.length === 0 ? 'No expenses recorded yet' : 'No matching expenses'}
            description={
              expenses.length === 0
                ? 'Get started by creating your first expense entry.'
                : 'Try adjusting your search query or filter criteria.'
            }
            actionText="Add New Expense"
            actionLink="/create"
          />
        ) : (
          <ExpenseTable
            expenses={filteredExpenses}
            onDeleteRequest={handleDeleteClick}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete the expense for "${selectedExpense?.Merchant}" (₹${Number(selectedExpense?.Amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})? This action cannot be undone.`}
        confirmText="Delete Expense"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default Dashboard;
