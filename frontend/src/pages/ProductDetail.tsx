import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  detailDesc: string;
  shortDesc: string;
  factory: string;
  target: string;
  quantity: number;
  sold?: number;
}

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const fetchRelatedProducts = async (currentProduct: Product) => {
    try {
      const res = await api.get(`/api/products?page=1&factory=${currentProduct.factory}`);
      if (res.data && res.data.products) {
        const filtered = res.data.products.filter((p: Product) => p.id !== currentProduct.id);
        if (filtered.length > 0) {
          setRelatedProducts(filtered.slice(0, 4));
        } else {
          // If no other products from the same factory, get any products
          const backupRes = await api.get(`/api/products?page=1`);
          if (backupRes.data && backupRes.data.products) {
            const backupFiltered = backupRes.data.products.filter((p: Product) => p.id !== currentProduct.id);
            setRelatedProducts(backupFiltered.slice(0, 4));
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data);
      if (res.data) {
        await fetchRelatedProducts(res.data);
      }
    } catch (e) {
      console.error(e);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate('/login');
      return;
    }
    if (!product) return;
    const success = await addToCart(product.id, quantity);
    if (success) {
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } else {
      alert("Không thể thêm sản phẩm!");
    }
  };

  const handleAddRelatedToCart = async (e: React.MouseEvent, productId: number) => {
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm!</p>
        <Link to="/" className="text-blue-600 hover:underline">Quay về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        {/* Left: Product Image */}
        <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-6 border border-gray-100">
          <img 
            src={`http://localhost:8080/images/product/${product.image}`}
            alt={product.name}
            className="max-h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800";
            }}
          />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Tags */}
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.factory}
              </span>
              <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.target.replace('-', ' ')}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight m-0">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-3xl font-extrabold text-blue-600">
              {product.price.toLocaleString('vi-VN')} đ
            </div>

            {/* Short description */}
            <p className="text-gray-600 text-sm leading-relaxed border-t border-b border-gray-100 py-4">
              {product.shortDesc}
            </p>

            {/* Details details */}
            <div className="space-y-2 text-sm text-gray-700">
              <span className="font-semibold block">Chi tiết kỹ thuật:</span>
              <p className="whitespace-pre-line text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {product.detailDesc}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Quantity Selector & Add to Cart */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <button 
                  onClick={() => setQuantity(q => Math.max(q - 1, 1))}
                  className="px-3.5 py-2 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-5 font-semibold text-gray-900 text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3.5 py-2 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 flex items-center gap-2 text-sm flex-1 sm:flex-initial justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ hàng
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-4 text-center border-t border-gray-100">
              <div className="flex flex-col items-center gap-1 text-[10px] text-gray-500 font-medium">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span>Bảo hành chính hãng</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[10px] text-gray-500 font-medium">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Giao hàng tận nơi</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[10px] text-gray-500 font-medium">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <span>Đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 mt-16">
          <div className="flex items-center gap-2 border-b border-gray-150 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 m-0">Sản phẩm liên quan</h2>
            <span className="text-sm text-gray-400 font-medium">({relatedProducts.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(item => (
              <Link 
                key={item.id} 
                to={`/product/${item.id}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-50 overflow-hidden relative border-b border-gray-100">
                  <img 
                    src={`http://localhost:8080/images/product/${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500";
                    }}
                  />
                  {item.sold !== undefined && item.sold > 0 && (
                    <span className="absolute top-3 left-3 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-red-200">
                      🔥 Đã bán {item.sold}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                      {item.factory}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1 m-0">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed m-0">
                      {item.shortDesc}
                    </p>
                  </div>

                  <div className="space-y-3 mt-3">
                    <div className="text-sm font-extrabold text-blue-600">
                      {item.price.toLocaleString('vi-VN')} đ
                    </div>

                    <button 
                      onClick={(e) => handleAddRelatedToCart(e, item.id)}
                      className="w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 font-bold py-2 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 text-[11px] cursor-pointer"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
