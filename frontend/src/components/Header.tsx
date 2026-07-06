import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User as UserIcon, ShieldAlert, Heart, Search, ChevronDown, Menu, Phone, Mail, Award, MessageCircle, Laptop } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart, clearCartLocal } = useCart();
  const navigate = useNavigate();

  // Search and Suggestions State
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLogout = async () => {
    await logout();
    clearCartLocal();
    navigate('/');
  };

  // Debounced search for suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const delayDebounce = setTimeout(async () => {
        try {
          const res = await api.get(`/api/products/search?q=${searchQuery}`);
          setSuggestions(res.data || []);
          setShowSuggestions(true);
        } catch (e) {
          console.error(e);
        }
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = '/products';
    const params = new URLSearchParams();
    if (category) {
      if (category === 'APPLE') {
        params.append('factory', 'APPLE');
      } else {
        params.append('target', category);
      }
    }
    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }
    const queryString = params.toString();
    navigate(queryString ? `${url}?${queryString}` : url);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs">
      {/* 1. Top Utility Bar */}
      <div className="bg-gray-50 border-b border-gray-200 text-xs text-gray-600 py-2 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              🚚 Miễn phí vận chuyển cho đơn từ 499k
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Award className="w-3.5 h-3.5" />
              Ưu đãi thành viên
            </a>
            <a href="#" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              Hỗ trợ 24/7
            </a>
            <a href="tel:19001234" className="flex items-center gap-1 font-bold text-gray-800 hover:text-blue-600 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              1900 1234
            </a>
            <a href="mailto:contact@laptopshop.vn" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Mail className="w-3.5 h-3.5" />
              contact@laptopshop.vn
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header Middle Area */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-black text-blue-600 flex items-center gap-2 tracking-tight">
              <span className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md">
                <Laptop className="w-6 h-6" />
              </span>
              <span>Laptopshop<span className="text-gray-400 font-normal text-xs block -mt-1 tracking-wide">LAPTOP CHÍNH HÃNG</span></span>
            </Link>
          </div>

          {/* Search Bar Container */}
          <div className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-50 border border-gray-300 rounded-xl overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 h-11">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 h-full border-r border-gray-300 focus:outline-none cursor-pointer"
              >
                <option value="">Tất cả danh mục</option>
                <option value="GAMING">Laptop Gaming</option>
                <option value="SINHVIEN-VANPHONG">Văn Phòng</option>
                <option value="DO-HOA">Đồ Họa Kỹ Thuật</option>
                <option value="THOITRANG">Mỏng Nhẹ Thời Trang</option>
                <option value="APPLE">MacBook (Apple)</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Bạn cần tìm gì hôm nay?"
                className="flex-grow px-3 h-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 h-full flex items-center gap-1.5 transition-colors cursor-pointer text-sm"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </button>
            </form>

            {/* Auto-suggest Search Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto overflow-hidden">
                <div className="p-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Sản phẩm gợi ý
                </div>
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  >
                    <img
                      src={`http://localhost:8080/images/product/${item.image}`}
                      alt={item.name}
                      className="w-10 h-10 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100";
                      }}
                    />
                    <div className="flex-grow">
                      <span className="text-sm font-semibold text-gray-900 block line-clamp-1">{item.name}</span>
                      <span className="text-xs font-black text-blue-600 block">{item.price.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center justify-end gap-5">
            
            {/* User Auth Info */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-xl text-gray-600">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="text-xs text-left">
                {user ? (
                  <div className="group relative cursor-pointer">
                    <span className="text-gray-400 block text-[10px]">Xin chào,</span>
                    <span className="font-bold text-gray-900 flex items-center gap-0.5">
                      {user.fullName.split(' ').pop()} <ChevronDown className="w-3 h-3" />
                    </span>
                    
                    {/* User Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                      <Link to="/order-history" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium">
                        Lịch sử đơn hàng
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-orange-700 hover:bg-orange-50 rounded-lg transition-colors font-medium">
                          <ShieldAlert className="w-4 h-4" />
                          Admin View
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Link to="/login" className="font-bold text-gray-900 hover:text-blue-600 block leading-tight">Đăng nhập</Link>
                    <Link to="/register" className="text-gray-500 hover:text-blue-600 mt-0.5 block leading-tight">Đăng ký thành viên</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Wishlist Icon */}
            <Link to="#" className="relative p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl transition-all" title="Yêu thích">
              <Heart className="w-5 h-5" />
              <span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-blue-600 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                0
              </span>
            </Link>

            {/* Cart Widget */}
            {user ? (
              <Link to="/cart" className="flex items-center gap-2.5 p-2 px-3 hover:bg-blue-50 rounded-xl transition-all border border-gray-100 hover:border-blue-200">
                <div className="relative text-gray-600 hover:text-blue-600">
                  <ShoppingCart className="w-5 h-5" />
                  {cart && cart.sum > 0 && (
                    <span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-blue-600 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {cart.sum}
                    </span>
                  )}
                </div>
                <div className="text-xs text-left hidden sm:block">
                  <span className="text-gray-400 block text-[10px]">Giỏ hàng</span>
                  <span className="font-bold text-gray-950">
                    {cart ? cart.totalPrice.toLocaleString('vi-VN') : 0}đ
                  </span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2.5 p-2 px-3 hover:bg-blue-50 rounded-xl transition-all border border-gray-100 hover:border-blue-200">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <div className="text-xs text-left hidden sm:block">
                  <span className="text-gray-400 block text-[10px]">Giỏ hàng</span>
                  <span className="font-bold text-gray-950">0đ</span>
                </div>
              </Link>
            )}

          </div>

        </div>
      </div>

      {/* 3. Secondary Navigation Menu Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          
          {/* Menu Button */}
          <div className="relative group">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 flex items-center gap-2.5 rounded-t-xl text-sm transition-colors cursor-pointer">
              <Menu className="w-4 h-4" />
              <span>DANH MỤC SẢN PHẨM</span>
              <ChevronDown className="w-4 h-4 opacity-75" />
            </button>

            {/* Sidebar list on hover of header category button (fallback for other pages) */}
            <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40 py-2 rounded-b-xl">
              <Link to="/products?factory=APPLE" className="px-5 py-2.5 hover:bg-blue-50 text-gray-800 hover:text-blue-600 font-medium text-sm flex items-center justify-between border-b border-gray-50">
                <span>MacBook (Apple)</span>
                <span className="text-xs opacity-50">&gt;</span>
              </Link>
              <Link to="/products?factory=ASUS" className="px-5 py-2.5 hover:bg-blue-50 text-gray-800 hover:text-blue-600 font-medium text-sm flex items-center justify-between border-b border-gray-50">
                <span>ASUS Laptop</span>
                <span className="text-xs opacity-50">&gt;</span>
              </Link>
              <Link to="/products?factory=DELL" className="px-5 py-2.5 hover:bg-blue-50 text-gray-800 hover:text-blue-600 font-medium text-sm flex items-center justify-between border-b border-gray-50">
                <span>DELL Laptop</span>
                <span className="text-xs opacity-50">&gt;</span>
              </Link>
              <Link to="/products?factory=HP" className="px-5 py-2.5 hover:bg-blue-50 text-gray-800 hover:text-blue-600 font-medium text-sm flex items-center justify-between border-b border-gray-50">
                <span>HP Laptop</span>
                <span className="text-xs opacity-50">&gt;</span>
              </Link>
              <Link to="/products?factory=LENOVO" className="px-5 py-2.5 hover:bg-blue-50 text-gray-800 hover:text-blue-600 font-medium text-sm flex items-center justify-between border-b border-gray-50">
                <span>LENOVO Laptop</span>
                <span className="text-xs opacity-50">&gt;</span>
              </Link>
              <Link to="/products?target=GAMING" className="px-5 py-2.5 hover:bg-blue-50 text-gray-800 hover:text-blue-600 font-medium text-sm flex items-center justify-between border-b border-gray-50">
                <span>Laptop Gaming</span>
                <span className="text-xs opacity-50">&gt;</span>
              </Link>
              <Link to="/products?target=SINHVIEN-VANPHONG" className="px-5 py-2.5 hover:bg-blue-50 text-gray-800 hover:text-blue-600 font-medium text-sm flex items-center justify-between border-b border-gray-50">
                <span>Laptop Văn Phòng</span>
                <span className="text-xs opacity-50">&gt;</span>
              </Link>
              <Link to="/products?target=DO-HOA" className="px-5 py-2.5 hover:bg-blue-50 text-gray-800 hover:text-blue-600 font-medium text-sm flex items-center justify-between">
                <span>Đồ Họa & Kỹ Thuật</span>
                <span className="text-xs opacity-50">&gt;</span>
              </Link>
            </div>
          </div>

          {/* Main nav items */}
          <nav className="flex space-x-6 sm:space-x-8 pl-8 text-sm">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-bold py-3 transition-colors border-b-2 border-transparent hover:border-blue-600">
              Trang chủ
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 font-bold py-3 transition-colors border-b-2 border-transparent hover:border-blue-600">
              Sản phẩm
            </Link>
            <Link to="/best-sellers" className="text-gray-700 hover:text-blue-600 font-bold py-3 transition-colors border-b-2 border-transparent hover:border-blue-600">
              Bán chạy
            </Link>
            <Link to="/new-arrivals" className="text-gray-700 hover:text-blue-600 font-bold py-3 transition-colors border-b-2 border-transparent hover:border-blue-600">
              Hàng mới
            </Link>
            <Link to="/flash-sale" className="text-gray-700 hover:text-blue-600 font-bold py-3 transition-colors border-b-2 border-transparent hover:border-blue-600">
              Flash Sale
            </Link>
            <span className="text-gray-700 hover:text-blue-600 font-bold py-3 transition-colors cursor-pointer border-b-2 border-transparent hover:border-blue-600">
              Ưu đãi
            </span>
            <span className="text-gray-700 hover:text-blue-600 font-bold py-3 transition-colors cursor-pointer border-b-2 border-transparent hover:border-blue-600">
              Liên hệ
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
};

