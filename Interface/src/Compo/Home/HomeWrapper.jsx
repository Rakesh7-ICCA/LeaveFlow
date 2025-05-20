import React from 'react'
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router"
import Navigation from '../Utilities/Navigation';
const HomeWrapper = () => {
    return (
        <section className="relative bg-gray-100 min-h-screen flex flex-col justify-center overflow-x-hidden items-center px-0  text-center">
            {/* Floating Background Elements */}
            <div className="absolute top-10 -z-10 left-5 w-32 h-32 bg-white rounded-full shadow-lg opacity-50"></div>
            <div className="absolute top-10 -z-10 right-20 w-24 h-24 bg-white rounded-full shadow-lg opacity-50"></div>

            {/* Navbar */}
            <Navigation />

            {/* Main Content */}

            <div className='flex-1 w-full relative flex justify-center items-end text-center'>

                <p className='text-[7vw] px-4  bottom-10 left-9 w-[75%] mb-3 text-left font-semibold text-gray-900 leading-[1.2] tracking-wide'>
                    Never miss a
                    <span className='text-lg mx-40 absolute translate-y-[1.75rem] font-light w-[20%] text-justify inline-block tracking-normal'> Welcome to Leave Flow, your go-to solution for managing employee leave requests efficiently and effectively. Our platform is designed to streamline the leave management process, ensuring that both employees and managers have a seamless experience.</span>
                    <br />
                    <span className='w-[20%] rounded-full   bg-gray-200  items-center  inline-flex px-4 py-1 '>
                        <span className='rounded-full bg-blue-500 text-white text-3xl  p-7 '>
                            <FaPlay />
                        </span>
                    </span>
                    a leave <br />request again!
                </p>


            </div>
        </section >
    );
}
export default HomeWrapper