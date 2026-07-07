import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Landmark, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Checkout: React.FC = () => {
  const { cart, clearCartLocal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [receiverName, setReceiverName] = useState(user?.fullName || '');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;

    setLoading(true);
    try {
      const res = await api.post('/api/orders', {
        receiverName,
        receiverAddress,
        receiverPhone,
        paymentMethod
      });

      if (res.data && res.data.success) {
        clearCartLocal();
        if (paymentMethod === 'VNPAY') {
          // Mock VNPay redirect
          alert(`Chuyển hướng đến cổng thanh toán VNPay số tiền: ${res.data.totalPrice.toLocaleString('vi-VN')} đ`);
          // Or just redirect to thank you
        }
        navigate('/thanks', { state: { orderId: res.data.orderId } });
      } else {
        alert("Đặt hàng thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống!</p>
        <Link to="/" className="text-blue-600 hover:underline">Quay về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/cart" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Quay lại giỏ hàng
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 m-0 text-left">Đặt Hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Info Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 mb-0 text-left">
            Thông tin giao hàng
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-1 text-left">
              <label className="text-sm font-semibold text-gray-700">Họ và tên người nhận</label>
              <input
                type="text"
                required
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Nguyễn Bảo"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 font-medium"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1 text-left">
              <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
              <input
                type="tel"
                required
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="09XXXXXXXX"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 font-medium"
              />
            </div>

            {/* Address */}
            <div className="space-y-1 text-left">
              <label className="text-sm font-semibold text-gray-700">Địa chỉ nhận hàng</label>
              <input
                type="text"
                required
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 font-medium"
              />
            </div>

            {/* Payment Options */}
            <div className="space-y-3 pt-2 text-left">
              <label className="text-sm font-semibold text-gray-700">Phương thức thanh toán</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* COD option */}
                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="sr-only"
                    />
                    <Truck className={`w-5 h-5 ${paymentMethod === 'COD' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-gray-900 block">Thanh toán khi nhận (COD)</span>
                      <span className="text-xs text-gray-500 block">Thanh toán bằng tiền mặt khi giao hàng</span>
                    </div>
                  </div>
                  {paymentMethod === 'COD' && <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                </label>

                {/* VNPAY option */}
                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all ${paymentMethod === 'VNPAY' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={() => setPaymentMethod('VNPAY')}
                      className="sr-only"
                    />
                    <Landmark className={`w-5 h-5 ${paymentMethod === 'VNPAY' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-gray-900 block">Cổng VNPAY (Thử nghiệm)</span>
                      <span className="text-xs text-gray-500 block">Thanh toán trực tuyến bằng VNPAY QR</span>
                    </div>
                  </div>
                  {paymentMethod === 'VNPAY' && <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                </label>
              </div>
            </div>

            {/* Confirm button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-6 cursor-pointer"
            >
              {loading ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng'}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 mb-0 text-left">
            Đơn hàng của bạn
          </h3>

          {/* Items list */}
          <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
            {cart.items.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={`http://localhost:8080/images/product/${item.product.image}`}
                    alt={item.product.name}
                    className="w-10 h-10 object-contain bg-gray-50 border border-gray-100 rounded p-1 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100";
                    }}
                  />
                  <div className="text-left">
                    <span className="font-bold text-gray-900 line-clamp-1">{item.product.name}</span>
                    <span className="text-xs text-gray-500 font-semibold">SL: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-semibold text-gray-700">
                  {((item.price * item.quantity)).toLocaleString('vi-VN')} đ
                </span>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Tạm tính</span>
              <span>{cart.totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Phí vận chuyển</span>
              <span className="text-green-600 font-semibold">Miễn phí</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900 text-base">
              <span>Tổng cộng</span>
              <span className="text-blue-600 text-lg font-extrabold">{cart.totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
