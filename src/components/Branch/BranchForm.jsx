import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';

const BranchForm = ({ brandId, branch, onClose }) => {
  const { addBranch, updateBranch } = useApp();
  const [formData, setFormData] = useState({
    name: branch?.name || '',
    address: branch?.address || '',
    lat: branch?.lat || -6.2088,
    lng: branch?.lng || 106.8456,
    estimatedWeight: branch?.estimatedWeight || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const branchData = {
      id: branch?.id || Date.now(),
      ...formData,
      lastPickup: null
    };

    if (branch) {
      updateBranch(brandId, branch.id, branchData);
    } else {
      addBranch(brandId, branchData);
    }

    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('lat') || name.includes('lng') || name.includes('estimatedWeight')
        ? parseFloat(value) || 0
        : value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
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
              {branch ? 'Edit Cabang' : 'Tambah Cabang Baru'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Cabang *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Contoh: STK Merdeka"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Lengkap *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="input-field"
                placeholder="Masukkan alamat lengkap cabang"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimasi Sampah (kg/bulan) *
                </label>
                <input
                  type="number"
                  name="estimatedWeight"
                  value={formData.estimatedWeight}
                  onChange={handleChange}
                  required
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Estimasi Poin:</p>
              <p className="text-2xl font-bold text-sirsak-primary">
                {(formData.estimatedWeight * 100).toLocaleString()} poin/bulan
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Batal
              </button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex-1"
              >
                {branch ? 'Simpan Perubahan' : 'Tambah Cabang'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BranchForm;