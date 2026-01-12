import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaUserPlus, 
  FaUserEdit, 
  FaMoneyBillWave,
  FaShieldAlt,
  FaCalendarCheck,
  FaCoins,
  FaTrash
} from 'react-icons/fa';

const EmployeeManager = ({ employees, branches, onAddEmployee, onRedeemBPJS }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [bpjsMonths, setBpjsMonths] = useState(12);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    branchId: '',
    salary: '',
    bpjsStatus: 'pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEmployee({
      ...formData,
      salary: parseInt(formData.salary),
      branchId: parseInt(formData.branchId),
      bpjsPaidUntil: formData.bpjsStatus === 'active' ? new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString().split('T')[0] : null,
      pointsUsedForBPJS: 0
    });
    setShowForm(false);
    setFormData({
      name: '',
      position: '',
      branchId: '',
      salary: '',
      bpjsStatus: 'pending'
    });
  };

  const handleRedeemBPJS = (employeeId) => {
    if (onRedeemBPJS(employeeId, bpjsMonths)) {
      setSelectedEmployee(null);
      setBpjsMonths(12);
    }
  };

  const activeEmployees = employees.filter(e => e.bpjsStatus === 'active');
  const pendingEmployees = employees.filter(e => e.bpjsStatus === 'pending');
  const inactiveEmployees = employees.filter(e => e.bpjsStatus === 'inactive');

  const calculateBPJSPoints = (salary, months = 12) => {
    // Simulasi perhitungan BPJS: 10,000 poin per bulan + faktor gaji
    const basePoints = months * 10000;
    const salaryFactor = salary * 0.00004;
    return Math.round(basePoints + salaryFactor);
  };

  const getBranchName = (branchId) => {
    return branches.find(b => b.id === branchId)?.name || '-';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Pegawai</h2>
          <p className="text-gray-600">Kelola data pegawai & pembayaran BPJS</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            {activeEmployees.length} BPJS Aktif
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700"
          >
            <FaUserPlus className="mr-2" />
            Tambah Pegawai
          </motion.button>
        </div>
      </div>

      {/* Add Employee Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tambah Pegawai Baru</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nama pegawai"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posisi
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Barista, Kasir"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cabang
                  </label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({...formData, branchId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih cabang...</option>
                    {branches.filter(b => b.status === 'active').map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gaji Bulanan
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2">Rp</span>
                    <input
                      type="number"
                      required
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5000000"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status BPJS
                  </label>
                  <select
                    value={formData.bpjsStatus}
                    onChange={(e) => setFormData({...formData, bpjsStatus: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700"
                >
                  Simpan Pegawai
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
            <FaUsers className="text-blue-500 text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Daftar Pegawai</h3>
            <p className="text-gray-600">{employees.length} pegawai terdaftar</p>
          </div>
        </div>

        {/* BPJS Active Employees */}
        <div className="mb-8">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <FaShieldAlt className="text-green-500 mr-2" />
            BPJS Aktif ({activeEmployees.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEmployees.map((employee) => (
              <div key={employee.id} className="border border-green-200 bg-green-50 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-bold text-gray-800">{employee.name}</h5>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Aktif
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cabang</span>
                    <span className="font-medium">{getBranchName(employee.branchId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gaji</span>
                    <span className="font-medium">Rp {employee.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">BPJS Berakhir</span>
                    <span className="font-medium">{employee.bpjsPaidUntil || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Poin Digunakan</span>
                    <span className="font-bold text-amber-600">
                      {employee.pointsUsedForBPJS.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedEmployee(employee)}
                  className="w-full mt-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 text-sm font-medium"
                >
                  <FaCoins className="inline mr-2" />
                  Perpanjang BPJS
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BPJS Pending Employees */}
        {pendingEmployees.length > 0 && (
          <div className="mb-8">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
              <FaCalendarCheck className="text-yellow-500 mr-2" />
              Menunggu BPJS ({pendingEmployees.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingEmployees.map((employee) => (
                <div key={employee.id} className="border border-yellow-200 bg-yellow-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-bold text-gray-800">{employee.name}</h5>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                      Pending
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gaji</span>
                      <span className="font-medium">Rp {employee.salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">BPJS Berakhir</span>
                      <span className="font-medium">{employee.bpjsPaidUntil || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Poin Dibutuhkan (12 bln)</span>
                      <span className="font-bold text-amber-600">
                        {calculateBPJSPoints(employee.salary, 12).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setBpjsMonths(12);
                    }}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 text-sm font-medium"
                  >
                    <FaCoins className="inline mr-2" />
                    Aktifkan BPJS
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BPJS Redeem Modal */}
        <AnimatePresence>
          {selectedEmployee && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedEmployee(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  <FaMoneyBillWave className="inline mr-2 text-green-500" />
                  Tukar Poin untuk BPJS
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-2">Pegawai</p>
                    <p className="font-bold text-lg">{selectedEmployee.name}</p>
                    <p className="text-gray-600">{selectedEmployee.position}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi (bulan)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 6, 12, 24].map((months) => (
                        <button
                          key={months}
                          type="button"
                          onClick={() => setBpjsMonths(months)}
                          className={`py-2 rounded-lg ${bpjsMonths === months ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {months} bln
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-800 mb-2">Ringkasan Pembayaran</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Durasi BPJS</span>
                        <span className="font-medium">{bpjsMonths} bulan</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Poin per bulan</span>
                        <span className="font-medium">10,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Faktor gaji</span>
                        <span className="font-medium">
                          {Math.round(selectedEmployee.salary * 0.00004).toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-blue-200 pt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total Poin</span>
                          <span className="text-blue-600">
                            {calculateBPJSPoints(selectedEmployee.salary, bpjsMonths).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRedeemBPJS(selectedEmployee.id)}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700"
                    >
                      <FaCoins className="inline mr-2" />
                      Konfirmasi Pembayaran
                    </motion.button>
                    <button
                      onClick={() => setSelectedEmployee(null)}
                      className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmployeeManager;