import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { FiCalendar, FiMail } from 'react-icons/fi'

const Meeting = () => {


    const [meetings, setMeetings] = useState([])
    const [Employees, setEmployees] = useState([])

    const colegue = useRef({})


    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get('https://leaveflow.runasp.net/api/Meeting/AvailMeetings')
                if (res.status === 200) {
                    setMeetings(res.data.data)
                }
            }
            catch (err) {
                alert(err)
            }

        })()
    }, [])

    useEffect(() => {

        // send request to get all Employees
        (async () => {
            const res = await axios.get('https://leaveflow.runasp.net/api/Employee/GetEmployeesWithUser')
            if (res.status == 200) {
                setEmployees(res.data)
            }
        })()
    }, [])


    

    // when admin assign a meeting this function will be called
    function assignMeeting(index, meetingId)
    {
        (async()=>{
            const res = await axios.post('https://leaveflow.runasp.net/api/Meeting/AssignMeeting?meetingId=' + meetingId + '&userId=' + colegue.current[index].value)
            if (res.status == 200) {
                alert(res.data.message)
            }
            else {
                alert(res.data.message)
            }

        })()
    }

    // Drop down value changed
    function handleChange(meetingId, value) {
        setMeetings(prevMeetings => 
            prevMeetings.map(meeting => 
              meeting.meetingId === meetingId 
                ? { ...meeting, handling: value }
                : meeting
            )
          );
        console.log(meetings)
    }

    return (

        <div>
            <p className='text-3xl my-3'>Meetings</p>

            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-teal-100 dark:bg-teal-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Name
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
                            Assign
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>

                    { 
                        meetings.map((meeting, index) => (

                            <tr key={index} className="hover:bg-teal-50 dark:hover:bg-teal-700 py-4">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {meeting.name}
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
                                        {meeting.scheduledDate + " " + meeting.scheduledTime}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {meeting.meetingReason}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    <select ref={(el)=>colegue.current[index] = el} value={meeting.handling} onChange={(e)=>{
                                        handleChange(meeting.meetingId, e.target.value)
                                    }}>
                                        <option value='' disabled >Select Colleague</option>
                                        {
                                            Employees.filter(emp => emp.roleName.toLowerCase() == meeting.meetingReason.toLowerCase()).map((employee, index) => (
                                                
                                                <option key={index} value={employee.userId}>{employee.name}</option>
                                            ))
                                        }
                                    </select>
                                </td>

                                <td  >
                                    <button className='bg-teal-600 m-auto hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'
                                        onClick={()=>{
                                            assignMeeting(index, meeting.meetingId)
                                        }}
                                    
                                    >
                                        Assign
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div>
    )
}

export default Meeting