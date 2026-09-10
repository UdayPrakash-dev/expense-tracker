import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wallet, PlusCircle, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Wallet size={20} />
          </div>
          <span>Expense Tracker</span>
        </Link>

        {isAuthenticated ? (
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/create"
              className={`btn btn-primary btn-sm`}
            >
              <PlusCircle size={16} />
              <span>Add Expense</span>
            </Link>

            <div className="user-badge" title={user?.email || 'Logged In'}>
              <div className="user-avatar">
                {user?.name?.[0]?.toUpperCase() || <User size={14} />}
              </div>
              <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || user?.email?.split('@')[0] || 'User'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm btn-icon"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="nav-links">
            <Link
              to="/login"
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary btn-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
