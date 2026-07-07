import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import api from '../../services/api';

interface User {
  id: number;
  email: string;
  fullName: string;
  address: string;
  phone: string;
  avatar: string;
  role: {
    id: number;
    name: string;
  };
}

export const UserManage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals visibility state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [roleName, setRoleName] = useState('USER');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/users?page=${currentPage}&size=8`);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const handleOpenCreate = () => {
    setEmail('');
    setFullName('');
    setPassword('');
    setAddress('');
    setPhone('');
    setRoleName('USER');
    setAvatarFile(null);
    setErrorMessage('');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setFullName(user.fullName || '');
    setAddress(user.address || '');
    setPhone(user.phone || '');
    setRoleName(user.role?.name || 'USER');
    setAvatarFile(null);
    setErrorMessage('');
    setShowEditModal(true);
  };

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !fullName || !password) {
      setErrorMessage('Vui lòng điền đủ các trường bắt buộc (Email, Tên, Mật khẩu).');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('fullName', fullName);
      formData.append('password', password);
      formData.append('address', address);
      formData.append('phone', phone);
      formData.append('roleName', roleName);
      if (avatarFile) {
        formData.append('avatarFile', avatarFile);
      }

      await api.post('/api/admin/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowCreateModal(false);
      fetchUsers();
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || 'Có lỗi xảy ra khi tạo thành viên.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedUser) return;
    if (!fullName) {
      setErrorMessage('Tên đầy đủ không được trống.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('address', address);
      formData.append('phone', phone);
      formData.append('roleName', roleName);
      if (avatarFile) {
        formData.append('avatarFile', avatarFile);
      }

      await api.put(`/api/admin/users/${selectedUser.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowEditModal(false);
      fetchUsers();
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    try {
      await api.delete(`/api/admin/users/${selectedUser.id}`);
      setShowDeleteModal(false);
      fetchUsers();
    } catch (e) {
      console.error(e);
      alert("Không thể xóa thành viên này.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white m-0">Quản lý Thành viên</h1>
          <p className="text-xs text-gray-400 mt-1">Danh sách tất cả người dùng và quản trị viên trong hệ thống.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thành viên</span>
        </button>
      </div>

      {/* Users table */}
      <div className="bg-gray-950 border border-gray-850 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-gray-500 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold">Đang tải danh sách thành viên...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-850 bg-gray-900/60 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Thành viên</th>
                  <th className="py-4 px-6">Địa chỉ / SĐT</th>
                  <th className="py-4 px-6">Vai trò</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850 text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="py-4 px-6 text-gray-500 font-bold">{u.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img
                            src={`http://localhost:8080/images/avatar/${u.avatar}`}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-gray-800"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400 font-extrabold border border-blue-800/50">
                            {u.fullName?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-100 m-0 leading-tight">{u.fullName}</p>
                          <span className="text-xs text-gray-500 mt-0.5 block">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      <p className="m-0 leading-tight">{u.address || 'N/A'}</p>
                      <span className="text-xs text-gray-500 mt-0.5 block">{u.phone || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                          u.role?.name === 'ADMIN'
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {u.role?.name || 'USER'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(u)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Xóa tài khoản"
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
            <span className="text-3xl block">👥</span>
            <p className="font-semibold text-gray-400">Không tìm thấy thành viên nào.</p>
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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white m-0">Thêm Thành Viên Mới</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Họ và Tên *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Nguyen Van A"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Mật khẩu *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="******"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Số điện thoại</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="0987654321"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Vai trò *</label>
                  <select
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Địa chỉ</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Hà Nội, Việt Nam"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase block">Ảnh đại diện (Avatar)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 bg-gray-950 hover:bg-gray-850 border border-gray-850 px-4 py-2.5 rounded-xl cursor-pointer transition-colors text-sm font-semibold text-gray-300">
                    <Upload className="w-4 h-4 text-blue-500" />
                    <span>Chọn tệp</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAvatarFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-500 truncate max-w-xs">
                    {avatarFile ? avatarFile.name : 'Chưa chọn tệp tin'}
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
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
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white m-0">Cập Nhật Thông Tin Thành Viên</h2>
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
                <label className="text-xs font-bold text-gray-400 uppercase">Email (Không thể sửa)</label>
                <input
                  type="email"
                  disabled
                  value={selectedUser.email}
                  className="w-full text-sm bg-gray-950/60 border border-gray-850 rounded-xl px-3.5 py-2.5 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Nguyen Van A"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Số điện thoại</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="0987654321"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Vai trò *</label>
                  <select
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Địa chỉ</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-sm bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Hà Nội, Việt Nam"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase block">Thay đổi ảnh đại diện</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 bg-gray-950 hover:bg-gray-850 border border-gray-850 px-4 py-2.5 rounded-xl cursor-pointer transition-colors text-sm font-semibold text-gray-300">
                    <Upload className="w-4 h-4 text-blue-500" />
                    <span>Chọn tệp</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAvatarFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-500 truncate max-w-xs">
                    {avatarFile ? avatarFile.name : 'Giữ ảnh hiện tại'}
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
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-white m-0">Xác nhận xóa thành viên</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bạn có chắc chắn muốn xóa thành viên <span className="text-white font-bold">{selectedUser.fullName}</span> ({selectedUser.email})? 
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
