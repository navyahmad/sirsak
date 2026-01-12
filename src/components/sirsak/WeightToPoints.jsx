import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWeightHanging, FaCoins, FaCalculator, FaCheckCircle, FaSyncAlt } from 'react-icons/fa';

const WeightToPoints = ({ pickupRequests, onRecordWeight }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actualWeight, setActualWeight] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const pickedUpRequests = pickupRequests.filter(req => req.status === 'PICKED_UP');
  const weighedRequests = pickupRequests.filter(req => req.status === 'POINT_GRANTED');

  const calculatePoints = (weight) => {
    return weight * 100; // 1kg = 100 poin
  };

  const handleRecordWeight = () => {
    if (selectedRequest && actualWeight && !isNaN(actualWeight)) {
      const weight = parseFloat(actualWeight);
      setIsCalculating(true);
      
      // Simulasi proses
      setTimeout(() => {
        onRecordWeight(selectedRequest.id, weight);
        setSelectedRequest(null);
        setActualWeight('');
        setIsCalculating(false);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Konversi Berat ke Poin</h2>
          <p className="text-gray-600">Timbang sampah & konversi menjadi poin untuk warkop</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
            {pickedUpRequests.length} Menunggu Timbang
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            {weighedRequests.length} Telah Dikonversi
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Weight Recording */}
        <div className="space-y-6">
          {/* Calculator Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <FaCalculator className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Kalkulator Poin</h3>
                <p className="text-gray-600">1 kg MLP = 100 poin</p>
              </div>
            </div>

            {/* Weight Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Masukkan Berat (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={actualWeight}
                  onChange={(e) => setActualWeight(e.target.value)}
                  placeholder="Contoh: 25.5"
                  className="w-full px-4 py-4 pl-12 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <FaWeightHanging className="text-gray-400 text-xl" />
                </div>
              </div>
            </div>

            {/* Points Calculation */}
            {actualWeight && !isNaN(actualWeight) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-6"
              >
                <h4 className="font-bold text-gray-800 mb-4">Hasil Konversi</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Berat MLP</span>
                    <span className="font-bold text-lg">{parseFloat(actualWeight).toFixed(1)} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Konversi</span>
                    <span className="text-lg">× 100 poin/kg</span>
                  </div>
                  <div className="border-t border-purple-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-bold">Total Poin</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {calculatePoints(parseFloat(actualWeight)).toLocaleString()} poin
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRecordWeight}
              disabled={!selectedRequest || !actualWeight || isCalculating}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center ${!selectedRequest || !actualWeight || isCalculating ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'} text-white transition-all`}
            >
              {isCalculating ? (
                <>
                  <FaSyncAlt className="animate-spin mr-3" />
                  Memproses...
                </>
              ) : (
                <>
                  <FaCheckCircle className="mr-3" />
                  Konfirmasi & Berikan Poin
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
              <FaWeightHanging className="mr-2 text-blue-500" />
              Prosedur Timbangan
            </h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                Pilih pickup yang sudah diambil dari daftar
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                Timbang sampah di gudang dengan timbangan digital
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                Masukkan berat aktual (kg) ke sistem
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                Sistem otomatis konversi ke poin (1kg = 100 poin)
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">5</span>
                Poin langsung masuk ke akun warkop
              </li>
            </ol>
          </div>
        </div>

        {/* Right: Picked Up List */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-full">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                <FaWeightHanging className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Menunggu Timbangan</h3>
                <p className="text-gray-600">Pickup yang sudah diambil</p>
              </div>
            </div>

            <div className="space-y-4">
              {pickedUpRequests.length > 0 ? (
                pickedUpRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedRequest?.id === request.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-800">{request.warkopName}</h4>
                      <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        Siap Timbang
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Estimasi Awal</p>
                        <p className="font-medium">{request.estimatedWeight} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Driver</p>
                        <p className="font-medium">{request.assignedDriver || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tanggal Pickup</p>
                        <p className="font-medium">{request.scheduledDate || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Potensi Poin</p>
                        <p className="font-medium text-green-600">
                          {request.estimatedWeight * 100} poin
                        </p>
                      </div>
                    </div>
                    
                    {selectedRequest?.id === request.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-purple-200"
                      >
                        <p className="text-sm text-purple-700 font-medium">
                          ✓ Dipilih untuk penimbangan
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Masukkan berat aktual di kolom input sebelah kiri
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FaWeightHanging className="text-4xl mx-auto mb-4 opacity-30" />
                  <p>Tidak ada sampah yang menunggu penimbangan</p>
                  <p className="text-sm mt-2">Semua pickup telah diproses</p>
                </div>
              )}
            </div>

            {/* Recent Conversions */}
            {weighedRequests.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4">Konversi Terbaru</h4>
                <div className="space-y-3">
                  {weighedRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{request.warkopName}</p>
                        <p className="text-sm text-gray-600">
                          {request.actualWeight} kg → {request.pointsGenerated} poin
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-600">
                          <FaCoins className="mr-1" />
                          <span className="font-bold">{request.pointsGenerated.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-500">poin diberikan</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightToPoints;