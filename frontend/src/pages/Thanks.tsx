import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export const Thanks: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      {/* Check Icon */}
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
        <CheckCircle className="w-10 h-10 text-green-600 animate-bounce" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 m-0">Đặt Hàng Thành Công!</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Cảm ơn bạn đã mua hàng tại Laptopshop. Đơn hàng của bạn đang được xử lý.
        </p>
        {orderId && (
          <p className="text-xs text-gray-400 font-mono">Mã đơn hàng: #{orderId}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
        <Link 
          to="/order-history"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          Xem lịch sử mua hàng
        </Link>
        <Link 
          to="/"
          className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 font-bold px-6 py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-1.5"
        >
          Tiếp tục mua sắm
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
