import { NavLink } from 'react-router-dom';
import { useTheme } from '../store/ThemeContext';
import nikiDashboard from '../assets/niki-dashboard.jpg';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="brand">
        <img src={nikiDashboard} alt="niki" className="brand-logo" />
        <span>Budget Tracker</span>
      </div>

      <div className="navbar-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle light and dark theme"
          title="Toggle theme"
        >
          <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`} />
        </button>

        <nav className="nav-pill">
                    <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/summary"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Summary
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
