import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto border-t border-gray-800">
      {/* 1. Main Footer Link Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
          
          {/* Col 1: Shop Brand Intro */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center">
                <Laptop className="w-4.5 h-4.5" />
              </span>
              <span>Laptopshop<span className="text-gray-500 font-normal text-[10px] block -mt-1 tracking-wide">LAPTOP CHÍNH HÃNG</span></span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed">
              Hệ thống cửa hàng phân phối laptop chính hãng hàng đầu tại Việt Nam. Cung cấp các dòng máy đa dạng từ học tập văn phòng đến gaming chuyên nghiệp với dịch vụ hậu mãi và bảo hành tốt nhất.
            </p>
            <div className="flex items-center gap-3 pt-2 text-white">
              <a href="#" className="hover:text-blue-500 transition-colors bg-gray-800 p-2 rounded-xl" title="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V2h-3a5 5 0 0 0-5 5v1z"/></svg>
              </a>
              <a href="#" className="hover:text-red-500 transition-colors bg-gray-800 p-2 rounded-xl" title="Youtube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2c-.6 2-.6 6-.6 6s0 4 .6 6a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.6-2 .6-6 .6-6s0-4-.6-6zM9.8 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Customer Policies */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2 list-none p-0 text-xs font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả 1-1</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Phương thức thanh toán</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách giao hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hỗ trợ kỹ thuật từ xa</a></li>
            </ul>
          </div>

          {/* Col 3: Brand Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Thương Hiệu Laptop</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <div className="space-y-2">
                <Link to="/products?factory=APPLE" className="hover:text-white transition-colors block">Apple MacBook</Link>
                <Link to="/products?factory=ASUS" className="hover:text-white transition-colors block">ASUS Laptop</Link>
                <Link to="/products?factory=DELL" className="hover:text-white transition-colors block">DELL Laptop</Link>
              </div>
              <div className="space-y-2">
                <Link to="/products?factory=HP" className="hover:text-white transition-colors block">HP Laptop</Link>
                <Link to="/products?factory=LENOVO" className="hover:text-white transition-colors block">Lenovo ThinkPad</Link>
                <Link to="/products?factory=ACER" className="hover:text-white transition-colors block">Acer Laptop</Link>
              </div>
            </div>
          </div>

          {/* Col 4: Contact info */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Liên Hệ Cửa Hàng</h4>
            <div className="space-y-2.5 text-xs">
              <p className="leading-relaxed m-0 text-gray-400">
                📍 <strong>Địa chỉ:</strong> Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội.
              </p>
              <p className="m-0 text-gray-400">
                📞 <strong>Hotline hỗ trợ:</strong> <a href="tel:19001234" className="text-white hover:text-blue-500 font-bold">1900 1234</a>
              </p>
              <p className="m-0 text-gray-400">
                ✉️ <strong>Email liên hệ:</strong> <a href="mailto:contact@laptopshop.vn" className="text-white hover:text-blue-500">contact@laptopshop.vn</a>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Bottom Copyright Area */}
      <div className="border-t border-gray-800 bg-gray-950 py-6 text-xs font-medium text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="m-0">
            &copy; {new Date().getFullYear()} Laptopshop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Quy chế hoạt động</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
