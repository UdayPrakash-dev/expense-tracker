import { Search, Calendar, Filter } from 'lucide-react';

const ExpenseFilter = ({
  search,
  onSearchChange,
  month,
  onMonthChange,
  year,
  onYearChange,
  category,
  onCategoryChange,
  categories = [],
  years = [],
}) => {
  const months = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const yearList = years.length > 0 ? years : [new Date().getFullYear()];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ flex: '1 1 240px', minWidth: '200px' }}>
        <div className="input-with-icon">
          <Search className="input-icon-left" size={16} />
          <input
            type="text"
            className="form-input"
            style={{ padding: '0.55rem 1rem 0.55rem 2.5rem', fontSize: '0.875rem' }}
            placeholder="Search by merchant or category..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        {/* Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-input"
            style={{ padding: '0.5rem 1.75rem 0.5rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selector */}
        <select
          className="form-input"
          style={{ padding: '0.5rem 1.75rem 0.5rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
        >
          <option value="all">All Years</option>
          {yearList.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>

        {/* Category Selector */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-input"
              style={{ padding: '0.5rem 1.75rem 0.5rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseFilter;
