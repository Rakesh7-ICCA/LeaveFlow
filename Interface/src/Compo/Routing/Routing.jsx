import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router'
import Login from '../Form/Login'
import FormWrapper from '../Form/FormWrapper'
import HomeWrapper from '../Home/HomeWrapper'
import ServicePage from '../Home/ServicePage'
import Dashboard from '../Pages/Dashboard'
import ServiceRequests from '../Pages/ServiceRequests'
import EmployeeManagement from '../Pages/EmployeeManagement'
import ScheduleMeeting from '../Utilities/ScheduleMeeting'
import Meeting from '../Pages/Meeting'
import UpcomingMeetings from '../CompUser/UpcomingMeetings'
import AuthWrapper from '../Security/AuthWrapper'
import Entry from '../CompUser/Entry'
import BaseCompUser from '../Utilities/BaseCompUser'
import Institutes from '../Pages/Institutes'
import Index from '../OrgHead/HeadEntry'
import HeadEntry from '../OrgHead/HeadEntry'
import LeaveRequest from '../OrgHead/LeaveRequest'
import Staff from '../OrgHead/Staff'
import TeacherEntry from '../Teacher/TeacherEntry'
// import LeaveRequestForm from '../Teacher/LeaveAskingPage'
import LeaveRequestForm from '../Utilities/LeaveAskingPage'
import BatchSection from '../OrgHead/BatchSection'
import LeaveRequested from '../Teacher/LeaveRequested'
import StudentEntry from '../ClassStudents/StudentEntry'
import StudentRequests from '../Teacher/StudentRequests'

const Routing = () => {

    const [role, setrole] = useState('')
    useEffect(() => {
        const role1 = localStorage.getItem('role')
        setrole(role1)
    }, [])
    return (
        <Routes>
            <Route path='/landing' element={<HomeWrapper />} />
            <Route path='/service' element={<ServicePage />} />
            <Route path='/register' element={<FormWrapper />} />
            <Route path='login' element={<Login aa={setrole} />} />
            <Route path=":requestId/meeting" element={<ScheduleMeeting />} />
            <Route path='*' element={<Login aa={setrole}/>} />

            <Route path="/" element={<AuthWrapper />} >

                {/* Company Side Routes */}
                {role === "ALL" &&

                    <Route path='/' element={<Dashboard />} >
                        <Route index element={<h1>Dashboard</h1>} />
                        <Route path='ServiceRequest' element={<ServiceRequests />} />
                        <Route path='members' element={<EmployeeManagement />} />
                        <Route path='meetings' element={<Meeting />} />
                        <Route path='institutes' element={<Institutes />} />
                    </Route>}

                {/* Company user Rooutes */}
                {role === "COMPUSER" &&
                    <Route path='/' element={<BaseCompUser />} >
                        <Route index element={<Entry />} />
                        <Route path='upcoming' element={<UpcomingMeetings />} />
                        <Route path='completed' element={<UpcomingMeetings />} />
                    </Route>
                }

                {role === "ORGHEAD" &&
                    <Route path='/' element={<BaseCompUser />} >
                        <Route index element={<HeadEntry />} />
                        <Route path='requests' element={<LeaveRequest />} />
                        <Route path='staff' element={<Staff />} />
                        <Route path='batchsection' element={<BatchSection />} />
                    </Route>
                }
                
                {role === "CLASS" &&
                    <Route path='/' element={<BaseCompUser />} >
                        <Route index element={<TeacherEntry />} />
                        <Route path="ask" element={<LeaveRequestForm />} />
                        <Route path="RequestedLeaves" element={<LeaveRequested />} />
                        <Route path="students" element={<StudentRequests />} />
                        <Route path='requests' element={<LeaveRequest />} />

                    </Route>
                }

                {
                    role === "USER" &&
                    <Route path='/' element={<BaseCompUser />} >
                        <Route index element={<StudentEntry />} />
                        <Route path="ask" element={<LeaveRequestForm />} />
                        <Route path='requests' element={<LeaveRequest />} />
                        <Route path="RequestedLeaves" element={<LeaveRequested />} />

                    </Route>
                }


            </Route>

        </Routes >
    )
}

export default Routing