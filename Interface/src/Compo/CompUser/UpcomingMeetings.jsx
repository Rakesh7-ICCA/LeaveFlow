import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FiCalendar, FiMail } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router'
import CollegeInfoModal from './CompletionModal'
const UpcomingMeetings = () => {
    const [meetings, setMeetings] = useState([{}])
    const loc = useLocation().pathname
    const [infoModal, setInfoModal] = useState(false)
    const [meetingId1, setMeetingId1] = useState('');

    console.log(loc)
    //Compuser Consultany upcoming meetings
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`https://leaveflow.runasp.net/api/Consultancy/UpcomingMeetings?userId=${localStorage.getItem('id')}${loc === '/completed' ? '&completed=true' : '&completed=false'}`)
                if (res.status === 200) {
                    setMeetings(res.data)
                }
            }
            catch (err) {
                alert(err)
            }

        })()
    }, [])

    // Meetindg done
    function meetingDone(meetingId) {
        alert(meetingId1)
        const res = confirm('Are you sure you want to mark this meeting as done?')
        if (res) {
            (async () => {
                const res = await axios.post('https://leaveflow.runasp.net/api/Consultancy/' + meetingId + '/MeetingCompleted')
                if (res.status == 200) {
                    alert(res.data.message)
                    debugger;
                    setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting.meetingId !== meetingId1))
                }
                else {
                    alert(res.data.message)
                }
            })()
        }

    }


    // animation
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-teal-100/35 to-teal-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex text-gray-800 dark:text-gray-200">

            <div className="container mx-auto px-4 py-8 max-w-6xl overflow-x-auto flex flex-col grow">
                {/* Header */}
                <motion.header
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="mb-12 flex items-start justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 mb-2">
                            {loc[1].toUpperCase() + loc.slice(2, loc.length)} Meetings
                        </h1>
                        <p className="text-teal-600/80 dark:text-teal-400/80">
                            Performance overview and analytics
                        </p>

                    </div>


                </motion.header>
                <div className='overflow-x-auto grow'>

                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 ">
                        <thead className="bg-teal-100 dark:bg-teal-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    College
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Meeting Reason
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                meetings.map((meeting, index) => (

                                    <tr key={index} id={meeting.meetingId} className="hover:bg-teal-50 dark:hover:bg-teal-700 py-4">

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {meeting.name}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {meeting.collegeName}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <FiMail className="mr-2 text-teal-600 dark:text-teal-400" />
                                                {meeting.email}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <FiCalendar className="mr-2 text-teal-600 dark:text-teal-400" />
                                                {meeting.scheduled}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {meeting.reason}
                                        </td>

                                        <td className='text-center'>

                                            {
                                                meeting.completed == 'True' ?
                                                    <p className='bg-green-500 hover:bg-green-600 px-4 py-1 mr-1 rounded-lg text-white text-sm font-medium'>Completed</p>
                                                    : <div>
                                                        <button className='bg-blue-500 hover:bg-blue-600 px-4 py-1 mr-1 rounded-lg text-white text-sm font-medium' onClick={() => { setMeetingId1(meeting.meetingId); setInfoModal(true); }}>Done</button>
                                                        <button className='bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg text-white text-sm font-medium'>Cancel</button>
                                                    </div>
                                            }
                                        </td>
                                        <td>

                                            {
                                            infoModal && <CollegeInfoModal closeThis={setInfoModal} afterClosing={meetingDone} id={meetingId1} />}
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>


                </div>
            </div>
        </div>
    )
}

export default UpcomingMeetings;