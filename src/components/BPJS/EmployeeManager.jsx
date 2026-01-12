import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaUserCheck, FaUserTimes, FaIdCard } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';

const EmployeeManager = () => {
  const { employees, toggleBPJS, addEmployee, brands } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    salary: 0
  });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    addEmployee(newEmployee);
    setNewEmployee({ name: '', position: '', salary: 0 });
    setIsAdding(false);
  };

  const coveredCount = employees.filter(emp => emp.bpjsCovered).length;
  const totalMonthlyCost = coveredCount * 10000; // 10k points per employee

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-sirsak-primary">{employees.length}</div>
          <div className="text-sm text-gray-500">Total Pegawai</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-green-500">{coveredCount}</div>
          <div className="text-sm text-gray-500">Terkover BPJS</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-yellow-600">
            {totalMonthlyCost.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Poin/Bulan</div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAdding(true)}
          className="bg-sirsak-primary text-white rounded-xl shadow-md p-6 flex items-center justify-center cursor-pointer"
        >
          <FaUserPlus className="h-8 w-8" />
        </motion.div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-3">
            <FaIdCard className="text-sirsak-primary" />
            <h3 className="font-bold text-gray-800">Daftar Pegawai</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Nama</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Posisi</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Gaji</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Tanggal Bergabung</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">BPJS</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">{emp.name}</td>
                  <td className="p-4">{emp.position}</td>
                  <td className="p-4">
                    Rp {emp.salary.toLocaleString()}
                  </td>
                  <td className="p-4">{emp.joinDate}</td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      emp.bpjsCovered 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {emp.bpjsCovered ? 'Aktif' : 'Nonaktif'}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleBPJS(emp.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        emp.bpjsCovered
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {emp.bpjsCovered ? (
                        <>
                          <FaUserTimes />
                          <span>Nonaktifkan</span>
                        </>
                      ) : (
                        <>
                          <FaUserCheck />
                          <span>Aktifkan</span>
                        </>
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h4 className="font-bold text-gray-800 mb-4">Tambah Pegawai Baru</h4>
          <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              className="input-field"
              required
            />
            
            <input
              type="text"
              placeholder="Posisi/Jabatan"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
              className="input-field"
              required
            />
            
            <input
              type="number"
              placeholder="Gaji Bulanan"
              value={newEmployee.salary}
              onChange={(e) => setNewEmployee({...newEmployee, salary: parseInt(e.target.value) || 0})}
              className="input-field"
              required
            />
            
            <div className="md:col-span-3 flex space-x-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn-secondary flex-1"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Tambah Pegawai
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeManager;