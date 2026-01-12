import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';
import BranchForm from './BranchForm';

const BranchManager = ({ brand }) => {
  const { updateBranch } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const handleDelete = (branchId) => {
    if (window.confirm('Apakah yakin ingin menghapus cabang ini?')) {
      // In a real app, you would call an API here
      alert('Cabang berhasil dihapus (simulasi)');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Kelola Cabang</h3>
          <p className="text-gray-600">Total {brand.branches.length} cabang aktif</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingBranch(null);
            setIsFormOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Tambah Cabang</span>
        </motion.button>
      </div>

      {/* Branch List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brand.branches.map((branch, index) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            {/* Branch Header */}
            <div className="bg-gradient-to-r from-sirsak-primary to-sirsak-accent p-4 text-white">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg">{branch.name}</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(branch)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(branch.id)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm opacity-90">
                <FaMapMarkerAlt className="mr-2" />
                <span className="truncate">{branch.address}</span>
              </div>
            </div>

            {/* Branch Details */}
            <div className="p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Estimasi Sampah</p>
                    <p className="font-bold text-sirsak-primary">
                      {branch.estimatedWeight} kg/bulan
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Potensi Poin</p>
                    <p className="font-bold text-yellow-600">
                      {branch.estimatedWeight * 100}/bulan
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Terakhir Pickup</p>
                  <p className="font-medium">{branch.lastPickup || 'Belum pernah'}</p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Koordinat</div>
                    <div className="text-sm font-mono">
                      {branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Branch Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <BranchForm
            brandId={brand.id}
            branch={editingBranch}
            onClose={() => {
              setIsFormOpen(false);
              setEditingBranch(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BranchManager;