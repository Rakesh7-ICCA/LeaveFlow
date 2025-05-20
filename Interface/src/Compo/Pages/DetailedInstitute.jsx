import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaMoneyBill } from 'react-icons/fa';
import { FaReceipt } from 'react-icons/fa6';
import { FiMail, FiCheckCircle, FiCalendar, FiX } from 'react-icons/fi';
import dp from '../../assets/DefaultProfile.png'
import ReceiptViewer from './ReceiptViewer';

const DetailedInstitute = ({ isOpen = true, onClose, id, functionObj }) => {

    const [data, setData] = useState({})
    const [receipt, setRecipt] = useState(false)
    useEffect(() => {
        (async () => {
            const res = await axios.get('https://leaveflow.runasp.net/api/Organizations/GetOrganizationByOrgId/' + id)
            if (res.status) {
                setData(res.data)
            }
        })()
    }, [])


    

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
                    >
                        {/* Header with teal accent */}
                        <div className="bg-teal-600 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Data Details</h2>
                            <button
                                onClick={() => { onClose() }}
                                className="text-white hover:text-teal-200 transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Mail Information */}
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-start"
                            >
                                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 mr-4">
                                    <FiMail size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {data?.email || 'Not specified'}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Handled Information */}
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-start"
                            >
                                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 mr-4">
                                    <FiCheckCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Handled</h3>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {data?.handler || 'Not specified'}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Package */}
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-start"
                            >
                                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 mr-4">
                                    <FaMoneyBill size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription</h3>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {(data?.planName || 'Not specified') + ' Plan'}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Date Information */}
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-start"
                            >
                                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 mr-4">
                                    <FiCalendar size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Meeting Completed</h3>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {data?.meetingDate || 'Not specified'}
                                    </p>
                                </div>
                            </motion.div>
                           
                           {/* Granted date */}
                            {data.granted && <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-start"
                            >
                                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 mr-4">
                                    <FiCalendar size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Granted</h3>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {data?.agreedDate || 'Not specified'}
                                    </p>
                                </div>
                            </motion.div>}

                            {/* Receipt Information */}
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center"
                            >

                                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 mr-4">
                                    <FaReceipt size={20} />
                                </div>
                                <div>
                                    <button
                                        onClick={() => { setRecipt(true) }}
                                        className="px-4 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
                                        Show Receipt
                                    </button>
                                    {receipt && <ReceiptViewer onClose={() => { setRecipt(false) }} imageUrl={data.paymentProof} />}
                                </div>
                            </motion.div>
                        </div>

                        {/* Footer with teal accent */}
                        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-row-reverse justify-between border-t border-teal-100 dark:border-teal-900">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            <div className='flex gap-1 w-1/2'>
                                {!data.granted && <button
                                    onClick={() => { functionObj.grantOrganization(id) }}
                                    className="mt-2 w-full py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white rounded-lg transition-colors"
                                >
                                    Grant
                                </button>}
                                <button
                                    className="mt-2 w-full py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors"
                                >
                                    {data.granted ? "Block Service" : "Deny"}
                                </button>

                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DetailedInstitute;

// Usage Example:
// <OrganizationModal
//   isOpen={isModalOpen}
//   onClose={() => setIsModalOpen(false)}
//   organization={{
//     name: "ABC University",
//     email: "contact@abc.edu",
//     dataHandled: "15.7 TB",
//     lastUpdated: "2023