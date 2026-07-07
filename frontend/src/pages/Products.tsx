import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
}

export const Products: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('');
  
  const [selectedFactories, setSelectedFactories] = useState<string[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  // Default options
  const factories = ["APPLE", "ASUS", "DELL", "HP", "ACER", "LENOVO"];
  const targets = ["GAMING", "SINHVIEN-VANPHONG", "THOITRANG", "DO-HOA"];
  const priceRanges = [
    { value: "duoi-10-trieu", label: "Dưới 10 Triệu" },
    { value: "10-15-trieu", label: "10 - 15 Triệu" },
    { value: "15-20-trieu", label: "15 - 20 Triệu" },
    { value: "tren-20-trieu", label: "Trên 20 Triệu" }
  ];

  // Initialize filters from search parameters
  useEffect(() => {
    const factoryParam = searchParams.get('factory');
    if (factoryParam) {
      setSelectedFactories(factoryParam.split(','));
    } else {
      setSelectedFactories([]);
    }

    const targetParam = searchParams.get('target');
    if (targetParam) {
      setSelectedTargets(targetParam.split(','));
    } else {
      setSelectedTargets([]);
    }

    const priceParam = searchParams.get('price');
    if (priceParam) {
      setSelectedPrices(priceParam.split(','));
    } else {
      setSelectedPrices([]);
    }

    const pageParam = searchParams.get('page');
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10) || 1);
    } else {
      setCurrentPage(1);
    }

    const sortParam = searchParams.get('sort');
    if (sortParam) {
      setSort(sortParam);
    } else {
      setSort('');
    }
  }, [searchParams]);

  const updateSearchParams = (
    newFactories: string[],
    newTargets: string[],
    newPrices: string[],
    newPage: number,
    newSort: string
  ) => {
    const params: Record<string, string> = {};
    if (newFactories.length > 0) params.factory = newFactories.join(',');
    if (newTargets.length > 0) params.target = newTargets.join(',');
    if (newPrices.length > 0) params.price = newPrices.join(',');
    if (newPage > 1) params.page = newPage.toString();
    if (newSort) params.sort = newSort;
    setSearchParams(params);
  };

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const qParam = searchParams.get('q');
      if (qParam) {
        const res = await api.get(`/api/products/search?q=${qParam}`);
        // Map elements to match Product structure with fallback description and target
        const mappedProducts = (res.data || []).map((item: any) => ({
          ...item,
          shortDesc: item.shortDesc || "Laptop chính hãng cấu hình cao, bảo hành dài hạn.",
          factory: item.factory || "LAPTOP",
          target: item.target || "SINHVIEN-VANPHONG"
        }));
        setProducts(mappedProducts);
        setTotalPages(1);
      } else {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        if (sort) params.append('sort', sort);
        selectedFactories.forEach(f => params.append('factory', f));
        selectedTargets.forEach(t => params.append('target', t));
        selectedPrices.forEach(p => params.append('price', p));

        const res = await api.get(`/api/products?${params.toString()}`);
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, [currentPage, sort, selectedFactories, selectedTargets, selectedPrices, searchParams]);

  const handleFactoryChange = (factory: string) => {
    const next = selectedFactories.includes(factory)
      ? selectedFactories.filter(f => f !== factory)
      : [...selectedFactories, factory];
    setSelectedFactories(next);
    setCurrentPage(1);
    updateSearchParams(next, selectedTargets, selectedPrices, 1, sort);
  };

  const handleTargetChange = (target: string) => {
    const next = selectedTargets.includes(target)
      ? selectedTargets.filter(t => t !== target)
      : [...selectedTargets, target];
    setSelectedTargets(next);
    setCurrentPage(1);
    updateSearchParams(selectedFactories, next, selectedPrices, 1, sort);
  };

  const handlePriceChange = (priceVal: string) => {
    const next = selectedPrices.includes(priceVal)
      ? selectedPrices.filter(p => p !== priceVal)
      : [...selectedPrices, priceVal];
    setSelectedPrices(next);
    setCurrentPage(1);
    updateSearchParams(selectedFactories, selectedTargets, next, 1, sort);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
    updateSearchParams(selectedFactories, selectedTargets, selectedPrices, 1, newSort);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateSearchParams(selectedFactories, selectedTargets, selectedPrices, newPage, sort);
  };

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

  const handleClearFilters = () => {
    setSelectedFactories([]);
    setSelectedTargets([]);
    setSelectedPrices([]);
    setCurrentPage(1);
    setSort('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight m-0">Danh sách sản phẩm</h1>
        <p className="text-gray-500 mt-1">Tìm kiếm và lọc các sản phẩm Laptop phù hợp với bạn</p>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Filter className="w-5 h-5 text-blue-600" />
                <span>Bộ lọc tìm kiếm</span>
              </div>
              {(selectedFactories.length > 0 || selectedTargets.length > 0 || selectedPrices.length > 0 || sort) && (
                <button 
                  onClick={handleClearFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {/* Filter by Brand (Factory) */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Thương hiệu</h3>
              <div className="space-y-2">
                {factories.map(f => (
                  <label key={f} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      checked={selectedFactories.includes(f)}
                      onChange={() => handleFactoryChange(f)}
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter by Target */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Nhu cầu sử dụng</h3>
              <div className="space-y-2">
                {targets.map(t => (
                  <label key={t} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      checked={selectedTargets.includes(t)}
                      onChange={() => handleTargetChange(t)}
                    />
                    <span>{t.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter by Price */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Mức giá</h3>
              <div className="space-y-2">
                {priceRanges.map(pr => (
                  <label key={pr.value} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      checked={selectedPrices.includes(pr.value)}
                      onChange={() => handlePriceChange(pr.value)}
                    />
                    <span>{pr.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid Section */}
        <main className="flex-1 space-y-6">
          {/* Top Sort / Actions Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-sm text-gray-500">
              Hiển thị các mẫu laptop tốt nhất
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 flex items-center gap-1.5 font-medium">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                Sắp xếp:
              </span>
              <select 
                value={sort} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg bg-gray-50 px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-700 cursor-pointer"
              >
                <option value="">Mặc định</option>
                <option value="gia-tang-dan">Giá tăng dần</option>
                <option value="gia-giam-dan">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-lg"></div>
                  <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {product.factory}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                        {product.shortDesc}
                      </p>
                    </div>

                    <div className="space-y-4 mt-4">
                      {/* Price */}
                      <div className="text-lg font-extrabold text-blue-600">
                        {product.price.toLocaleString('vi-VN')} đ
                      </div>

                      {/* Add to Cart Button */}
                      <button 
                        onClick={(e) => handleAddToCart(e, product.id)}
                        className="w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 font-bold py-2.5 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 text-sm cursor-pointer"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-500 space-y-2">
              <div className="text-4xl">🔍</div>
              <p className="font-medium text-gray-700">Không tìm thấy sản phẩm nào!</p>
              <p className="text-xs">Vui lòng điều chỉnh lại bộ lọc tìm kiếm.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-6">
              <button 
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3.5 py-1.5 rounded-lg border border-gray-200">
                Trang {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
