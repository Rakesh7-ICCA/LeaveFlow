import { useEffect, useState } from 'react';
import { FiCalendar, FiUser, FiCheck, FiX, FiClock, FiAlertTriangle, FiGitPullRequest } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
// import StatCard from './StatCard';
import profile from '../../assets/DefaultProfile.png';
import { Link, useLocation } from 'react-router';
import { BsPeople } from 'react-icons/bs';
import axios from 'axios';
import { set, useForm } from 'react-hook-form';
import { CgProfile } from 'react-icons/cg';
import { nav } from 'framer-motion/client';


const TeacherEntry = ({ }) => {

    const [userData, setUserData] = useState({});
    const [imageOpt, setImageOpt] = useState(false)
    const [changeImage, setChangeImage] = useState(false)

    const [image, setImage] = useState("")
    const [error, setError] = useState("");
    const [passwordChange, setPasswordChange] = useState(false);

    const nav = useLocation();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            username: localStorage.getItem('username'),
        }
    })

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get('https://leaveflow.runasp.net/api/Teacher/LoadClassDashboard?userId=' + localStorage.getItem('id'))
                setUserData(res.data)
            }
            catch (err) {
                alert(err)
            }
        })()
    }, [])





    const slideUp = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    // modal related
    const [isOpen, setIsOpen] = useState(false);
    function onClose() {
        reset()
        setIsOpen(false);
        setError("")
        setPasswordChange(false)
    }

    // 
    async function checkUsername(e) {
        (async () => {
            const res = await axios.get('https://leaveflow.runasp.net/api/organizations/usernameExist?username=' + e.target.value)
            if (res.data.message) {

                setError("Username already exists")
                e.target.style.border = "solid 2px red"
            }
            else {
                setError("")
                e.target.style.border = "solid 2px green"
            }
        })()
    }

    //when modal form is submitted
    const handleAction = (d) => {


        if (passwordChange) {
            if (d.newPassword !== d.confirmPassword) {
                setError("Passwords do not match")
                return
            }
            else {
                (async () => {
                    const res = await axios.get('https://leaveflow.runasp.net/api/organizations/' + localStorage.getItem('id') + `/UpdatePassword?odp=${d.currentPassword}&nwp=${d.newPassword}`)
                    if (res.status === 200) {
                        alert(res.data.message)
                        onclose()

                    }
                    else {
                        setError("")
                        e.target.style.border = "solid 2px green"
                    }
                })()
            }
        }

        if (d.username !== localStorage.getItem('username')) {
            (async () => {
                const res = await axios.get('https://leaveflow.runasp.net/api/organizations/' + localStorage.getItem('id') + '/updateuser?username=' + d.username)
                if (res.status === 200) {
                    alert("User updated successfully")
                    localStorage.setItem('username', d.username)
                    onClose()
                }
                else {
                    setError("")
                    e.target.style.border = "solid 2px green"
                }
            })()
        }

    };


    function sendImageForApi(e) {
        e.preventDefault()
        const data = new FormData()
        data.append('img', image);
        // alert(TempUser) //need to remove
        data.append('Name', localStorage.getItem('username'));

        (async () => {
            const res = await axios.post('https://leaveflow.runasp.net/api/Teacher/addTeacherPic?id=' + localStorage.getItem('id'), data, {
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

    function RemoveImage() {
        (async () => {
            const res = await axios.get('https://leaveflow.runasp.net/api/Teacher/RemoveTeacherPic?id=' + localStorage.getItem('id'));
            if (res.status == 200) {
                alert(res.data.message)
                setUserData(prev => ({ ...prev, profilepic: '' }));
            }
            else {
                alert(res.data.message)
            }
        })()
    }

    function handleLogout()
    {
        localStorage.clear()
        nav("/login")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

            {/* modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={onClose}
                        />
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6">
                                <motion.h2
                                    className="bg-teal-600 dark:bg-teal-800 px-2 mb-3 py-4 flex justify-between items-center text-xl font-bold text-white"
                                    initial={{ x: -10 }}
                                    animate={{ x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    Change User Settings
                                </motion.h2>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit(handleAction)} className="space-y-4" autoComplete='off'>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        onBlur={checkUsername}
                                    >
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            {...register('username')}
                                        />
                                    </motion.div>


                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Willing to change password? <input type='checkbox' className='ml-2' onChange={(e) => { setPasswordChange(e.target.checked) }} />
                                        </label>

                                    </motion.div>

                                    {passwordChange && <div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Current Password
                                            </label>
                                            <input
                                                {...register("currentPassword")}
                                                type="password"
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                required
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                New Password
                                            </label>
                                            <input
                                                {...register("newPassword")}
                                                type="password"
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                required
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Confirm New Password
                                            </label>
                                            <input
                                                {...register("confirmPassword")}
                                                type="password"
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                required
                                            />
                                        </motion.div>
                                    </div>}

                                    <motion.div
                                        className="flex justify-end gap-3 pt-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-md hover:shadow-teal-500/20"
                                        // Need to handle the update visibility
                                        >
                                            Update Settings
                                        </button>
                                    </motion.div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>




            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-8 flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
                    <p className="text-gray-600">Class Teacher Dashboard</p>
                </div>

                <button
                    onClick={handleLogout} // Add your logout logic here
                    className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
                >
                    Logout
                </button>
            </motion.div>


            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 my-6 w-full border border-gray-100 dark:border-gray-700"
            >
                <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-4">
                    Hi, {userData.name}
                </h1>

                <div className="space-y-3 flex justify-between items- py-5 flex-col-reverse lg:flex-row">

                    <div className='mt-10'>
                        <div className="flex items-center  gap-3 ">
                            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                            <p className="text-gray-700 dark:text-gray-300">{userData.username}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                            <p className="text-gray-700 dark:text-gray-300">{userData.orgEmail}</p>
                        </div>

                    </div>

                    <div className="relative">
                        <img
                            onClick={() => setImageOpt(!imageOpt)}
                            // onBlur={() => setImageOpt(false)}
                            className="w-40 h-40 mx-auto lg:mx-0 p-1 object-cover rounded-full ring-2 ring-teal-300 dark:ring-teal-500 cursor-pointer"
                            src={userData.profilePic}
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
                </div>

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


                <div className="mt-6 pt-4 border-t border-gray-100 flex text-center dark:border-gray-700">
                    <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors"
                        onClick={() => { setIsOpen(true) }}
                    >
                        Edit Profile
                    </button>
                    <Link to={'ask'} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors mx-3"

                    >
                        Request for a Leave
                    </Link>
                    <Link to={'requestedleaves'} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors "

                    >
                        My leaves
                    </Link>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Request Card */}
                <Link to={'/requests'}>
                    <motion.div
                        variants={slideUp}
                        whileHover={{ y: -3 }}
                        className={`bg-teal-100/30 dark:bg-teal-900/10 rounded-xl p-5 shadow-sm backdrop-blur-sm border border-teal-200/30 dark:border-teal-800/30`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-teal-800/70 dark:text-teal-300/70 mb-1">Leave Requests</p>
                                <p className="text-2xl font-semibold text-teal-900 dark:text-teal-200">{userData.leaveCount}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-teal-200/20 dark:bg-teal-800/20">
                                <FiGitPullRequest size={22} />
                            </div>
                        </div>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.3 }}
                            className="h-0.5 mt-3 bg-gradient-to-r from-teal-400/50 to-teal-600/80 rounded-full"
                        />
                    </motion.div>
                </Link>

                {/* Staff */}
                <Link to={'/students'}>
                    <motion.div
                        variants={slideUp}
                        whileHover={{ y: -3 }}
                        className={`bg-teal-100/30 dark:bg-teal-900/10 rounded-xl p-5 shadow-sm backdrop-blur-sm border border-teal-200/30 dark:border-teal-800/30`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-teal-800/70 dark:text-teal-300/70 mb-1">Student Portal</p>
                                <p className="text-2xl font-semibold text-teal-900 dark:text-teal-200">{userData.studentsCount}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-teal-200/20 dark:bg-teal-800/20">
                                <BsPeople size={22} />
                            </div>
                        </div>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.3 }}
                            className="h-0.5 mt-3 bg-gradient-to-r from-teal-400/50 to-teal-600/80 rounded-full"
                        />
                    </motion.div>
                </Link>
            </div>

        </div >
    );
};


export default TeacherEntry;