import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import api from '../../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  detailDesc: string;
  shortDesc: string;
  quantity: number;
  factory: string;
  target: string;
}

export const ProductManage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals visibility state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [detailDesc, setDetailDesc] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [quantity, setQuantity] = useState('');
  const [factory, setFactory] = useState('APPLE');
  const [target, setTarget] = useState('SINHVIEN-VANPHONG');
  const [productFile, setProductFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Default options matching DB and specs
  const factories = ["APPLE", "ASUS", "DELL", "HP", "ACER", "LENOVO"];
  const targets = [
    { value: "GAMING", label: "Gaming" },
    { value: "SINHVIEN-VANPHONG", label: "Sinh viên - Văn phòng" },
    { value: "THOITRANG", label: "Thời trang mỏng nhẹ" },
    { value: "DO-HOA", label: "Đồ họa kỹ thuật" }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/products?page=${currentPage}&size=8`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleOpenCreate = () => {
    setName('');
    setPrice('');
    setDetailDesc('');
    setShortDesc('');
    setQuantity('');
    setFactory('APPLE');
    setTarget('SINHVIEN-VANPHONG');
    setProductFile(null);
    setErrorMessage('');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (pr: Product) => {
    setSelectedProduct(pr);
    setName(pr.name || '');
    setPrice(pr.price ? pr.price.toString() : '');
    setDetailDesc(pr.detailDesc || '');
    setShortDesc(pr.shortDesc || '');
    setQuantity(pr.quantity ? pr.quantity.toString() : '');
    setFactory(pr.factory || 'APPLE');
    setTarget(pr.target || 'SINHVIEN-VANPHONG');
    setProductFile(null);
    setErrorMessage('');
    setShowEditModal(true);
  };

  const handleOpenDelete = (pr: Product) => {
    setSelectedProduct(pr);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !price || !quantity || !shortDesc) {
      setErrorMessage('Vui lòng nhập đầy đủ tên, giá, số lượng và mô tả ngắn.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('detailDesc', detailDesc);
      formData.append('shortDesc', shortDesc);
      formData.append('quantity', quantity);
      formData.append('factory', factory);
      formData.append('target', target);
      if (productFile) {
        formData.append('productFile', productFile);
      }

      await api.post('/api/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowCreateModal(false);
      fetchProducts();
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedProduct) return;
    if (!name || !price || !quantity) {
      setErrorMessage('Tên, giá, số lượng không được trống.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('detailDesc', detailDesc);
      formData.append('shortDesc', shortDesc);
      formData.append('quantity', quantity);
      formData.append('factory', factory);
      formData.append('target', target);
      if (productFile) {
        formData.append('productFile', productFile);
      }

      await api.put(`/api/admin/products/${selectedProduct.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowEditModal(false);
      fetchProducts();
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedProduct) return;
    try {
      await api.delete(`/api/admin/products/${selectedProduct.id}`);
      setShowDeleteModal(false);
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert("Không thể xóa sản phẩm này.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white m-0">Quản lý Sản phẩm</h1>
          <p className="text-xs text-gray-400 mt-1">Danh sách tất cả các Laptop hiện có trên kệ hàng.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Products table */}
      <div className="bg-gray-950 border border-gray-850 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-gray-500 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold">Đang tải danh sách sản phẩm...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-850 bg-gray-900/60 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Sản phẩm</th>
                  <th className="py-4 px-6">Đơn giá</th>
                  <th className="py-4 px-6">Kho hàng</th>
                  <th className="py-4 px-6">Thương hiệu / Phân khúc</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850 text-sm">
                {products.map(pr => (
                  <tr key={pr.id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="py-4 px-6 text-gray-500 font-bold">{pr.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 max-w-sm">
                        {pr.image ? (
                          <img
                            src={`http://localhost:8080/images/product/${pr.image}`}
                            alt={pr.name}
                            className="w-12 h-12 rounded-lg object-contain bg-white/5 border border-gray-800 p-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-gray-600 border border-gray-800">
                            💻
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-gray-100 m-0 leading-tight truncate" title={pr.name}>{pr.name}</p>
                          <span className="text-xs text-gray-500 mt-0.5 block truncate max-w-xs">{pr.shortDesc}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-blue-400 font-extrabold">
                      {pr.price.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      <span className="font-medium">{pr.quantity} cái</span>
                    </td>
                    <td className="py-4 px-6 space-y-1">
                      <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {pr.factory}
                      </span>
                      <span className="block text-[11px] text-gray-400">
                        {targets.find(t => t.value === pr.target)?.label || pr.target}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(pr)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                          title="Sửa sản phẩm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(pr)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500 space-y-2">
            <span className="text-3xl block">💻</span>
            <p className="font-semibold text-gray-400">Không tìm thấy sản phẩm nào.</p>
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

      {/* --- CREATE MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white m-0">Thêm Laptop Mới</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Tên Laptop *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Laptop Asus Zenbook Oled UX3405"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Đơn giá (đ) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="25000000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Số lượng kho *</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Hãng sản xuất *</label>
                  <select
                    value={factory}
                    onChange={(e) => setFactory(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {factories.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nhu cầu sử dụng *</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {targets.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Mô tả ngắn *</label>
                <textarea
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Intel Core Ultra 5, 16GB RAM, 512GB SSD..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Mô tả chi tiết</label>
                <textarea
                  value={detailDesc}
                  onChange={(e) => setDetailDesc(e.target.value)}
                  rows={4}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Thông số kỹ thuật chi tiết..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase block">Ảnh sản phẩm *</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 bg-gray-950 hover:bg-gray-850 border border-gray-850 px-4 py-2.5 rounded-xl cursor-pointer transition-colors text-sm font-semibold text-gray-300">
                    <Upload className="w-4 h-4 text-blue-500" />
                    <span>Chọn hình ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setProductFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-500 truncate max-w-xs">
                    {productFile ? productFile.name : 'Chưa chọn hình ảnh'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-gray-950 hover:bg-gray-850 border border-gray-800 rounded-xl text-sm font-bold text-gray-300 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
                >
                  Tạo mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white m-0">Cập Nhật Laptop</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Tên Laptop *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Laptop Asus Zenbook Oled UX3405"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Đơn giá (đ) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="25000000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Số lượng kho *</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Hãng sản xuất *</label>
                  <select
                    value={factory}
                    onChange={(e) => setFactory(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {factories.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nhu cầu sử dụng *</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {targets.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Mô tả ngắn *</label>
                <textarea
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Intel Core Ultra 5, 16GB RAM, 512GB SSD..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Mô tả chi tiết</label>
                <textarea
                  value={detailDesc}
                  onChange={(e) => setDetailDesc(e.target.value)}
                  rows={4}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Thông số kỹ thuật chi tiết..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase block">Đổi ảnh sản phẩm</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 bg-gray-950 hover:bg-gray-850 border border-gray-850 px-4 py-2.5 rounded-xl cursor-pointer transition-colors text-sm font-semibold text-gray-300">
                    <Upload className="w-4 h-4 text-blue-500" />
                    <span>Chọn hình ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setProductFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-500 truncate max-w-xs">
                    {productFile ? productFile.name : 'Giữ hình ảnh cũ'}
                  </span>
                </div>
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
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRM MODAL --- */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-white m-0">Xác nhận xóa sản phẩm</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bạn có chắc chắn muốn xóa sản phẩm <span className="text-white font-bold">{selectedProduct.name}</span>? 
              Hành động này không thể hoàn tác.
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
