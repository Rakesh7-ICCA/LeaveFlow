import React, { useEffect, useState } from 'react'
import UserCard from './UserCard';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';

const RequestedStudents = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        (async () => {
            const res = await axios.get('https://leaveflow.runasp.net/api/Teacher/loadStaff?userId=' + localStorage.getItem('id'))
            if (res.status === 200) {
                setUsers(res.data.message)
            }
            else {
                alert("Error in fetching data")
            }

        })()
    }, [])

    const toggle = () => {
        setIsChecked(!isChecked);
    };

    const onAccept = async (id) => {
        const res = await axios.post('https://leaveflow.runasp.net/api/Teacher/GrantTeacher?id=' + id)
        if (res.status === 200) {
            alert("Accepted")
            setUsers(prev => prev.map((org, index) =>
                org.teacherId == id ? { ...org, granted: true } : org
            ))
        }
        else {
            alert(res.data.message)
        }
    }

    const onDeny = async (id) => {
        const res = await axios.post('https://leaveflow.runasp.net/api/Teacher/RevokeTeacher?id=' + id)
        if (res.status === 200) {
            alert("Rejected")
            setUsers(prev => prev.map((org, index) =>
                org.teacherId == id ? { ...org, granted: false } : org
            ))
        }
        else {
            alert(res.data.message)
        }
    }
    return (

        <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-teal-100/35 to-teal-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700  text-gray-800 dark:text-gray-200">
            <div className='flex flex-col gap-5 justify-between px-10 py-10'>
                <div>
                    <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 mb-2">
                        Requestd Staffs
                    </h1>
                    <p className="text-teal-600/80 dark:text-teal-400/80">
                        Performance overview and analytics
                    </p>

                </div>


                <label className="flex items-center cursor-pointer">
                    {/* Toggle */}
                    <div className="relative">
                        {/* Input */}
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={isChecked}
                            onChange={toggle}
                        />
                        {/* Track */}
                        <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${isChecked
                            ? 'bg-teal-500 dark:bg-teal-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                            }`}></div>
                        {/* Thumb */}
                        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${isChecked ? 'transform translate-x-6' : ''
                            }`}></div>
                    </div>
                    {/* Label */}
                    <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                        {isChecked ? 'Approved' : 'Request'}
                    </div>
                </label>

            </div>
            <div className='flex flex-col lg:flex-row gap-6'>

                <AnimatePresence>

                    {users.length > 0 && users.map((user, index) => {
                        if (isChecked == user.granted)
                            return <UserCard userObj={user} onAcc={onAccept} onDeny={onDeny} />
                        
                    })}

                </AnimatePresence>
            </div>
        </div>
    )
}


export default RequestedStudents