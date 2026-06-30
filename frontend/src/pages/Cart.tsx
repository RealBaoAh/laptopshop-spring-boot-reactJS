import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { cart, loading, removeFromCart, updateCartItems } = useCart();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    if (cart) {
      const qMap: Record<number, number> = {};
      cart.items.forEach(item => {
        qMap[item.id] = item.quantity;
      });
      setQuantities(qMap);
    }
  }, [cart]);

  const handleQtyChange = (cartDetailId: number, qty: number) => {
    setQuantities(prev => ({
      ...prev,
      [cartDetailId]: Math.max(qty, 1),
    }));
  };

  const handleUpdateCart = async () => {
    const payload = Object.entries(quantities).map(([id, quantity]) => ({
      id: Number(id),
      quantity,
    }));
    const success = await updateCartItems(payload);
    if (success) {
      alert("Đã cập nhật giỏ hàng!");
    } else {
      alert("Cập nhật giỏ hàng thất bại!");
    }
  };

  const handleRemove = async (cartDetailId: number) => {
    if (window.confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      await removeFromCart(cartDetailId);
    }
  };

  if (loading && !cart) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium">Giỏ hàng của bạn đang trống!</p>
        <Link 
          to="/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg shadow transition-colors text-sm"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 m-0 text-left">Giỏ Hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <span className="col-span-6">Sản phẩm</span>
              <span className="col-span-2 text-center">Giá</span>
              <span className="col-span-2 text-center">Số lượng</span>
              <span className="col-span-2 text-right">Tổng</span>
            </div>

            {/* Item rows */}
            <div className="divide-y divide-gray-100">
              {cart.items.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center">
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center gap-4">
                    <img 
                      src={`http://localhost:8080/images/product/${item.product.image}`}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain bg-gray-50 border border-gray-100 rounded-lg p-2 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300";
                      }}
                    />
                    <div className="space-y-1">
                      <Link 
                        to={`/product/${item.product.id}`}
                        className="font-bold text-gray-900 hover:text-blue-600 text-sm line-clamp-1 block text-left"
                      >
                        {item.product.name}
                      </Link>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2 text-center text-sm font-semibold text-gray-700">
                    {item.price.toLocaleString('vi-VN')} đ
                  </div>

                  {/* Quantity Selector */}
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50 text-xs">
                      <button 
                        onClick={() => handleQtyChange(item.id, (quantities[item.id] || 1) - 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 font-semibold text-gray-900">{quantities[item.id] || item.quantity}</span>
                      <button 
                        onClick={() => handleQtyChange(item.id, (quantities[item.id] || 1) + 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-2 text-right text-sm font-bold text-blue-600">
                    {((item.price * (quantities[item.id] || item.quantity))).toLocaleString('vi-VN')} đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center px-2">
            <Link to="/" className="text-sm font-semibold text-blue-600 hover:underline">
              &larr; Tiếp tục mua sắm
            </Link>
            <button
              onClick={handleUpdateCart}
              className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-bold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Cập nhật giỏ hàng
            </button>
          </div>
        </div>

        {/* Right: Checkout Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h3 className="font-extrabold text-gray-900 text-lg border-b border-gray-100 pb-3 mb-0 text-left">
            Tóm tắt đơn hàng
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Tạm tính ({cart.sum} sản phẩm)</span>
              <span>{cart.totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Phí vận chuyển</span>
              <span className="text-green-600 font-semibold">Miễn phí</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-base text-gray-900">
              <span>Tổng cộng</span>
              <span className="text-blue-600 text-lg font-extrabold">{cart.totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors text-sm cursor-pointer"
          >
            Tiến hành đặt hàng
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
