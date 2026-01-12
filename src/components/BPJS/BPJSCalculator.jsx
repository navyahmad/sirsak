import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaUserFriends, FaCoins } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';
import { BPJS_PER_MONTH } from '../../data/constants';

const BPJSCalculator = ({ brand }) => {
  const { employees, exchangeBPJS } = useApp();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [months, setMonths] = useState(1);

  const uncoveredEmployees = employees.filter(emp => !emp.bpjsCovered).length;
  const maxEmployees = Math.min(uncoveredEmployees, Math.floor(brand.totalPoints / BPJS_PER_MONTH));
  
  const totalPointsNeeded = employeeCount * BPJS_PER_MONTH * months;
  const canExchange = brand.totalPoints >= totalPointsNeeded && employeeCount > 0;

  const handleExchange = () => {
    if (exchangeBPJS(brand.id, employeeCount)) {
      alert(`Berhasil menukarkan ${totalPointsNeeded.toLocaleString()} poin untuk ${employeeCount} pegawai`);
      setEmployeeCount(0);
      setMonths(1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-sirsak-primary bg-opacity-10 rounded-full">
          <FaCalculator className="h-6 w-6 text-sirsak-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Kalkulator BPJS</h3>
          <p className="text-sm text-gray-600">Hitung dan tukar poin untuk BPJS</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Employee Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <FaUserFriends className="inline mr-2" />
            Jumlah Pegawai
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max={maxEmployees}
              value={employeeCount}
              onChange={(e) => setEmployeeCount(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="text-2xl font-bold text-sirsak-primary min-w-[3rem] text-center">
              {employeeCount}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Maksimal: {maxEmployees} pegawai ({uncoveredEmployees} belum tercover)
          </p>
        </div>

        {/* Month Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Durasi (Bulan)
          </label>
          <div className="flex space-x-2">
            {[1, 3, 6, 12].map(month => (
              <button
                key={month}
                type="button"
                onClick={() => setMonths(month)}
                className={`flex-1 py-3 rounded-lg border transition-colors ${
                  months === month
                    ? 'border-sirsak-primary bg-sirsak-primary text-white'
                    : 'border-gray-300 hover:border-sirsak-primary'
                }`}
              >
                {month} {month === 1 ? 'Bulan' : 'Bulan'}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Result */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-sirsak-primary to-sirsak-secondary rounded-xl p-6 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{employeeCount}</div>
              <div className="text-sm opacity-80">Pegawai</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold">×</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold">{months}</div>
              <div className="text-sm opacity-80">Bulan</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white border-opacity-20">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FaCoins className="h-8 w-8" />
                <div>
                  <div className="text-sm opacity-80">Total Poin Dibutuhkan</div>
                  <div className="text-2xl font-bold">{totalPointsNeeded.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm opacity-80">Poin Tersedia</div>
                <div className="text-2xl font-bold">{brand.totalPoints.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: canExchange ? 1.02 : 1 }}
          whileTap={{ scale: canExchange ? 0.98 : 1 }}
          onClick={handleExchange}
          disabled={!canExchange}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            canExchange
              ? 'btn-primary'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canExchange ? 'Tukar Poin untuk BPJS' : 'Poin Tidak Cukup'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BPJSCalculator;