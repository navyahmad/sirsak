import { motion } from 'framer-motion';
import { 
  FaTruckLoading, 
  FaWeightHanging, 
  FaCoins, 
  FaCalendarCheck,
  FaClock,
  FaRecycle,
  FaSyncAlt
} from 'react-icons/fa';

const DashboardStats = ({ stats, onSimulateRequest, onResetDemo }) => {
  const statCards = [
    {
      title: "Total Pickup",
      value: stats.totalPickups,
      icon: FaTruckLoading,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Total Berat (kg)",
      value: stats.totalWeight.toLocaleString(),
      icon: FaWeightHanging,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Total Poin",
      value: stats.totalPoints.toLocaleString(),
      icon: FaCoins,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700"
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: FaClock,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-600">Statistik pengolahan limbah MLP</p>
        </div>
        
        {/* Button Group */}
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSimulateRequest}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            <FaRecycle className="mr-2" />
            Simulasi Request Baru
          </motion.button>
          
          {/* Tombol Reset Demo Data */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResetDemo}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all"
          >
            <FaSyncAlt className="mr-2" />
            Reset Demo Data
          </motion.button>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
              <FaCalendarCheck className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Terjadwalkan Hari Ini</p>
              <p className="text-xl font-bold text-gray-800">{stats.scheduledToday}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
              <FaTruckLoading className="text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Selesai Bulan Ini</p>
              <p className="text-xl font-bold text-gray-800">{stats.completedThisMonth}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
              <FaCoins className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rata-rata Poin/Pickup</p>
              <p className="text-xl font-bold text-gray-800">
                {stats.totalPickups > 0 
                  ? Math.round(stats.totalPoints / stats.totalPickups).toLocaleString() 
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`${stat.bgColor} rounded-2xl p-6 border border-gray-200 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon className="text-white text-2xl" />
              </div>
            </div>
            
            {/* Progress/Status Bar */}
            <div className="mt-4">
              {stat.title === "Pending Requests" && stat.value > 0 ? (
                <div className="flex items-center text-sm">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(stat.value * 20, 100)}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium text-red-600">Perlu tindakan</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  {stat.title === "Total Pickup" && `${stats.completedThisMonth} selesai bulan ini`}
                  {stat.title === "Total Berat (kg)" && "1kg = 100 poin"}
                  {stat.title === "Total Poin" && "Telah diberikan ke warkop"}
                  {stat.title === "Pending Requests" && "Menunggu penjadwalan"}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;