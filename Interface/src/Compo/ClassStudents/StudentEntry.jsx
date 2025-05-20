import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiCalendar, FiList, FiSettings, FiMail, FiUser, FiPlus, FiLogOut } from 'react-icons/fi';
import EditSettings from '../Utilities/EditSettings';
import { Link, useNavigate } from 'react-router';
import { FiX } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';


const StudentEntry = () => {
    // Mock student data - replace with your API data

    const [student, setStudent] = useState({})
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);

    const [imageOpt, setImageOpt] = useState(false)
    const [changeImage, setChangeImage] = useState(false)
    const [image, setImage] = useState('')
    const nav = useNavigate();


    useEffect(() => {
        (async () => {
            const res = await axios.get('https://leaveflow.runasp.net/api/student/loaddashboard?userid=' + localStorage.getItem('id'));
            if (res.status === 200) {
                setStudent(res.data);
            }
            else {
                alert('Error fetching student data. Please try again later.');
            }
        })()
    }, [])

    // Navigation handlers - replace with your routing logic
    const handleRequestLeave = () => console.log("Navigate to leave request");
    const handleViewLeaves = () => console.log("Navigate to leave history");
    const handleEditSettings = () => {
        setIsOpen(true);
    };
    const onClose = () => {
        setIsOpen(false);
    };

    function RemoveImage() {
        (async () => {
            const res = await axios.get('https://leaveflow.runasp.net/api/student/RemoveStudentPic?id=' + localStorage.getItem('id'));
            if (res.status == 200) {
                alert(res.data.message)
                setUserData(prev => ({ ...prev, profilepic: '' }));
            }
            else {
                alert(res.data.message)
            }
        })()
    }

    function sendImageForApi(e) {
        e.preventDefault()
        const data = new FormData()
        data.append('img', image);
        // alert(TempUser) //need to remove
        data.append('Name', localStorage.getItem('username'));

        (async () => {
            const res = await axios.post('https://leaveflow.runasp.net/api/student/addStudentPic?id=' + localStorage.getItem('id'), data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status == 200) {
                alert(res.data.message)
                setUserData(prev => ({ ...prev, profilepic: 'https://leaveflow.runasp.net/Uploads/Images/' + localStorage.getItem('username') + '_profile.jpg' }));
                formWrapper.current.classList.toggle('hidden')

            }
            else {
                alert(res.data.message)
            }
        })()
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
            >
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Leave Management</h1>
                    <p className="text-gray-500">Request and track your leave applications</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        localStorage.clear();
                        nav("/login")
                    }}
                    className="mt-4 md:mt-0 px-4 py-2 bg-teal-600 text-white rounded-lg flex items-center"
                >
                    <FiLogOut className="mr-2" /> Logout
                </motion.button>
            </motion.div>


            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden"
            >


                {/* Header Section */}
                <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
                    <h1 className="text-2xl font-bold">{student.name}</h1>
                    <p className="text-teal-100">{student.organization}</p>
                    <p className="text-teal-100">Class {student.className} - Section {student.section}</p>
                </div>

                {/* Profile Content */}
                <div className="md:flex">
                    {/* Profile Card (Left) */}
                    <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200">
                        <div className="flex flex-col items-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className=" "
                            >
                                <div className="relative">
                                    <img
                                        onClick={() => setImageOpt(!imageOpt)}
                                        // onBlur={() => setImageOpt(false)}
                                        className="w-40 h-40 mx-auto lg:mx-0 p-1 object-cover rounded-full ring-2 ring-teal-300 dark:ring-teal-500 cursor-pointer"
                                        src={student.profilePic}
                                        alt="Bordered avatar"
                                        tabIndex="0" // allows blur to trigger
                                    />


                                    {imageOpt && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 space-y-2 z-10">
                                            <button
                                                onClick={() => { setChangeImage(true) }}
                                                className="w-full px-4 py-2 text-sm text-white bg-teal-500 hover:bg-teal-600 rounded">
                                                Change Image
                                            </button>
                                            <button onClick={RemoveImage}
                                                className="w-full px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded">
                                                Remove Image
                                            </button>
                                        </div>
                                    )}

                                    {/* upload Image */}

                                </div>
                            </motion.div>
                            {changeImage && <form className='absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-[#ffffff7d] backdrop-blur-sm z-10'>

                                <FiX
                                    onClick={() => { setChangeImage(false) }}
                                    className='absolute top-2 right-4 text-4xl bg-[#ff000065] border-2 cursor-pointer hover:bg-red-500 border-red-300' />

                                <div className='h-[30vh] w-full lg:w-[30%]'>
                                    <h1 className='text-center text-4xl mb-10'>Add a Profile</h1>
                                    <div id='ProfileImgWrapper' className='  flex items-center  justify-center'>
                                        {!image.length ? <CgProfile className='text-[120px]' /> : <img src={image} className='object-fit w-20 h-20' />}
                                    </div>

                                    <div className='flex gap-3 text-2xl'>

                                        <label
                                            htmlFor='imgSet'
                                            className="w-full mt-6 text-center bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition duration-200"
                                        >
                                            Choose Image
                                            <input type="file" id='imgSet' className='hidden' onChange={e => setImage(e.target.files[0])} />
                                        </label>
                                        <button
                                            type="submit" onClick={sendImageForApi}
                                            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition duration-200"
                                        >
                                            Submit
                                        </button>
                                    </div>

                                </div>
                            </form>}
                            <div className="space-y-2 text-center md:text-left w-full">
                                <div className="flex items-center text-gray-600">
                                    <FiMail className="mr-2 text-teal-600" />
                                    <span>{student.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FiMail className="mr-2 text-teal-600" />
                                    <span>{student.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FiUser className="mr-2 text-teal-600" />
                                    <span>{student.username}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">Student ID: {student.studentId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons (Right) */}
                    <div className="p-6 md:w-2/3">
                        <div className="h-full flex flex-col justify-center space-y-4">
                            <Link to={"ask"} className='w-full'>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleRequestLeave}
                                    className="flex items-center w-full justify-center px-6 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-colors"
                                >
                                    <FiCalendar className="mr-2" />
                                    Request a Leave
                                </motion.button>
                            </Link>

                            <Link to={"requestedleaves"} className='w-full'>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleViewLeaves}
                                    className="flex items-center w-full justify-center px-6 py-3 bg-white border-2 border-teal-600 text-teal-600 rounded-lg shadow-sm hover:bg-teal-50 transition-colors"
                                >
                                    <FiList className="mr-2" />
                                    Requested Leaves
                                </motion.button>
                            </Link>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleEditSettings}
                                className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <FiSettings className="mr-2" />
                                Edit Settings
                            </motion.button>
                            {/* modal */}
                            {isOpen && <EditSettings onClose={() => { setIsOpen(false) }} />}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentEntry;