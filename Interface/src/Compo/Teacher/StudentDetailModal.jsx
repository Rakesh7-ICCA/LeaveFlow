import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const StudentDetailModal = () => {


    return (
        <AnimatePresence>
            {selectedAccount && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setSelectedAccount(null)}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full"
                    >
                        <h2 className="text-xl font-semibold text-teal-800 mb-4">Student Details</h2>
                        <p><strong>Name:</strong> {selectedAccount.name}</p>
                        <p><strong>Username:</strong> {selectedAccount.username}</p>
                        <p><strong>Aadhar Number:</strong> {selectedAccount.adharnumber}</p>
                        <p><strong>Date of Birth:</strong> {selectedAccount.dateofbirth}</p>
                        <button
                            onClick={() => setSelectedAccount(null)}
                            className="mt-6 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default StudentDetailModal