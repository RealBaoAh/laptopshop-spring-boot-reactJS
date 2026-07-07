import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flame, Percent, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  shortDesc: string;
  factory: string;
  target: string;
  sold: number;
  quantity: number;
}

export const FlashSale: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Countdown timer state: 02 hours, 45 minutes, 10 seconds initially
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer back to 3 hours loop
          return { hours: 3, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchFlashSaleProducts = async () => {
    setLoading(true);
    try {
      // Get products (we mock all products as flash sale items with calculated original prices)
      const res = await api.get(`/api/products?page=${currentPage}`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error("Error fetching flash sale products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashSaleProducts();
  }, [currentPage]);

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để mua sản phẩm Flash Sale!");
      return;
    }
    const success = await addToCart(productId, 1);
    if (success) {
      alert("Đã thêm sản phẩm vào giỏ hàng với giá ưu đãi!");
    } else {
      alert("Không thể thêm sản phẩm!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Flash Sale Banner & Countdown */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        {/* Banner Details */}
        <div className="space-y-3 relative text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-red-900 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider animate-bounce shadow-md">
            <Flame className="w-4 h-4 fill-red-800 text-red-800" /> Giờ Vàng Giá Sốc
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight m-0 text-white drop-shadow-sm">
            FLASH SALE MỖI NGÀY
          </h1>
          <p className="text-red-100 text-sm max-w-md leading-relaxed m-0">
            Cơ hội sở hữu các siêu phẩm Laptop với giá sập sàn. Số lượng có hạn, nhanh tay săn ngay kẻo lỡ!
          </p>
        </div>

        {/* Timer Box */}
        <div className="bg-black/25 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-center gap-3 relative z-10 w-full sm:w-auto min-w-[280px]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Clock className="w-4 h-4" /> Kết thúc sau
          </div>
          <div className="flex items-center gap-2">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="bg-white text-gray-900 text-2xl font-black w-12 h-12 rounded-lg flex items-center justify-center shadow-md">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold text-red-200 mt-1 uppercase">Giờ</span>
            </div>
            <span className="text-xl font-bold text-white mb-5">:</span>
            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="bg-white text-gray-900 text-2xl font-black w-12 h-12 rounded-lg flex items-center justify-center shadow-md">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold text-red-200 mt-1 uppercase">Phút</span>
            </div>
            <span className="text-xl font-bold text-white mb-5">:</span>
            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span className="bg-red-500 text-white text-2xl font-black w-12 h-12 rounded-lg flex items-center justify-center shadow-md animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold text-red-200 mt-1 uppercase">Giây</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Info */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
        <div>
          <span className="font-bold">Lưu ý mua hàng:</span> Mỗi khách hàng chỉ được mua tối đa 1 sản phẩm Flash Sale trong một phiên giao dịch. Giá khuyến mãi chỉ có hiệu lực khi hoàn tất thanh toán trong thời gian đếm ngược của chương trình.
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-xl"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => {
            // Calculate mock discount based on product ID
            const discountPercent = 15 + (product.id % 5) * 5; // 15%, 20%, 25%, 30%, 35%
            const originalPrice = Math.round(product.price * (1 + discountPercent / 100));
            // Mock stock progress percentage
            const percentSold = 30 + (product.id * 14) % 60;
            const remaining = Math.max(1, product.quantity - Math.round(product.quantity * (percentSold / 100)));

            return (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group bg-white rounded-2xl border border-gray-250 hover:border-red-400 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col relative p-4"
              >
                {/* Discount Tag */}
                <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg z-10 flex items-center gap-0.5 shadow-md">
                  <Percent className="w-3 h-3" />
                  Giảm {discountPercent}%
                </span>

                {/* Brand Logo */}
                <span className="absolute top-4 right-4 bg-gray-100 text-gray-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {product.factory}
                </span>

                {/* Product Image */}
                <div className="aspect-video bg-gray-50 overflow-hidden relative rounded-xl border border-gray-100 flex items-center justify-center p-4 mt-6 mb-4">
                  <img 
                    src={`http://localhost:8080/images/product/${product.image}`}
                    alt={product.name}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-gray-900 text-sm group-hover:text-red-650 transition-colors line-clamp-1 m-0">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed m-0">
                      {product.shortDesc}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Pricing */}
                    <div>
                      <span className="text-xs text-gray-400 line-through block leading-none">
                        {originalPrice.toLocaleString('vi-VN')} đ
                      </span>
                      <span className="text-lg font-black text-red-600 block mt-1 leading-none">
                        {product.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200">
                        <div 
                          className="bg-gradient-to-r from-red-600 to-orange-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percentSold}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold">
                        <span>Đã bán: <span className="text-red-600 font-extrabold">{Math.round(percentSold)}%</span></span>
                        <span>Còn lại: <span className="text-gray-900 font-extrabold">{remaining} máy</span></span>
                      </div>
                    </div>

                    {/* Buy Now Button */}
                    <button 
                      onClick={(e) => handleAddToCart(e, product.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md hover:shadow-lg border-none"
                    >
                      <Flame className="w-4 h-4 fill-white text-white" />
                      MUA NGAY
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 py-16 text-center text-gray-500 space-y-2 rounded-2xl">
          <span className="text-4xl block">⚡</span>
          <p className="font-semibold text-gray-700">Chương trình Flash Sale tạm thời kết thúc.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-4">
          <button 
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3.5 py-1.5 rounded-lg border border-gray-200">
            Trang {currentPage} / {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};
