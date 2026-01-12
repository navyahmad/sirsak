import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaTruck, FaMapMarkerAlt, FaClock, FaCheck } from 'react-icons/fa';
import StatusBadge from '../shared/StatusBadge';

const PickupSchedule = ({ pickupRequests, drivers, onSchedule, onMarkAsPickedUp }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  const handleSchedule = () => {
    if (selectedRequest && selectedDriver && scheduledDate) {
      onSchedule(selectedRequest.id, parseInt(selectedDriver), scheduledDate);
      setSelectedRequest(null);
      setSelectedDriver('');
      setScheduledDate('');
    }
  };

  // ✅ PERBAIKI: Filter driver dengan kondisi yang benar
  const availableDrivers = drivers.filter(driver => 
    driver.status === 'available' || 
    driver.status === "available" || 
    driver.status?.toLowerCase() === 'available'
  );

  const pendingRequests = pickupRequests.filter(req => req.status === 'REQUESTED');
  const scheduledRequests = pickupRequests.filter(req => req.status === 'SCHEDULED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Jadwal Pickup</h2>
          <p className="text-gray-600">Kelola permintaan pickup dari warkop</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
            {pendingRequests.length} Menunggu
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            {scheduledRequests.length} Terjadwal
          </div>
          <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium">
            {availableDrivers.length} Driver Tersedia
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Requests */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-3">
              <FaClock className="text-red-500 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Pending Requests</h3>
              <p className="text-gray-600">Menunggu penjadwalan</p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedRequest?.id === request.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-400 mr-2" />
                        <h4 className="font-bold text-gray-800">{request.warkopName}</h4>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{request.address}</p>
                      <div className="flex items-center mt-3 space-x-4">
                        <div className="flex items-center">
                          <FaTruck className="text-gray-400 mr-2" />
                          <span className="text-sm">Estimasi: <strong>{request.estimatedWeight} kg</strong></span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-gray-400 mr-2" />
                          <span className="text-sm">{request.requestDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaClock className="text-3xl mx-auto mb-4 opacity-30" />
                <p>Tidak ada request yang menunggu</p>
                <p className="text-sm mt-2">Semua pickup telah terjadwal</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Schedule Form & Scheduled Pickups */}
        <div className="space-y-6">
          {/* Schedule Form */}
          {selectedRequest && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-blue-200 p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Jadwalkan Pickup</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver {availableDrivers.length > 0 && `(${availableDrivers.length} tersedia)`}
                  </label>
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih driver</option>
                    {availableDrivers.length > 0 ? (
                      availableDrivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} - {driver.vehicle} {driver.capacity ? `(${driver.capacity}kg)` : ''}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Tidak ada driver tersedia</option>
                    )}
                  </select>
                  
                  {availableDrivers.length === 0 ? (
                    <p className="text-sm text-red-500 mt-2">
                      ⚠️ Semua driver sedang bertugas. Tunggu hingga ada driver yang tersedia.
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {availableDrivers.length} driver tersedia untuk pickup
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal & Waktu Pickup</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Pilih tanggal dan waktu untuk pickup sampah
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2">Detail Pickup</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Warkop</p>
                      <p className="font-medium">{selectedRequest.warkopName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Estimasi Berat</p>
                      <p className="font-medium">{selectedRequest.estimatedWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Alamat</p>
                      <p className="font-medium truncate">{selectedRequest.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Potensi Poin</p>
                      <p className="font-medium text-green-600">{selectedRequest.estimatedWeight * 100} poin</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSchedule}
                    disabled={!selectedDriver || !scheduledDate || availableDrivers.length === 0}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold ${!selectedDriver || !scheduledDate || availableDrivers.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'} text-white transition-all`}
                  >
                    <FaCalendarAlt className="inline mr-2" />
                    Jadwalkan Pickup
                  </motion.button>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Driver Info Box */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <FaTruck className="text-blue-500 mr-2" />
              Info Driver
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Driver</span>
                <span className="font-bold">{drivers.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tersedia</span>
                <span className="font-bold text-green-600">{availableDrivers.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sedang Bertugas</span>
                <span className="font-bold text-blue-600">{drivers.length - availableDrivers.length}</span>
              </div>
            </div>
          </div>

          {/* Scheduled for Today */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Pickup Terjadwal</h3>
            <div className="space-y-4">
              {scheduledRequests.length > 0 ? (
                scheduledRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="border border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">{request.warkopName}</h4>
                        <p className="text-xs text-gray-600">{request.scheduledDate}</p>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Driver</p>
                        <p className="font-medium">{request.assignedDriver || 'Belum ditugaskan'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Estimasi</p>
                        <p className="font-medium">{request.estimatedWeight} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium">Menunggu pickup</p>
                      </div>
                      <div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onMarkAsPickedUp(request.id)}
                          className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700"
                        >
                          <FaCheck className="inline mr-2" />
                          Tandai Diambil
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FaCalendarAlt className="text-3xl mx-auto mb-4 opacity-30" />
                  <p>Tidak ada pickup yang terjadwal</p>
                  <p className="text-sm mt-2">Jadwalkan pickup dari daftar kiri</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupSchedule;