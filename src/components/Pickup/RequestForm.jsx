import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';

const RequestForm = ({ brand, onSuccess }) => {
  const { createPickupRequest } = useApp();
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [estimatedWeight, setEstimatedWeight] = useState(0);

  const handleBranchToggle = (branchId) => {
    setSelectedBranches(prev => 
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  const calculateTotalWeight = () => {
    const selected = brand.branches.filter(b => selectedBranches.includes(b.id));
    return selected.reduce((sum, branch) => sum + branch.estimatedWeight, 0);
  };

  const handleSubmit = () => {
    if (selectedBranches.length === 0) {
      alert('Pilih minimal satu cabang');
      return;
    }

    const pickup = createPickupRequest(
      brand.id,
      selectedBranches,
      calculateTotalWeight()
    );

    onSuccess?.(pickup);
    
    // Reset form
    setSelectedBranches([]);
    setEstimatedWeight(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6">Request Pickup Baru</h3>
      
      <div className="space-y-6">
        {/* Cabang Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pilih Cabang untuk Pickup
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
            {brand.branches.map(branch => (
              <motion.div
                key={branch.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBranchToggle(branch.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedBranches.includes(branch.id)
                    ? 'border-sirsak-primary bg-sirsak-light'
                    : 'border-gray-200 hover:border-sirsak-primary'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{branch.name}</h4>
                    <p className="text-sm text-gray-500 truncate">{branch.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{branch.estimatedWeight} kg</div>
                    <div className="text-xs text-gray-400">Estimasi</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedBranches.length > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total Cabang Dipilih:</span>
              <span className="font-bold">{selectedBranches.length}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total Estimasi Berat:</span>
              <span className="font-bold text-sirsak-primary">
                {calculateTotalWeight()} kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Estimasi Poin:</span>
              <span className="font-bold text-sirsak-primary">
                {calculateTotalWeight() * 100} poin
              </span>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedBranches([])}
            className="btn-secondary flex-1 flex items-center justify-center space-x-2"
          >
            <FaTrash />
            <span>Reset</span>
          </button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={selectedBranches.length === 0}
            className={`btn-primary flex-1 flex items-center justify-center space-x-2 ${
              selectedBranches.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaPlus />
            <span>Request Pickup</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RequestForm;