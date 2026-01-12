import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTruckLoading, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaWeightHanging,
  FaPaperPlane,
  FaHistory
} from 'react-icons/fa';
import { GiRecycle } from 'react-icons/gi';

const PickupRequestForm = ({ branches, pickupRequests, onRequestPickup }) => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [estimatedWeight, setEstimatedWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  const activeBranches = branches.filter(b => b.status === 'active');
  const pendingRequests = pickupRequests.filter(req => req.status === 'REQUESTED');
  const completedRequests = pickupRequests.filter(req => req.status === 'POINT_GRANTED');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedBranch && estimatedWeight && selectedDate) {
      onRequestPickup(parseInt(selectedBranch), parseInt(estimatedWeight));
      setSelectedBranch('');
      setEstimatedWeight('');
      setSelectedDate('');
    }
  };

  const calculatePotentialPoints = (weight) => {
    return weight ? weight * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Request Pickup Sampah</h2>
          <p className="text-gray-600">Ajukan pickup sampah MLP dari cabang Anda</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium">
            {pendingRequests.length} Menunggu
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            {completedRequests.length} Selesai
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Request Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
              <GiRecycle className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Form Request Pickup</h3>
              <p className="text-gray-600">Isi form untuk menjadwalkan pickup</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Branch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Cabang
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Pilih cabang...</option>
                {activeBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.address}
                  </option>
                ))}
              </select>
              {selectedBranch && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-green-500 mr-2" />
                    <span className="text-sm text-green-700">
                      {activeBranches.find(b => b.id === parseInt(selectedBranch))?.address}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimasi Berat Sampah (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={estimatedWeight}
                  onChange={(e) => setEstimatedWeight(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Contoh: 25"
                  required
                  min="1"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <FaWeightHanging className="text-gray-400 text-xl" />
                </div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-500">kg</span>
                </div>
              </div>
              {estimatedWeight && (
                <p className="mt-2 text-sm text-green-600">
                  Potensi poin: <strong>{calculatePotentialPoints(parseInt(estimatedWeight)).toLocaleString()}</strong> poin
                  (1kg = 100 poin)
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Siap Pickup
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <FaCalendarAlt className="text-gray-400 text-xl" />
                </div>
              </div>
            </div>

            {/* Summary Card */}
            {selectedBranch && estimatedWeight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
              >
                <h4 className="font-bold text-gray-800 mb-4">Ringkasan Request</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cabang</span>
                    <span className="font-medium">
                      {activeBranches.find(b => b.id === parseInt(selectedBranch))?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimasi Berat</span>
                    <span className="font-medium">{estimatedWeight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potensi Poin</span>
                    <span className="font-bold text-green-600">
                      {calculatePotentialPoints(parseInt(estimatedWeight)).toLocaleString()} poin
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Pickup</span>
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!selectedBranch || !estimatedWeight || !selectedDate}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center ${!selectedBranch || !estimatedWeight || !selectedDate ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'} text-white transition-all`}
            >
              <FaPaperPlane className="mr-3" />
              Kirim Request Pickup
            </motion.button>
          </form>
        </div>

        {/* Right: Request History */}
        <div className="space-y-6">
          {/* Pending Requests */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mr-3">
                <FaTruckLoading className="text-yellow-500 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Menunggu Pickup</h3>
                <p className="text-gray-600">Request yang belum dijadwalkan</p>
              </div>
            </div>

            <div className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <div key={request.id} className="border border-yellow-200 bg-yellow-50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{request.branchName}</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        Menunggu
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Estimasi</p>
                        <p className="font-medium">{request.estimatedWeight} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Potensi Poin</p>
                        <p className="font-medium text-green-600">
                          {calculatePotentialPoints(request.estimatedWeight).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tanggal Request</p>
                        <p className="font-medium">{request.requestDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium">Menunggu Sirsak</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaTruckLoading className="text-3xl mx-auto mb-4 opacity-30" />
                  <p>Tidak ada request yang menunggu</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Requests */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                <FaHistory className="text-green-500 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Pickup Selesai</h3>
                <p className="text-gray-600">Sampah telah dikonversi menjadi poin</p>
              </div>
            </div>

            <div className="space-y-4">
              {completedRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="border border-green-200 bg-green-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">{request.branchName}</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Selesai
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Berat Aktual</p>
                      <p className="font-medium">{request.actualWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Poin Diterima</p>
                      <p className="font-bold text-green-600">
                        {request.pointsGranted.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tanggal</p>
                      <p className="font-medium">{request.requestDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Konversi</p>
                      <p className="font-medium">1kg = 100 poin</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupRequestForm;