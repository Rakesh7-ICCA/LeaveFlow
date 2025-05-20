import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import DashboardNav from '../Utilities/DashboardNav'
import Entry from '../CompUser/Entry'

const Dashboard = ({ children }) => {
    const nav = useNavigate();
    let user = (localStorage.getItem('role'))

    useEffect(() => {
        if (!user) {
            nav('/landing')
        }
    }, [])

    return <div className='h-screen flex lg:flex-row flex-col-reverse'>
        <DashboardNav />
        <div className='flex-1 overflow-y-auto overflow-x-hidden px-3'>
            <Outlet />
        </div>
        <h1 className='font-bold text-4xl text-center shadow-md py-3 sticky top-0 left-0 w-full lg:hidden'>LeaveFlow</h1>
    </div>;


}

export default Dashboard