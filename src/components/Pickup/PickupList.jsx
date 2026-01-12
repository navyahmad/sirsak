import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaCalendarAlt, FaTruck, FaWeight, FaCheck } from 'react-icons/fa';
import { STATUS_COLORS, STATUS_LABELS } from '../../data/constants';
import { useApp } from '../../contexts/AppContext';
import StatusTimeline from './StatusTimeline';

const PickupList = ({ pickups, isAdminSirsak = false }) => {
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { updatePickupStatus } = useApp();

  const handleStatusUpdate = (pickupId, newStatus) => {
    if (newStatus === 'WEIGHED') {
      const weight = prompt('Masukkan berat aktual (kg):');
      if (weight && !isNaN(weight)) {
        updatePickupStatus(pickupId, newStatus, parseFloat(weight));
      }
    } else {
      updatePickupStatus(pickupId, newStatus);
    }
  };

  const getNextAction = (status) => {
    switch(status) {
      case 'REQUESTED': return { label: 'Jadwalkan', action: 'SCHEDULED' };
      case 'SCHEDULED': return { label: 'Ambil Sampah', action: 'PICKED_UP' };
      case 'PICKED_UP': return { label: 'Timbang', action: 'WEIGHED' };
      case 'WEIGHED': return { label: 'Berikan Poin', action: 'POINT_GRANTED' };
      default: return null;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pickups.map((pickup, index) => {
          const nextAction = getNextAction(pickup.status);
          
          return (
            <motion.div
              key={pickup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Header */}
              <div className={`p-4 ${STATUS_COLORS[pickup.status]} text-white`}>
                <div className="flex justify-between items-center">
                  <h4 className="font-bold">Pickup #{pickup.id}</h4>
                  <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                    {STATUS_LABELS[pickup.status]}
                  </span>
                </div>
                <p className="text-sm opacity-90 mt-1">{pickup.brandName}</p>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Cabang:</p>
                    <p className="font-medium">{pickup.branches.join(', ')}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Estimasi Berat</p>
                      <p className="font-bold text-sirsak-primary">
                        {pickup.totalEstimatedWeight} kg
                      </p>
                    </div>
                    
                    {pickup.actualWeight && (
                      <div>
                        <p className="text-sm text-gray-500">Berat Aktual</p>
                        <p className="font-bold text-green-600">
                          {pickup.actualWeight} kg
                        </p>
                      </div>
                    )}
                    
                    {pickup.pointsEarned && (
                      <div>
                        <p className="text-sm text-gray-500">Poin Diperoleh</p>
                        <p className="font-bold text-yellow-600">
                          {pickup.pointsEarned.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {pickup.scheduledDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2" />
                      <span>Jadwal: {pickup.scheduledDate}</span>
                    </div>
                  )}
                  
                  {pickup.pickupTeam && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FaTruck className="mr-2" />
                      <span>Tim: {pickup.pickupTeam}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPickup(pickup);
                      setShowDetails(true);
                    }}
                    className="btn-secondary flex-1 flex items-center justify-center"
                  >
                    <FaEye className="mr-2" />
                    Detail
                  </button>
                  
                  {isAdminSirsak && nextAction && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusUpdate(pickup.id, nextAction.action)}
                      className="btn-primary flex-1 flex items-center justify-center"
                    >
                      {nextAction.label === 'Timbang' && <FaWeight className="mr-2" />}
                      {nextAction.label === 'Ambil Sampah' && <FaTruck className="mr-2" />}
                      {nextAction.label === 'Berikan Poin' && <FaCheck className="mr-2" />}
                      {nextAction.label}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetails && selectedPickup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Detail Pickup #{selectedPickup.id}
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-8">
                  <StatusTimeline 
                    currentStatus={selectedPickup.status} 
                    pickupData={selectedPickup}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-3">Informasi Pickup</h4>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Brand:</span> {selectedPickup.brandName}</p>
                      <p><span className="text-gray-600">Tanggal Request:</span> {selectedPickup.requestedDate}</p>
                      <p><span className="text-gray-600">Jadwal:</span> {selectedPickup.scheduledDate || '-'}</p>
                      <p><span className="text-gray-600">Tim Pickup:</span> {selectedPickup.pickupTeam || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-3">Data Berat & Poin</h4>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Estimasi Berat:</span> {selectedPickup.totalEstimatedWeight} kg</p>
                      <p><span className="text-gray-600">Berat Aktual:</span> {selectedPickup.actualWeight || '-'} kg</p>
                      <p><span className="text-gray-600">Poin Diperoleh:</span> 
                        {selectedPickup.pointsEarned 
                          ? ` ${selectedPickup.pointsEarned.toLocaleString()} poin`
                          : ' -'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PickupList;