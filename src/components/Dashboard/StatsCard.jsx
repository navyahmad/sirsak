import { motion } from 'framer-motion';
import { formatNumber } from '../../data/utils';

const StatsCard = ({ icon: Icon, label, value, color, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {trend && (
            <p className={`text-sm mt-2 ${trest > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% dari bulan lalu
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className="h-8 w-8" style={{ color: color }} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;