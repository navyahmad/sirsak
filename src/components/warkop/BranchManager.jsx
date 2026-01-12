import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStore, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaUserTie,
  FaPlus,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaTrash
} from 'react-icons/fa';
import { GiCoffeeCup } from 'react-icons/gi';

const BranchManager = ({ branches, onAddBranch, onUpdateBranch }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: -6.2,
    lng: 106.8,
    phone: '',
    manager: '',
    estimatedWeight: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBranch) {
      onUpdateBranch(editingBranch.id, formData);
    } else {
      onAddBranch(formData);
    }
    setShowForm(false);
    setEditingBranch(null);
    setFormData({
      name: '',
      address: '',
      lat: -6.2,
      lng: 106.8,
      phone: '',
      manager: '',
      estimatedWeight: 0
    });
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      lat: branch.lat,
      lng: branch.lng,
      phone: branch.phone,
      manager: branch.manager,
      estimatedWeight: branch.estimatedWeight
    });
    setShowForm(true);
  };

  const toggleBranchStatus = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    onUpdateBranch(branchId, { status: branch.status === 'active' ? 'inactive' : 'active' });
  };

  const activeBranches = branches.filter(b => b.status === 'active');
  const inactiveBranches = branches.filter(b => b.status === 'inactive');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Cabang</h2>
          <p className="text-gray-600">Tambah dan kelola cabang warkop Anda</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700"
        >
          <FaPlus className="mr-2" />
          Tambah Cabang
        </motion.button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingBranch ? 'Edit Cabang' : 'Tambah Cabang Baru'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Cabang
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Contoh: STK Sudirman"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Jl. Sudirman No. 123"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telepon
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="+62 812-3456-7890"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Cabang
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Nama manager"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimasi Sampah Bulanan (kg)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.estimatedWeight}
                    onChange={(e) => setFormData({...formData, estimatedWeight: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="25"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Koordinat (Latitude)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({...formData, lat: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Koordinat (Longitude)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({...formData, lng: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700"
                >
                  {editingBranch ? 'Update Cabang' : 'Simpan Cabang'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBranch(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Branches */}
      <div>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
            <FaStore className="text-green-500 text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Cabang Aktif</h3>
            <p className="text-gray-600">{activeBranches.length} cabang aktif</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeBranches.map((branch) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <GiCoffeeCup className="text-green-500 text-2xl mr-3" />
                  <div>
                    <h4 className="font-bold text-gray-800">{branch.name}</h4>
                    <p className="text-sm text-green-600">Aktif</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(branch)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <FaEdit className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => toggleBranchStatus(branch.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <FaToggleOn className="text-green-500 text-xl" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-gray-400 mr-2" />
                  <span className="text-gray-700 truncate">{branch.address}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-gray-400 mr-2" />
                  <span className="text-gray-700">{branch.phone}</span>
                </div>
                <div className="flex items-center">
                  <FaUserTie className="text-gray-400 mr-2" />
                  <span className="text-gray-700">{branch.manager}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-gray-600">Estimasi sampah bulanan:</p>
                  <p className="text-lg font-bold text-green-600">{branch.estimatedWeight} kg</p>
                  <p className="text-xs text-gray-500">
                    ≈ {branch.estimatedWeight * 100} poin
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Inactive Branches */}
      {inactiveBranches.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <FaStore className="text-gray-400 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Cabang Nonaktif</h3>
              <p className="text-gray-600">{inactiveBranches.length} cabang nonaktif</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inactiveBranches.map((branch) => (
              <div key={branch.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <GiCoffeeCup className="text-gray-400 text-2xl mr-3" />
                    <div>
                      <h4 className="font-bold text-gray-800">{branch.name}</h4>
                      <p className="text-sm text-gray-500">Nonaktif</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBranchStatus(branch.id)}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <FaToggleOff className="text-gray-400 text-xl" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{branch.address}</p>
                <button
                  onClick={() => handleEdit(branch)}
                  className="text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  Aktifkan kembali
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManager;