import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="shell">
      <header className="header">
        <h1>IntelliMeet</h1>
        <nav>
          <Link className={location.pathname === '/login' || location.pathname === '/' ? 'active' : ''} to="/login">
            Login
          </Link>
          <Link className={location.pathname === '/signup' ? 'active' : ''} to="/signup">
            Signup
          </Link>
          <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
