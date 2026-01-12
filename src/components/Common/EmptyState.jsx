import { motion } from 'framer-motion';
import { FaInbox } from 'react-icons/fa';

const EmptyState = ({ message, actionLabel, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 mb-6">
        <FaInbox className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Data kosong</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{message}</p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;