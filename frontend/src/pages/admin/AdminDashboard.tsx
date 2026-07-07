import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, ClipboardList, TrendingUp } from 'lucide-react';
import api from '../../services/api';

interface DashboardStats {
  countUsers: number;
  countProducts: number;
  countOrders: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/dashboard');
        setStats(res.data);
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Tổng thành viên',
      value: stats?.countUsers ?? 0,
      icon: <Users className="w-8 h-8 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-500/5',
      desc: 'Người dùng đã đăng ký tài khoản'
    },
    {
      title: 'Tổng sản phẩm',
      value: stats?.countProducts ?? 0,
      icon: <ShoppingBag className="w-8 h-8 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/5',
      desc: 'Các sản phẩm Laptop trên kệ hàng'
    },
    {
      title: 'Tổng đơn hàng',
      value: stats?.countOrders ?? 0,
      icon: <ClipboardList className="w-8 h-8 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-500/5',
      desc: 'Đơn hàng được đặt trong hệ thống'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-800 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-850 p-8 rounded-2xl border border-blue-600/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white m-0">Chào mừng trở lại, Admin!</h1>
          <p className="text-blue-100 text-sm max-w-xl">
            Đây là trung tâm điều khiển của hệ thống Laptopshop. Tại đây bạn có thể quản lý người dùng, chỉnh sửa sản phẩm, và cập nhật tình trạng đơn hàng.
          </p>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`p-6 border rounded-2xl shadow-sm flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-lg ${card.color}`}
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{card.title}</span>
              <span className="text-3xl font-extrabold text-white block leading-none">{card.value}</span>
              <span className="text-[10px] text-gray-500 font-semibold block">{card.desc}</span>
            </div>
            <div className="p-4 bg-gray-850 rounded-xl border border-gray-850">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System activity mock / summary */}
        <div className="bg-gray-950 border border-gray-850 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-extrabold text-white m-0 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Lối tắt hành động quản lý
          </h3>
          <p className="text-xs text-gray-400">Các hành động nhanh thường dùng giúp tăng năng suất quản lý cửa hàng của bạn.</p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Link
              to="/admin/users"
              className="p-4 bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl text-center font-bold text-sm text-gray-200 hover:text-white transition-all cursor-pointer"
            >
              Thêm Thành Viên
            </Link>
            <Link
              to="/admin/products"
              className="p-4 bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl text-center font-bold text-sm text-gray-200 hover:text-white transition-all cursor-pointer"
            >
              Thêm Sản Phẩm mới
            </Link>
          </div>
        </div>

        {/* System Settings Status */}
        <div className="bg-gray-950 border border-gray-850 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-extrabold text-white m-0">Trạng thái hạ tầng</h3>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs border-b border-gray-900 pb-2">
              <span className="text-gray-400">Cơ sở dữ liệu (MySQL/MariaDB)</span>
              <span className="font-semibold text-emerald-400">Đang kết nối</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-gray-900 pb-2">
              <span className="text-gray-400">Spring Boot REST API Web Server</span>
              <span className="font-semibold text-emerald-400">Hoạt động (Port 8080)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Dịch vụ tải lên tệp tin (Multipart)</span>
              <span className="font-semibold text-emerald-400">Sẵn sàng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
