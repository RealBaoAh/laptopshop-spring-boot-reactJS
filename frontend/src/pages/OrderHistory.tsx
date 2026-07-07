import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import api from '../services/api';

interface OrderDetail {
  id: number;
  price: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

interface Order {
  id: number;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  orderDetails: OrderDetail[];
}

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500">Đang tải lịch sử mua hàng...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 m-0 text-left">Lịch Sử Mua Hàng</h1>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden text-left">
              {/* Top Banner Info */}
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-xs sm:text-sm">
                <div className="flex gap-4 sm:gap-6 flex-wrap">
                  <div>
                    <span className="text-gray-500 block text-xs">Mã đơn hàng</span>
                    <span className="font-bold text-gray-900 font-mono">#{order.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Thanh toán</span>
                    <span className="font-semibold text-gray-700">{order.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Tổng giá trị</span>
                    <span className="font-bold text-blue-600">{order.totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Order Body Details */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Left: Products list */}
                <div className="md:col-span-2 divide-y divide-gray-100 space-y-3">
                  {order.orderDetails.map(detail => (
                    <div key={detail.id} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">
                      <img 
                        src={`http://localhost:8080/images/product/${detail.product.image}`}
                        alt={detail.product.name}
                        className="w-12 h-12 object-contain bg-gray-50 border border-gray-100 rounded p-1 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100";
                        }}
                      />
                      <div className="flex-1 space-y-0.5">
                        <Link 
                          to={`/product/${detail.product.id}`}
                          className="font-bold text-gray-900 hover:text-blue-600 text-sm line-clamp-1 block"
                        >
                          {detail.product.name}
                        </Link>
                        <span className="text-xs text-gray-500 font-semibold block">
                          Số lượng: {detail.quantity} &times; {detail.price.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Shipping Info */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-xs sm:text-sm space-y-3">
                  <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-0">
                    Người nhận & giao hàng
                  </h4>
                  <div className="space-y-2 text-gray-600 font-medium">
                    <p className="line-clamp-1">
                      <strong className="text-gray-900">Tên:</strong> {order.receiverName}
                    </p>
                    <p className="line-clamp-1">
                      <strong className="text-gray-900">SĐT:</strong> {order.receiverPhone}
                    </p>
                    <p className="line-clamp-2">
                      <strong className="text-gray-900">Địa chỉ:</strong> {order.receiverAddress}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center text-gray-500 space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Bạn chưa thực hiện đơn hàng nào!</p>
          <Link 
            to="/" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg shadow transition-colors text-sm"
          >
            Mua sắm ngay
          </Link>
        </div>
      )}
    </div>
  );
};
