import axios from 'axios';
import { motion } from 'framer-motion';

const LeavesCard = ({ request, leavesSetFunc, ind}) => {
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
            const res = await axios.post('https://leaveflow.runasp.net/api/LeaveRequests/GrantLeave?leaveId=' + request.leaveId + '&granted=true')
            alert(res.data.message)
            leavesSetFunc(prev => prev.map((ele, index) => (ele.leaveId == request.leaveId ? { ...ele, granted: true } : ele)))
        })()
    }
    const handleReject = () => {
        (async () => {
            const res = await axios.post('https://leaveflow.runasp.net/api/LeaveRequests/GrantLeave?leaveId=' + request.leaveId + '&granted=false')
            alert(res.data.message)
            leavesSetFunc(prev => prev.map((ele, index) => index == ind ? { ...ele, granted: false } : ele))
        })()
    }

    
// Status colors mapping
const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};


return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-medium">{request.name}</h3>
                <p className="text-sm text-gray-500">{request.classinfo}</p>
            </div>
            <span className="px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-800">
                {request.leaveType} Leave
            </span>
        </div>

        <div className="mt-3">
            <p className="text-sm">
                📅 <span className="font-medium">{request.startDate} - {request.endDate}</span>
            </p>
            <p className="text-sm mt-1">🏥 {request.reason}</p>
            <p className="text-sm mt-1">🏥 Requested on : <span>{request.requestedDate}</span></p>
        </div>

        <div className="flex justify-between items-center mt-4">
            {!request.granted && <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                Pending
            </span>}
            {
                request.granted &&
                <span className="text-xs text-teal-600 bg-yellow-50 px-2 py-1 rounded">
                    Approved
                </span>

            }

            {!request.granted && <div className='flex gap-3'>
                <button onClick={handleAccept}
                    className="mt-2 w-full py-1 px-5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white rounded-lg transition-colors"
                >
                    Accept
                </button>

                <button
                onClick={handleReject}
                    className="mt-2 w-full py-1 px-5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors"
                >
                    Reject
                </button>

            </div>}
        </div>
    </div>
);
};

export default LeavesCard;