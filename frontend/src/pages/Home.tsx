import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Laptop, ShieldCheck, Truck, Headphones, ChevronRight, ChevronLeft, RefreshCw, CreditCard, Flame, ShoppingCart, Percent } from 'lucide-react';
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

export const Home: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Banner Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Apple MacBook Pro M3",
      tagline: "Mạnh mẽ vượt trội. Thiết kế đỉnh cao.",
      desc: "Chip M3 thế hệ mới mang lại hiệu năng đồ họa cực khủng và thời lượng pin lên đến 22 giờ. Tuyệt phẩm cho lập trình viên và nhà thiết kế chuyên nghiệp.",
      price: "39.990.000",
      promoPrice: "36.990.000",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      bg: "from-slate-900 via-indigo-950 to-slate-900"
    },
    {
      title: "ASUS ROG Strix G16",
      tagline: "Chiến game bốc lửa. Thống trị mọi đấu trường.",
      desc: "Trang bị CPU Intel Core i9 thế hệ 14 và card đồ họa RTX 4070. Hệ thống tản nhiệt thông minh ROG Intelligent Cooling, màn hình 240Hz siêu mượt.",
      price: "42.990.000",
      promoPrice: "38.490.000",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
      bg: "from-zinc-950 via-purple-950 to-zinc-900"
    },
    {
      title: "Dell XPS 13 Plus",
      tagline: "Vẻ đẹp hoàn mỹ. Định nghĩa sự sang trọng.",
      desc: "Thiết kế tương lai với bàn phím tràn viền, thanh chạm cảm ứng điện dung và màn hình OLED 3K+ InfinityEdge sắc nét. Siêu mỏng nhẹ cho doanh nhân.",
      price: "47.990.000",
      promoPrice: "44.990.000",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
      bg: "from-neutral-900 via-violet-950 to-neutral-900"
    }
  ];

  // Flash Sale Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  // Brand data with emojis & matching colors
  const brands = [
    { name: 'APPLE', emoji: '🍎', desc: 'Đẳng cấp & Sang trọng' },
    { name: 'ASUS', emoji: '💻', desc: 'Hiệu năng đỉnh cao' },
    { name: 'DELL', emoji: '🏢', desc: 'Bền bỉ & Ổn định' },
    { name: 'HP', emoji: '✨', desc: 'Thời trang & Sáng tạo' },
    { name: 'ACER', emoji: '🎯', desc: 'Giá tốt & Cấu hình mạnh' },
    { name: 'LENOVO', emoji: '🛡️', desc: 'Bàn phím đỉnh & Thực dụng' }
  ];

  // Circles Category Data
  const circleCategories = [
    { name: 'MacBook', emoji: '🍎', link: '/products?factory=APPLE' },
    { name: 'Gaming', emoji: '🎮', link: '/products?target=GAMING' },
    { name: 'Văn Phòng', emoji: '💼', link: '/products?target=SINHVIEN-VANPHONG' },
    { name: 'Đồ Họa', emoji: '🎨', link: '/products?target=DO-HOA' },
    { name: 'Mỏng Nhẹ', emoji: '✨', link: '/products?target=THOITRANG' },
    { name: 'Cũ Giá Rẻ', emoji: '♻️', link: '/products?price=duoi-10-trieu' },
    { name: 'Phụ Kiện', emoji: '⌨️', link: '/products' }
  ];

  // Slide loop
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  // Timer loop
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
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/products?page=1');
        if (res.data && res.data.products) {
          setFeaturedProducts(res.data.products.slice(0, 8));
          // Use first 4 as flash sale products for demo purposes
          setFlashSaleProducts(res.data.products.slice(0, 4));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

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

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="space-y-10 pb-16 bg-gray-50">
      
      {/* 1. Category Sidebar & Hero Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Category Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block bg-white border border-gray-200 rounded-2xl p-4 shadow-xs h-[480px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 px-2 pb-3 mb-3 border-b border-gray-150">
                <Laptop className="w-5 h-5 text-blue-600" />
                <span className="font-black text-gray-900 text-sm tracking-wide">PHÂN LOẠI LAPTOP</span>
              </div>
              <nav className="space-y-1">
                <Link to="/products?factory=APPLE" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group">
                  <span>Apple MacBook</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products?target=GAMING" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group">
                  <span>Laptop Gaming</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products?target=SINHVIEN-VANPHONG" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group">
                  <span>Văn Phòng & Học Tập</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products?target=DO-HOA" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group">
                  <span>Thiết Kế Đồ Họa</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products?target=THOITRANG" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group">
                  <span>Mỏng Nhẹ Cao Cấp</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="h-px bg-gray-100 my-2"></div>
                <Link to="/products?factory=ASUS" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group">
                  <span>ASUS ROG / ZenBook</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products?factory=DELL" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group">
                  <span>Dell XPS / Inspiron</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products?factory=HP" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group">
                  <span>HP Pavilion / Envy</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products?factory=LENOVO" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group">
                  <span>Lenovo ThinkPad / Yoga</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </nav>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl text-center">
              <span className="text-[10px] uppercase font-black text-blue-700 tracking-wider block">Ưu Đãi Đặc Biệt</span>
              <span className="text-xs font-bold text-gray-900 mt-1 block">Trả góp 0% lãi suất</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Duyệt hồ sơ nhanh chỉ 5 phút</span>
            </div>
          </aside>

          {/* Center Banner Slider */}
          <div className="lg:col-span-9 relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs h-[480px] group">
            
            {/* Slider Content Wrapper */}
            <div className="w-full h-full relative">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 w-full h-full bg-gradient-to-br ${slide.bg} text-white flex items-center transition-all duration-700 ease-in-out ${idx === currentSlide ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-full z-0'}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full px-8 md:px-14">
                    <div className="md:col-span-7 space-y-4 text-left">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-[10px] font-black tracking-wider uppercase border border-white/10">
                        ⚡ Flagship Laptop
                      </span>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight m-0">
                        {slide.title}
                      </h2>
                      <p className="text-blue-300 font-extrabold text-sm sm:text-base m-0">
                        {slide.tagline}
                      </p>
                      <p className="text-gray-300 text-xs leading-relaxed max-w-md hidden sm:block m-0">
                        {slide.desc}
                      </p>
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 block line-through">Giá gốc: {slide.price}đ</span>
                        <span className="text-xl sm:text-2xl font-black text-blue-400 block">Chỉ từ: {slide.promoPrice}đ</span>
                      </div>
                      <div className="pt-2">
                        <Link
                          to="/products"
                          className="bg-blue-600 hover:bg-blue-500 text-white font-black px-7 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all text-xs inline-block"
                        >
                          MUA NGAY
                        </Link>
                      </div>
                    </div>

                    <div className="md:col-span-5 hidden md:flex justify-center">
                      <div className="relative p-2 bg-white/5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xs flex items-center justify-center max-w-[280px] aspect-square w-full">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer border border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer border border-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${idx === currentSlide ? 'bg-blue-500 w-6' : 'bg-white/40 hover:bg-white/70'}`}
                ></button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 2. Trust Badges Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white border border-gray-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3 p-2">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-xs m-0">Giao Hàng Miễn Phí</h4>
              <p className="text-gray-500 text-[10px] m-0 mt-0.5">Cho mọi đơn hàng &gt;499k</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-xs m-0">Đổi Trả Dễ Dàng</h4>
              <p className="text-gray-500 text-[10px] m-0 mt-0.5">Đổi trả trong vòng 7 ngày</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-xs m-0">Thanh Toán An Toàn</h4>
              <p className="text-gray-500 text-[10px] m-0 mt-0.5">Nhiều hình thức tiện lợi</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-xs m-0">Chính Hãng 100%</h4>
              <p className="text-gray-500 text-[10px] m-0 mt-0.5">Cam kết nguồn gốc rõ ràng</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 col-span-2 md:col-span-1">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-xs m-0">Hỗ Trợ 24/7</h4>
              <p className="text-gray-500 text-[10px] m-0 mt-0.5">Tư vấn tận tình: 1900 1234</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Circle Categories Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6">
            {circleCategories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-3xl text-blue-600 rounded-full flex items-center justify-center shadow-xs transition-all duration-300">
                  {cat.emoji}
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-blue-650 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Flash Sale Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Timer Panel */}
          <div className="lg:col-span-3 bg-gradient-to-b from-blue-600 to-indigo-700 text-white p-6 flex flex-col justify-between text-center lg:text-left min-h-[300px]">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
                <h3 className="text-2xl font-black tracking-tight m-0">FLASH SALE</h3>
              </div>
              <p className="text-blue-100 text-xs m-0 leading-relaxed">
                Cơ hội săn laptop cấu hình khủng với mức giá sốc nhất trong ngày. Số lượng có hạn!
              </p>
            </div>

            <div className="space-y-3 my-6 lg:my-0">
              <span className="text-[10px] font-bold text-blue-200 block uppercase tracking-wider">Thời gian còn lại</span>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center font-black text-lg">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="font-bold text-lg">:</span>
                <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center font-black text-lg">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="font-bold text-lg">:</span>
                <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center font-black text-lg">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>

            <div>
              <Link
                to="/products"
                className="w-full bg-white text-blue-700 hover:bg-blue-50 font-black py-2.5 px-6 rounded-xl transition-all text-xs inline-block shadow-md text-center"
              >
                XEM TẤT CẢ
              </Link>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-9 p-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border border-gray-150 rounded-xl p-4 space-y-4 animate-pulse">
                    <div className="aspect-video bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : flashSaleProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {flashSaleProducts.map((product) => {
                  const discountPercent = 10 + (product.id % 3) * 5; // mock discounts (10%, 15%, 20%)
                  const originalPrice = Math.round(product.price * (1 + discountPercent / 100));
                  const percentSold = 35 + (product.id * 12) % 55; // mock progress bar

                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group border border-gray-150 rounded-2xl bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col p-3 relative"
                    >
                      {/* Discount Tag */}
                      <span className="absolute top-2 left-2 bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md z-10 flex items-center gap-0.5">
                        <Percent className="w-2.5 h-2.5" />
                        {discountPercent}%
                      </span>

                      {/* Image */}
                      <div className="aspect-video bg-gray-50 overflow-hidden relative rounded-xl border border-gray-100 flex items-center justify-center p-2 mb-3">
                        <img
                          src={`http://localhost:8080/images/product/${product.image}`}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500";
                          }}
                        />
                      </div>

                      {/* Body */}
                      <div className="flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs group-hover:text-blue-650 transition-colors line-clamp-1 leading-snug m-0">
                            {product.name}
                          </h4>
                          <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider mt-0.5">{product.factory}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-gray-400 line-through block leading-none">
                              {originalPrice.toLocaleString('vi-VN')} đ
                            </span>
                            <span className="text-sm font-black text-blue-600 block leading-tight">
                              {product.price.toLocaleString('vi-VN')} đ
                            </span>
                          </div>

                          {/* Sold Progress Bar */}
                          <div className="space-y-1">
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-orange-500 h-1.5 rounded-full"
                                style={{ width: `${percentSold}%` }}
                              ></div>
                            </div>
                            <span className="text-[9px] text-gray-500 font-bold block text-left">
                              Đã bán {percentSold}%
                            </span>
                          </div>

                          {/* Add button */}
                          <button
                            onClick={(e) => handleAddToCart(e, product.id)}
                            className="w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 font-bold py-2 rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 text-[10px] cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Thêm vào giỏ
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                Không tìm thấy sản phẩm Flash Sale!
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 5. Promotional Banners Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-red-650 to-orange-500 text-white p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div>
              <span className="bg-white/20 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">Chiến game AAA</span>
              <h4 className="text-lg font-black mt-2 mb-1 leading-snug">LAPTOP GAMING GIẢM 20%</h4>
              <p className="text-white/80 text-[11px] m-0">Trang bị VGA RTX 40-Series cực khủng</p>
            </div>
            <Link to="/products?target=GAMING" className="text-xs font-black flex items-center gap-1 hover:underline w-fit">
              Khám phá ngay <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div>
              <span className="bg-white/20 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">Mỏng nhẹ thời thượng</span>
              <h4 className="text-lg font-black mt-2 mb-1 leading-snug">MACBOOK TRẢ GÓP 0%</h4>
              <p className="text-white/80 text-[11px] m-0">Trả trước chỉ từ 5 triệu, nhận máy ngay</p>
            </div>
            <Link to="/products?factory=APPLE" className="text-xs font-black flex items-center gap-1 hover:underline w-fit">
              Mua trả góp <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div>
              <span className="bg-white/20 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">Giải pháp toàn diện</span>
              <h4 className="text-lg font-black mt-2 mb-1 leading-snug">PHỤ KIỆN LAPTOP GIẢM 40%</h4>
              <p className="text-white/80 text-[11px] m-0">Chuột, bàn phím cơ, balo chống nước</p>
            </div>
            <Link to="/products" className="text-xs font-black flex items-center gap-1 hover:underline w-fit">
              Xem phụ kiện <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Outstanding Brands Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight m-0 uppercase">Thương Hiệu Nổi Bật</h2>
          <p className="text-gray-500 text-xs mt-1.5">Tuyển chọn các dòng máy hàng đầu thế giới</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map(brand => (
            <button
              key={brand.name}
              onClick={() => navigate(`/products?factory=${brand.name}`)}
              className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-400 p-5 rounded-2xl transition-all text-center flex flex-col items-center justify-center space-y-2 cursor-pointer shadow-xs group hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gray-50 group-hover:bg-white rounded-xl flex items-center justify-center text-2xl transition-colors shadow-xs">
                {brand.emoji}
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-gray-900 block text-xs tracking-wide">{brand.name}</span>
                <span className="text-[9px] text-gray-400 block">{brand.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 7. New & Best Seller Featured Products Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight m-0 uppercase">Sản Phẩm Đang Săn Đón</h2>
            <p className="text-gray-500 text-xs mt-1.5">Mẫu laptop chính hãng, bán chạy, chất lượng tốt nhất</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/best-sellers"
              className="flex items-center gap-1.5 bg-red-50 text-red-650 hover:bg-red-650 hover:text-white border border-red-100 font-bold px-3 py-1.5 rounded-xl transition-all text-xs"
            >
              🔥 Bán chạy nhất
            </Link>
            <Link 
              to="/new-arrivals"
              className="flex items-center gap-1.5 bg-purple-50 text-purple-650 hover:bg-purple-650 hover:text-white border border-purple-100 font-bold px-3 py-1.5 rounded-xl transition-all text-xs"
            >
              ✨ Hàng mới về
            </Link>
            <Link 
              to="/products"
              className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 font-bold px-3 py-1.5 rounded-xl transition-all text-xs"
            >
              Xem tất cả
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 animate-pulse">
                <div className="aspect-video bg-gray-250 rounded-xl"></div>
                <div className="h-4 bg-gray-250 rounded w-2/3"></div>
                <div className="h-3 bg-gray-250 rounded w-1/2"></div>
                <div className="h-9 bg-gray-250 rounded"></div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-50 overflow-hidden relative border-b border-gray-100 flex items-center justify-center p-4">
                  <img 
                    src={`http://localhost:8080/images/product/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500";
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {product.factory}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-blue-650 transition-colors line-clamp-1 leading-snug m-0">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-[10px] line-clamp-2 leading-relaxed m-0">
                      {product.shortDesc || "Laptop chính hãng thiết kế cao cấp, hoạt động mượt mà."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Price */}
                    <div className="text-base font-black text-blue-650">
                      {product.price.toLocaleString('vi-VN')} đ
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={(e) => handleAddToCart(e, product.id)}
                      className="w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 font-extrabold py-2.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 py-16 rounded-2xl text-center text-gray-505 text-sm">
            Không tìm thấy sản phẩm nào!
          </div>
        )}
      </section>

    </div>
  );
};
