import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, ClipboardList, LogOut, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { to: '/admin/users', label: 'Quản lý Thành viên', icon: <Users className="w-5 h-5" /> },
    { to: '/admin/products', label: 'Quản lý Sản phẩm', icon: <ShoppingBag className="w-5 h-5" /> },
    { to: '/admin/orders', label: 'Quản lý Đơn hàng', icon: <ClipboardList className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800 bg-gray-950">
            <Link to="/admin" className="text-xl font-extrabold text-blue-500 flex items-center gap-2 tracking-wider">
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-lg text-sm">A</span>
              <span>ADMIN PANEL</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User profile & actions at bottom */}
        <div className="p-4 border-t border-gray-800 space-y-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-850 transition-colors w-full border border-gray-800"
          >
            <Store className="w-4 h-4 text-blue-500" />
            <span>Quay lại Cửa hàng</span>
          </Link>

          <div className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-850">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.avatar ? (
                <img
                  src={`http://localhost:8080/images/avatar/${user.avatar}`}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-gray-700"
                />
              ) : (
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-extrabold border border-blue-500">
                  {user?.fullName?.[0]?.toUpperCase() || 'A'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate m-0">{user?.fullName}</p>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Quan trị viên</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-gray-950 border-b border-gray-850 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Hệ thống Laptopshop</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-gray-800 text-blue-400 font-bold px-3 py-1 rounded-full border border-gray-750">
              Trạng thái: Hoạt động
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};
