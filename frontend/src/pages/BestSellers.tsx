import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
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
}

export const BestSellers: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBestSellers = async () => {
    setLoading(true);
    try {
      // call api with sort=ban-chay
      const res = await api.get(`/api/products?page=${currentPage}&sort=ban-chay`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, [currentPage]);

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    const success = await addToCart(productId, 1);
    if (success) {
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } else {
      alert("Không thể thêm sản phẩm!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-650 via-orange-600 to-amber-500 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-48 sm:h-56">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="space-y-2 relative">
          <span className="inline-flex items-center gap-1 bg-white/20 border border-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" /> Top Bán Chạy Nhất
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight m-0 text-white">Sản Phẩm Đang Cháy Hàng</h1>
          <p className="text-red-100 text-sm max-w-lg leading-relaxed">
            Danh sách các dòng Laptop được ưa chuộng và bán chạy nhất tại Laptopshop. Đánh giá cao từ người dùng về hiệu năng và chất lượng.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-50 overflow-hidden relative border-b border-gray-100">
                <img 
                  src={`http://localhost:8080/images/product/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500";
                  }}
                />
                <span className="absolute top-3 left-3 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-red-200 flex items-center gap-1">
                  🔥 Đã bán {product.sold || 0}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>

                <div className="space-y-4 mt-4">
                  {/* Price */}
                  <div className="text-base font-extrabold text-blue-600">
                    {product.price.toLocaleString('vi-VN')} đ
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => handleAddToCart(e, product.id)}
                    className="w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 font-bold py-2.5 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 py-16 text-center text-gray-500 space-y-2 rounded-2xl">
          <span className="text-4xl block">🛍️</span>
          <p className="font-semibold text-gray-700">Chưa có sản phẩm bán chạy nào.</p>
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
