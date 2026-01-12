import { motion } from 'framer-motion';
import { FaCoins, FaExchangeAlt } from 'react-icons/fa';
import { formatNumber } from '../../data/utils';
import { BPJS_PER_MONTH } from '../../data/constants';

const PointDisplay = ({ points, onExchange }) => {
  const bpjsCoverage = Math.floor(points / BPJS_PER_MONTH);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-sirsak-primary to-sirsak-secondary rounded-xl shadow-lg p-8 text-white"
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center space-x-3 mb-4">
            <FaCoins className="h-10 w-10" />
            <div>
              <h3 className="text-2xl font-bold">Total Poin</h3>
              <p className="text-sirsak-light">Dapat ditukarkan kapan saja</p>
            </div>
          </div>
          <div className="text-5xl font-bold mb-2">{formatNumber(points)}</div>
          <p className="text-sirsak-light">
            Cukup untuk {bpjsCoverage} pegawai BPJS 1 bulan
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExchange}
          className="bg-white text-sirsak-primary font-bold px-8 py-3 rounded-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-3"
        >
          <FaExchangeAlt />
          <span>Tukar Poin</span>
        </motion.button>
      </div>

      <div className="mt-8 pt-6 border-t border-white border-opacity-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">1 kg</div>
            <div className="text-sm opacity-80">Sampah MLP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">=</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">100 Poin</div>
            <div className="text-sm opacity-80">Nilai Tukar</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PointDisplay;