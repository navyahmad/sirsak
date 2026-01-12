import { motion } from 'framer-motion';
import { 
  FaCoins, 
  FaHistory, 
  FaChartLine, 
  FaExchangeAlt,
  FaTruckLoading,
  FaWeightHanging,
  FaShieldAlt,
  FaShoppingCart
} from 'react-icons/fa';

const PointsSystem = ({ brand, pickupRequests, transactions }) => {
  const totalPointsEarned = pickupRequests
    .filter(req => req.status === 'POINT_GRANTED')
    .reduce((sum, req) => sum + req.pointsGranted, 0);
  
  const totalPointsUsed = transactions.reduce((sum, trans) => sum + trans.pointsUsed, 0);
  
  const pointsBySource = {
    pickup: pickupRequests
      .filter(req => req.status === 'POINT_GRANTED')
      .reduce((sum, req) => sum + req.pointsGranted, 0),
    bonus: 5000, // contoh bonus
  };
  
  const pointsByUsage = {
    bpjs: transactions
      .filter(trans => trans.type === 'bpjs_payment')
      .reduce((sum, trans) => sum + trans.pointsUsed, 0),
    products: transactions
      .filter(trans => trans.type === 'product_purchase')
      .reduce((sum, trans) => sum + trans.pointsUsed, 0),
  };
  
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sistem Poin</h2>
          <p className="text-gray-600">Kelola poin dari sampah menjadi manfaat</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-bold">
            {brand.points.toLocaleString()} POIN
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
              <FaCoins className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Total Poin</h3>
              <p className="text-gray-600">Poin saat ini</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-amber-600">{brand.points.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">Tersedia untuk ditukar</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
              <FaChartLine className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Poin Diperoleh</h3>
              <p className="text-gray-600">Dari konversi sampah</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">{totalPointsEarned.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">Total sejak awal</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
              <FaExchangeAlt className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Poin Digunakan</h3>
              <p className="text-gray-600">Untuk BPJS & produk</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{totalPointsUsed.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">Total ditukarkan</p>
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points Source */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <FaTruckLoading className="text-green-500 mr-2" />
            Sumber Poin
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Konversi Sampah</span>
                <span className="font-bold text-green-600">
                  {pointsBySource.pickup.toLocaleString()} poin
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: '85%' }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {pickupRequests.filter(req => req.status === 'POINT_GRANTED').length} pickup berhasil
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Bonus & Promo</span>
                <span className="font-bold text-amber-600">
                  {pointsBySource.bonus.toLocaleString()} poin
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: '15%' }}
                ></div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between font-bold">
                <span>Total Diperoleh</span>
                <span className="text-lg text-green-600">
                  {totalPointsEarned.toLocaleString()} poin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Points Usage */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <FaShoppingCart className="text-blue-500 mr-2" />
            Penggunaan Poin
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 flex items-center">
                  <FaShieldAlt className="text-green-500 mr-2" />
                  BPJS Ketenagakerjaan
                </span>
                <span className="font-bold text-green-600">
                  {pointsByUsage.bpjs.toLocaleString()} poin
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: '70%' }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {transactions.filter(t => t.type === 'bpjs_payment').length} transaksi
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Produk Daur Ulang</span>
                <span className="font-bold text-blue-600">
                  {pointsByUsage.products.toLocaleString()} poin
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: '30%' }}
                ></div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between font-bold">
                <span>Total Digunakan</span>
                <span className="text-lg text-blue-600">
                  {totalPointsUsed.toLocaleString()} poin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <FaHistory className="text-gray-500 mr-2" />
          Riwayat Transaksi Terbaru
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Tanggal</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Jenis</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Detail</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Poin</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((trans) => (
                <tr key={trans.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm text-gray-700">{trans.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${trans.type === 'bpjs_payment' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {trans.type === 'bpjs_payment' ? 'BPJS' : 'Produk'}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-700">
                    {trans.type === 'bpjs_payment' ? trans.employeeName : trans.productName}
                    <br/>
                    <span className="text-xs text-gray-500">{trans.details}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <FaCoins className="text-amber-500 mr-1" />
                      <span className={`font-bold ${trans.type === 'bpjs_payment' ? 'text-red-600' : 'text-blue-600'}`}>
                        -{trans.pointsUsed.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${trans.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {trans.status === 'completed' ? 'Selesai' : 'Diproses'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-sm text-green-600 hover:text-green-800 font-medium">
            Lihat semua transaksi →
          </button>
        </div>
      </div>

      {/* Conversion Info */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
          <FaWeightHanging className="text-green-500 mr-2" />
          Informasi Konversi Poin
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-green-600">1 kg</p>
            <p className="text-gray-600">Sampah MLP</p>
          </div>
          <div className="flex items-center justify-center">
            <FaExchangeAlt className="text-gray-400 text-2xl" />
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-600">100 Poin</p>
            <p className="text-gray-600">Nilai tukar</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          *Poin dapat ditukar untuk BPJS Ketenagakerjaan atau produk daur ulang MLP
        </p>
      </div>
    </div>
  );
};

export default PointsSystem;