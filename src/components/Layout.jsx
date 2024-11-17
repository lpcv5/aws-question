// components/Layout.jsx
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">题库练习</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;