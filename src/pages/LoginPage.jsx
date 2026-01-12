import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLeaf, 
  FaRecycle, 
  FaCoffee, 
  FaArrowLeft,
  FaChartLine,
  FaUsers
} from 'react-icons/fa';
import { GiRecycle } from 'react-icons/gi';
import LoginCard from '../components/LoginCard';

const LoginPage = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Simulate login process
    setTimeout(() => {
      onLogin(role);
    }, 800);
  };

  const loginOptions = [
    {
      role: "Admin Warkop",
      description: "Kelola cabang warkop, request pickup sampah MLP, dan kelola poin untuk BPJS pegawai.",
      icon: FaCoffee,
      color: "bg-gradient-to-br from-green-400 to-emerald-600",
      features: ["Kelola cabang", "Request pickup", "Kelola poin & BPJS"]
    },
    {
      role: "Admin Sirsak",
      description: "Jadwalkan pickup, monitoring data timbangan, validasi poin, dan kelola pengolahan limbah.",
      icon: FaRecycle,
      color: "bg-gradient-to-br from-blue-400 to-cyan-600",
      features: ["Jadwalkan pickup", "Monitoring data", "Validasi poin"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 pb-4 px-4 md:px-8"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center mb-4 md:mb-0"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
              <GiRecycle className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent">
                Sirsak
              </h1>
              <p className="text-gray-600 text-sm">Sistem Sirkular Ekonomi</p>
            </div>
          </motion.div>

          {/* Stats Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center space-x-4"
      >
        <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow">
          <FaChartLine className="text-green-500" />
          <span className="text-sm font-semibold text-gray-700">
            <span className="text-green-600">1,245</span> kg MLP Terdaur Ulang
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow">
          <FaUsers className="text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">
            <span className="text-blue-600">48</span> Warkop Terdaftar
          </span>
        </div>
      </motion.div>
    </div>
  </motion.header>

  {/* Main Content */}
  <main className="flex-grow flex items-center justify-center px-4 py-8 md:py-12">
    <div className="container mx-auto max-w-6xl">
      <AnimatePresence mode="wait">
        {!selectedRole ? (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 md:mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Selamat Datang di <span className="text-green-600">Sirsak</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Platform yang menghubungkan <span className="font-semibold text-green-600">warkop</span> dengan 
                <span className="font-semibold text-blue-600"> perusahaan pengolah limbah</span>. 
                Ubah sampah plastik menjadi poin untuk kesejahteraan pegawai.
              </p>
            </motion.div>

            {/* Role Selection Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto"
            >
              {loginOptions.map((option, index) => (
                <motion.div
                  key={option.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <LoginCard
                    role={option.role}
                    description={option.description}
                    icon={option.icon}
                    color={option.color}
                    onLogin={() => handleRoleSelect(option.role)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Demo Info */}
            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 md:mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-green-100 shadow-lg"
            >
              <div className="flex items-center justify-center mb-4">
                <FaLeaf className="text-green-500 text-xl mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Web Simulasi Sirsak</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ini adalah <span className="font-semibold text-green-600">versi simulasi statis</span>. 
                Data disimpan sementara di browser Anda.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Tidak perlu database</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>GIS dengan Leaflet.js</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                  <span>Responsif semua device</span>
                </div>
              </div>
            </motion.div> */}
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center"
          >
            {/* Loading Animation */}
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-full border-4 border-green-200 border-t-green-500 border-r-green-500 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <GiRecycle className="text-green-500 text-4xl" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Masuk sebagai <span className="text-green-600">{selectedRole}</span>
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Mengarahkan Anda ke dashboard {selectedRole === "Admin Warkop" ? "kelola cabang" : "monitoring pickup"}...
            </p>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-2 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full mx-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </main>

  {/* Footer */}
  <motion.footer 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1 }}
    className="py-6 px-4 border-t border-green-100 bg-white/50"
  >
    <div className="container mx-auto text-center">
      <p className="text-gray-600 text-sm">
        © 2024 Sirsak - Sistem Sirkular Ekonomi. 
        <span className="block md:inline"> Warkop ♻️ Pengolah Limbah.</span>
      </p>
      <p className="text-gray-500 text-xs mt-2">
        Versi Simulasi Statis • 1kg MLP = 100 Poin • Lokasi Dummy untuk Demo
      </p>
    </div>
  </motion.footer>
</div>
  );
};

export default LoginPage;