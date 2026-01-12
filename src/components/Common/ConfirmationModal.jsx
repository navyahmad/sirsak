import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
  if (!isOpen) return null;

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
        className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${
            type === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
          } mb-4`}>
            {type === 'warning' ? (
              <FaExclamationTriangle className="h-8 w-8 text-yellow-600" />
            ) : (
              <FaCheck className="h-8 w-8 text-green-600" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn-primary flex-1 ${
              type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' : ''
            }`}
          >
            Konfirmasi
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationModal;