import { PieChart, TrendingUp } from 'lucide-react';

const CATEGORY_COLORS = {
  food: '#fb923c',
  dining: '#f97316',
  transport: '#60a5fa',
  transportation: '#3b82f6',
  utilities: '#c084fc',
  bills: '#a855f7',
  entertainment: '#f472b6',
  shopping: '#34d399',
  healthcare: '#f87171',
  health: '#ef4444',
  groceries: '#4ade80',
  default: '#818cf8',
};

export const getCategoryColor = (category = '') => {
  const key = category.toLowerCase().trim();
  return CATEGORY_COLORS[key] || CATEGORY_COLORS.default;
};

export const getCategoryBadgeClass = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return 'badge badge-food';
  if (cat.includes('transport') || cat.includes('car') || cat.includes('travel')) return 'badge badge-transport';
  if (cat.includes('utilit') || cat.includes('bill') || cat.includes('rent')) return 'badge badge-utilities';
  if (cat.includes('entertain') || cat.includes('movie') || cat.includes('game')) return 'badge badge-entertainment';
  if (cat.includes('shop') || cat.includes('cloth')) return 'badge badge-shopping';
  if (cat.includes('health') || cat.includes('med')) return 'badge badge-healthcare';
  return 'badge badge-default';
};

const ExpenseCharts = ({ expenses = [], totalSpent = 0 }) => {
  if (!expenses || expenses.length === 0 || totalSpent <= 0) {
    return null;
  }

  // Aggregate by category
  const breakdown = expenses.reduce((acc, curr) => {
    const cat = curr.Category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(curr.Amount || 0);
    return acc;
  }, {});

  const sortedCategories = Object.entries(breakdown)
    .map(([cat, amount]) => ({
      category: cat,
      amount,
      percentage: (amount / totalSpent) * 100,
      color: getCategoryColor(cat),
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = sortedCategories[0];

  return (
    <div className="glass-panel" style={{ marginBottom: '2rem' }}>
      <div className="flex-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="text-emerald-400" size={20} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Category Breakdown</h3>
        </div>
        {topCategory && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            <TrendingUp size={14} color="var(--accent)" />
            <span>Top: <strong>{topCategory.category}</strong> (₹{topCategory.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
          </div>
        )}
      </div>

      <div className="category-progress-list">
        {sortedCategories.slice(0, 5).map(({ category, amount, percentage, color }) => (
          <div key={category} className="category-row">
            <div className="category-meta">
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{category}</span>
              <span style={{ color: 'var(--text-secondary)', fontFeatureSettings: 'tnum' }}>
                ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${percentage}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseCharts;
