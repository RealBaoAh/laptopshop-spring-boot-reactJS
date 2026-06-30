import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, X, ClipboardList, Info } from 'lucide-react';
import api from '../../services/api';

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
  totalPrice: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  orderDetails: OrderDetail[];
}

export const OrderManage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals visibility state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState('PENDING');
  const [errorMessage, setErrorMessage] = useState('');

  const statuses = [
    { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    { value: 'SHIPPED', label: 'Đang vận chuyển', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { value: 'DELIVERED', label: 'Đã giao hàng', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/orders?page=${currentPage}&size=8`);
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleOpenEdit = (order: Order) => {
    setSelectedOrder(order);
    setStatus(order.status || 'PENDING');
    setErrorMessage('');
    setShowEditModal(true);
  };

  const handleOpenDelete = (order: Order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedOrder) return;

    try {
      await api.put(`/api/admin/orders/${selectedOrder.id}`, {
        status: status,
      });

      setShowEditModal(false);
      fetchOrders();
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedOrder) return;
    try {
      await api.delete(`/api/admin/orders/${selectedOrder.id}`);
      setShowDeleteModal(false);
      fetchOrders();
    } catch (e) {
      console.error(e);
      alert("Không thể xóa đơn hàng này.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-extrabold text-white m-0">Quản lý Đơn hàng</h1>
        <p className="text-xs text-gray-400 mt-1">Theo dõi, cập nhật trạng thái đơn hàng từ khách hàng.</p>
      </div>

      {/* Orders table */}
      <div className="bg-gray-950 border border-gray-850 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-gray-500 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-850 bg-gray-900/60 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">ID Đơn</th>
                  <th className="py-4 px-6">Khách hàng</th>
                  <th className="py-4 px-6">Tổng tiền</th>
                  <th className="py-4 px-6">Thanh toán</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850 text-sm">
                {orders.map(o => {
                  const statusInfo = statuses.find(s => s.value === o.status) || {
                    label: o.status,
                    color: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  };
                  return (
                    <tr key={o.id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="py-4 px-6 text-gray-500 font-bold">#{o.id}</td>
                      <td className="py-4 px-6 text-gray-200">
                        <p className="font-bold m-0 leading-tight">{o.receiverName}</p>
                        <span className="text-xs text-gray-500 mt-0.5 block">{o.receiverPhone}</span>
                      </td>
                      <td className="py-4 px-6 text-blue-400 font-extrabold">
                        {o.totalPrice.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        <p className="m-0 text-xs font-semibold uppercase">{o.paymentMethod}</p>
                        <span className="text-[10px] text-gray-500 block mt-0.5 font-bold uppercase tracking-wider">
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(o)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                            title="Chi tiết đơn hàng"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(o)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                            title="Cập nhật trạng thái"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(o)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Xóa đơn hàng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500 space-y-2">
            <span className="text-3xl block">📦</span>
            <p className="font-semibold text-gray-400">Không tìm thấy đơn hàng nào.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-900/40 border-t border-gray-850 px-6 py-4 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Trang {currentPage} trên tổng số {totalPages} trang
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-850 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-850 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- DETAIL MODAL --- */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white m-0 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-500" />
                <span>Chi tiết đơn hàng #{selectedOrder.id}</span>
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Delivery Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-950 p-5 rounded-2xl border border-gray-850">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Người nhận hàng</span>
                  <p className="font-bold text-gray-200 m-0">{selectedOrder.receiverName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedOrder.receiverPhone}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Địa chỉ giao hàng</span>
                  <p className="text-xs text-gray-300 leading-relaxed m-0">{selectedOrder.receiverAddress}</p>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider m-0">Danh sách sản phẩm đã đặt</h4>
                <div className="bg-gray-950 border border-gray-850 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-850 bg-gray-900/60 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Sản phẩm</th>
                        <th className="py-3 px-4 text-center">Số lượng</th>
                        <th className="py-3 px-4 text-right">Đơn giá</th>
                        <th className="py-3 px-4 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-850 text-xs">
                      {selectedOrder.orderDetails?.map(item => (
                        <tr key={item.id} className="hover:bg-gray-900/20">
                          <td className="py-3 px-4 font-bold text-gray-200 flex items-center gap-2">
                            {item.product?.image ? (
                              <img
                                src={`http://localhost:8080/images/product/${item.product.image}`}
                                alt="Laptop"
                                className="w-8 h-8 rounded object-contain bg-white/5 border border-gray-800 p-0.5"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=50";
                                }}
                              />
                            ) : (
                              <span className="text-base">💻</span>
                            )}
                            <span className="truncate max-w-xs">{item.product?.name || 'Sản phẩm đã xóa'}</span>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-300 font-semibold">{item.quantity}</td>
                          <td className="py-3 px-4 text-right text-gray-300">{item.price.toLocaleString('vi-VN')} đ</td>
                          <td className="py-3 px-4 text-right text-blue-400 font-extrabold">
                            {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary calculations */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Tạm tính:</span>
                    <span className="text-gray-200 font-bold">{selectedOrder.totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Phí giao hàng:</span>
                    <span className="text-emerald-400 font-bold">Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-850 pt-2.5 flex items-center justify-between text-base font-extrabold">
                    <span className="text-white">Tổng thanh toán:</span>
                    <span className="text-blue-500">{selectedOrder.totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 bg-gray-950 hover:bg-gray-850 border border-gray-800 rounded-xl text-sm font-bold text-gray-300 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl relative flex flex-col">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white m-0">Cập Nhật Trạng Thái Đơn Hàng</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Đơn hàng</label>
                <p className="text-sm font-bold text-white m-0">Mã đơn: #{selectedOrder.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">Khách hàng: {selectedOrder.receiverName}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Chọn Trạng Thái *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer font-bold"
                >
                  {statuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 bg-gray-950 hover:bg-gray-850 border border-gray-800 rounded-xl text-sm font-bold text-gray-300 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRM MODAL --- */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-white m-0">Xác nhận xóa đơn hàng</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bạn có chắc chắn muốn xóa đơn hàng <span className="text-white font-bold">#{selectedOrder.id}</span> của {selectedOrder.receiverName}?
              Hành động này sẽ xóa vĩnh viễn đơn hàng và thông tin chi tiết đơn hàng tương ứng.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4.5 py-2 bg-gray-950 hover:bg-gray-850 border border-gray-800 rounded-xl text-sm font-bold text-gray-300 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="px-4.5 py-2 bg-red-650 hover:bg-red-650/80 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
