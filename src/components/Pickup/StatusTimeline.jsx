import { motion } from 'framer-motion';
import { 
  FaClock, 
  FaCalendarAlt, 
  FaTruck, 
  FaWeight, 
  FaCoins,
  FaCheckCircle 
} from 'react-icons/fa';
import { STATUS_COLORS, STATUS_LABELS } from '../../data/constants';

const statusIcons = {
  REQUESTED: FaClock,
  SCHEDULED: FaCalendarAlt,
  PICKED_UP: FaTruck,
  WEIGHED: FaWeight,
  POINT_GRANTED: FaCoins,
  REDEEMED: FaCheckCircle
};

const statusSteps = ['REQUESTED', 'SCHEDULED', 'PICKED_UP', 'WEIGHED', 'POINT_GRANTED', 'REDEEMED'];

const StatusTimeline = ({ currentStatus, pickupData }) => {
  const currentIndex = statusSteps.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Status Pickup</h3>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 h-full w-1 bg-gray-200 md:left-1/2 md:-translate-x-1/2" />
        
        <div className="space-y-8">
          {statusSteps.map((status, index) => {
            const Icon = statusIcons[status];
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="flex-shrink-0 relative z-10">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted ? STATUS_COLORS[status] : 'bg-gray-300'
                  }`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Current Status Ring */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full border-4 border-sirsak-primary border-opacity-30 animate-ping" />
                  )}
                </div>

                {/* Content Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex-1 mx-4 p-4 rounded-lg ${
                    isCompleted ? 'bg-sirsak-light' : 'bg-gray-50'
                  } ${index % 2 === 0 ? 'md:ml-8' : 'md:mr-8 md:text-right'}`}
                >
                  <h4 className={`font-bold ${
                    isCompleted ? 'text-sirsak-primary' : 'text-gray-500'
                  }`}>
                    {STATUS_LABELS[status]}
                  </h4>
                  
                  {status === 'SCHEDULED' && pickupData?.scheduledDate && (
                    <p className="text-sm mt-1">
                      Tanggal: {pickupData.scheduledDate}
                    </p>
                  )}
                  
                  {status === 'WEIGHED' && pickupData?.actualWeight && (
                    <p className="text-sm mt-1">
                      Berat Aktual: {pickupData.actualWeight} kg
                    </p>
                  )}
                  
                  {status === 'POINT_GRANTED' && pickupData?.pointsEarned && (
                    <p className="text-sm mt-1">
                      Poin: {pickupData.pointsEarned.toLocaleString()}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusTimeline;