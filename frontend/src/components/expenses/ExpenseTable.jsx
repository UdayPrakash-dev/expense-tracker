import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { getCategoryBadgeClass } from './ExpenseCharts';

const ExpenseTable = ({ expenses = [], onDeleteRequest }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('Date');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'Date') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else if (sortField === 'Amount') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    } else {
      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('Date')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Date</span>
                <ArrowUpDown size={13} style={{ opacity: sortField === 'Date' ? 1 : 0.4 }} />
              </div>
            </th>
            <th onClick={() => handleSort('Merchant')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Merchant</span>
                <ArrowUpDown size={13} style={{ opacity: sortField === 'Merchant' ? 1 : 0.4 }} />
              </div>
            </th>
            <th onClick={() => handleSort('Category')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Category</span>
                <ArrowUpDown size={13} style={{ opacity: sortField === 'Category' ? 1 : 0.4 }} />
              </div>
            </th>
            <th onClick={() => handleSort('Amount')} style={{ cursor: 'pointer', textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                <span>Amount</span>
                <ArrowUpDown size={13} style={{ opacity: sortField === 'Amount' ? 1 : 0.4 }} />
              </div>
            </th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.map((expense) => {
            const id = expense._id || expense.id;
            return (
              <tr key={id}>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                  {new Date(expense.Date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td style={{ fontWeight: 600 }}>{expense.Merchant}</td>
                <td>
                  <span className={getCategoryBadgeClass(expense.Category)}>
                    {expense.Category}
                  </span>
                </td>
                <td className="amount-cell" style={{ textAlign: 'right' }}>
                  ₹{Number(expense.Amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => navigate(`/${id}`)}
                      className="btn btn-secondary btn-icon"
                      title="View Details"
                      aria-label="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => navigate(`/edit/${id}`)}
                      className="btn btn-secondary btn-icon"
                      title="Edit Expense"
                      aria-label="Edit Expense"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDeleteRequest(expense)}
                      className="btn btn-danger btn-icon"
                      title="Delete Expense"
                      aria-label="Delete Expense"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
