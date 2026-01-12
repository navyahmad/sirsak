import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUserFriends, FaTruck } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';
import { pickupTeams } from '../../data/mockData';

const PickupSchedule = ({ pickup }) => {
  const { schedulePickup } = useApp();
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  const handleSchedule = () => {
    if (!scheduledDate || !selectedTeam) {
      alert('Harap isi tanggal dan pilih tim');
      return;
    }

    schedulePickup(pickup.id, scheduledDate, selectedTeam);
    
    // Reset form
    setScheduledDate('');
    setSelectedTeam('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="bg-white rounded-xl shadow-md p-6 mt-4"
    >
      <h4 className="font-bold text-gray-800 mb-4">Jadwalkan Pickup</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaCalendarAlt className="inline mr-2" />
            Tanggal Pickup
          </label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="input-field"
          />
        </div>

        {/* Team Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaUserFriends className="inline mr-2" />
            Pilih Tim Pickup
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="input-field"
          >
            <option value="">Pilih Tim</option>
            {pickupTeams.map(team => (
              <option key={team.id} value={team.name}>
                {team.name} ({team.driver}) - {team.vehicle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Info */}
      {selectedTeam && scheduledDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-sirsak-light rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-sirsak-primary text-white p-3 rounded-full">
              <FaTruck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Rencana Pickup</p>
              <p className="text-sm text-gray-600">
                Tanggal: {scheduledDate} | Tim: {selectedTeam}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      <div className="mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSchedule}
          disabled={!scheduledDate || !selectedTeam}
          className={`w-full btn-primary ${
            (!scheduledDate || !selectedTeam) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Konfirmasi Jadwal
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PickupSchedule;