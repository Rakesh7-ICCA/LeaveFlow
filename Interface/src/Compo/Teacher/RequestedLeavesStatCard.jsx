import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ request }) => {
    // Hardcoded request data
    // const request = {
    //     "name": "Deeksha Vaidya",
    //     "classinfo": "2nd Year-A",
    //     "leaveType": "annual",
    //     "startDate": "22-04-2025",
    //     "endDate": "24-04-2025",
    //     "reason": "I am not well",
    //     "contact": "gaurakesh42@gmail.com",
    //     "granted": false,
    //     "requestedDate": "29-04-2025"
    // };

    const isAdmin = true; // Set to false to see employee view

    // Mock action handlers
    const handleAccept = () => {
        (async () => {
            const res = await axios.post('https://zpc7dvw1-5134.inc1.devtunnels.ms/api/LeaveRequests/GrantLeave?leaveId=' + request.leaveId + '&granted=true')
            alert(res.data.message)
        })()
    }

    const handleDecline = () => alert('Leave declined!');
    const handleWithdraw = () => alert('Leave withdrawn!');

    // Status colors mapping
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };


    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                
                <h1 className="px-2 py-1 w-full rounded-full bg-teal-100 text-teal-800">
                    {request.leaveType} Leave
                </h1>
            </div>

            <div className="mt-3">
                <p className="text-sm">
                    📅 <span className="font-medium">{request.startDate} - {request.endDate}</span>
                </p>
                <p className="text-sm mt-1">🏥 {request.reason}</p>
                <p className="text-sm mt-1">🏥 Requested on : <span>{request.requestedDate}</span></p>
            </div>

            <div className="flex justify-between items-center mt-4">
                {request.granted == null && <span className="text-xs text-yellow-600 bg-teal-50 px-2 py-1 rounded">
                    Pending
                </span>
                }
                {request.granted != null &&

                    (request.granted ?
                        <span className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded">
                            Approved
                        </span>
                        :
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            Rejected
                        </span>)

                }
            </div>
        </div>
    );
};



export default StatCard