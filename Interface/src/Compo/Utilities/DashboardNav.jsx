import { useState, useEffect } from 'react';
import { AiFillBank, AiOutlineUsergroupAdd, AiOutlineMessage, AiOutlineHome, AiOutlineSetting, AiFillCalendar} from 'react-icons/ai';
import NavlinksLabel from './NavlinksLabel';

const DashboardNav = () => {

    const navItems = [
        { icon: AiOutlineHome, label: 'Home', to: 'home' },
        { icon: AiOutlineMessage  , label: 'Requests', to: 'serviceRequest' },
        { icon: AiFillBank , label: 'Institution portal', to: 'institutes' },
        { icon: AiOutlineUsergroupAdd, label: 'Members', to: 'members' },
        { icon: AiFillCalendar, label: 'Meetings', to: 'meetings' },
        { icon: AiOutlineSetting, label: 'Settings', to: '#' },
    ];

    return (
        <div className='bg-teal-500 font-bold text-2xl h-[7vh]  flex items-center lg:gap-10
                lg:flex-col lg:h-auto 
        '>
            <div className='hidden lg:block'>
                <span className='text-3xl'>LeaveFlow</span>
            </div>
            <div className='flex w-full lg:flex-col lg:space-y-3 justify-evenly '>
                {
                    navItems.map((item, index) => (
                        <NavlinksLabel key={index} Icon={item.icon} label={item.label} linkobj={item.to} />
                    ))
                }
            </div>
        </div>
    );
};

export default DashboardNav;