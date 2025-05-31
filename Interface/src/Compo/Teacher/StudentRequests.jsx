import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const StudentRequests = () => {
    const [view, setView] = useState('approved');
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);


    useEffect(() => {
        (async () => {

            let sampleStudents = []
            sampleStudents = await axios.get('https://leaveflow.runasp.net/api/teacher/LoadRegisteredStudents?userid=' + localStorage.getItem('id'))


            const formatted = sampleStudents.data.students.map((student, index) => {
                const isApproved = student.granted;
                return {
                    adharnumber: student.adharnumber || 'N/A',
                    dateofbirth: student.dateofbirth || 'N/A',
                    id: student.stuId,
                    name: student.name || 'Unnamed',
                    userName: student.username || 'N/A',
                    email: student.email || 'N/A',
                    role: 'Student',
                    registeredDate: new Date().toISOString(),
                    status: isApproved ? 'approved' : 'pending',
                    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name || 'U')}`
                };
            });
            setAccounts(formatted);

        })()
    }, []);

    const handleApprove = (id) => {

        (async () => {
            const res = await axios.post('https://leaveflow.runasp.net/api/teacher/GrantStudent?id=' + id)
            if (res.status == 200) {
                alert(res.data.message)
                setAccounts(prev =>
                    prev.map(account =>
                        account.id === id ? { ...account, status: 'approved' } : account
                    )
                );
            }
            else {
                alert('Error approving student. Please try again later.')
            }
        })()
    };

    const handleReject = (id) => {
        setAccounts(prev =>
            prev.map(account =>
                account.id === id ? { ...account, status: 'rejected' } : account
            )
        );
    };

    const filteredAccounts = accounts.filter(account =>
        view === 'requests' ? account.status === 'pending' : account.status === 'approved'
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-teal-50 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 tracking-tight text-center sm:text-left">
                        Account Dashboard
                    </h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setView('requests')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition whitespace-nowrap ${view === 'requests'
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-white text-teal-600 border border-teal-300 hover:bg-teal-50'
                                }`}
                        >
                            Requests
                        </button>
                        <button
                            onClick={() => setView('approved')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition whitespace-nowrap ${view === 'approved'
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-white text-teal-600 border border-teal-300 hover:bg-teal-50'
                                }`}
                        >
                            Approved
                        </button>
                    </div>
                </div>

                {filteredAccounts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-white rounded-xl shadow-md border border-teal-100"
                    >
                        <p className="text-teal-600 text-lg">No accounts found for {view}</p>
                    </motion.div>
                ) : (
                    <div className="space-y-5">
                        <AnimatePresence>
                            {filteredAccounts.map((account) => (
                                <motion.div
                                    key={account.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-teal-100"
                                >
                                    <div className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                            <img
                                                src={account.avatar}
                                                alt={account.name}
                                                className="h-14 w-14 rounded-full object-cover border border-teal-200"
                                            />
                                            <div className="flex-1 text-center sm:text-left">
                                                <h3 className="font-semibold text-lg sm:text-xl text-teal-800 cursor-pointer" onClick={() => {console.log(account);setSelectedAccount(account)}}>{account.name}</h3>
                                                <p className="text-sm text-gray-500 break-all">{account.email}</p>
                                                <div className="flex flex-wrap justify-center sm:justify-start items-center mt-2 gap-2 text-sm">
                                                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                                                        {account.role}
                                                    </span>
                                                    <span className="text-gray-400">
                                                        Registered: {new Date(account.registeredDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {view === 'requests' && (
                                            <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-6 pt-4 border-t border-teal-100">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleReject(account.id)}
                                                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    Reject
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleApprove(account.id)}
                                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                                >
                                                    Approve
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Modal */}
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
                                <p><strong>Username:</strong> {selectedAccount.userName}</p>
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
            </div>
        </div>
    );
};

export default StudentRequests;