import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const ReceiptViewer = ({ imageUrl, isOpen=true, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 "
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header with teal accent */}
            <div className="bg-teal-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Receipt</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-teal-200 transition-colors"
                aria-label="Close receipt viewer"
              >
                <FiX size={24}/>
              </button>
            </div>

            {/* Image container */}
            <div className="p-4 md:p-6">
              <div className="relative h-[70vh] w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Receipt"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    No receipt image available
                  </div>
                )}
              </div>
            </div>

            {/* Footer with teal accent */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end border-t border-teal-100 dark:border-teal-900">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>

              
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReceiptViewer;