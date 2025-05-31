import { useEffect, useState } from 'react';
import profile from '../../assets/DefaultProfile.png';
import { FiCalendar, FiTrendingUp, FiClock, FiCheckCircle } from "react-icons/fi";
import axios from 'axios';
import { BiLogInCircle, BiLogOut } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Outlet, useNavigate } from 'react-router';

const Entry = ({children}) => {

  const userD = {
    name: "Karthik",
    employeeId: "EMP123456",
    mail: "afdd@gmail.com",
    profilePic: profile,
    stats: {
      totalMeetings: 124,
      completed: 89,
      upcoming: 35,
    },

    recentActivities: [
      { client: "Acme Corp", time: "10:30 AM", status: "completed" },
      { client: "Globex Inc", time: "1:45 PM", status: "upcoming" },
      { client: "Initech", time: "Tomorrow", status: "scheduled" }
    ]
  };

  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(userD);
  const [updatePasswordVisibility, setUpdatePasswordVisibility] = useState(false)
  const nav = useNavigate()

  const onClose = () => {
    setIsOpen(false);
    setpasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('')
  }


  const id = localStorage.getItem("id")


  //Change password
  const [passwordData, setpasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setpasswordData(prev => ({ ...prev, [name]: value }));
  };


  //Password change submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setUpdatePasswordVisibility(true);
    (async () => {
      const res = await axios.post(`https://leaveflow.runasp.net/api/Consultancy/SetNewPassword/${localStorage.getItem('id')}?opswd=${passwordData.currentPassword}&npswd=${passwordData.confirmPassword}`)
      alert(res.data.message)
    })()
    setpasswordData(false)

  };


  useEffect(() => {
    (async () => {
      console.log("id", id)
      const res = await axios.get("https://leaveflow.runasp.net/api/Consultancy/IntialLoad?userId=" + id)
      setUserData(prevUserData => ({
        ...prevUserData, // Keep the existing stats and recentActivities
        name: res.data.result.name,
        mail: res.data.result.email,
        employeeId: res.data.result.employeeId,
        profilePic: res.data.result.profileImage,
        stats: res.data.result.stats,
      }))
      console.log(res.data.result)
    })()
  }, []);


  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-teal-100/35 to-teal-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200">
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-12 flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 mb-2">
              Consultation Dashboard
            </h1>
            <p className="text-teal-600/80 dark:text-teal-400/80">
              Performance overview and analytics
            </p>

          </div>

          <div className='flex items-center border-2 px-4 cursor-pointer border-teal-500 rounded-full hover:bg-teal-500 hover:text-teal-50 text-teal-500'
            onClick={() => { localStorage.clear(); nav('/login') }}
          >
            <BiLogOut size={33} className=' hover:text-current' />
            <p className='hidden md:block text-xl font-medium'>Logout</p>
          </div>
        </motion.header>

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

              {/* Modal */}
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
                    Change Password
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

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        name="currentPassword"
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={passwordData.currentPassword}
                        onChange={handleChange}
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
                        name="newPassword"
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={passwordData.newPassword}
                        onChange={handleChange}
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
                        name="confirmPassword"
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={passwordData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </motion.div>

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
                        disabled={updatePasswordVisibility}
                      // Need to handle the update visibility
                      >
                        Update Password
                      </button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 my-6 w-full border border-gray-100 dark:border-gray-700"
        >
          <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-4">
            Hi, {userData.name}
          </h1>

          <div className="space-y-3 flex justify-between items-center py-5">

            <div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <p className="text-gray-700 dark:text-gray-300">{userData.employeeId}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <p className="text-gray-700 dark:text-gray-300">{userData.mail}</p>
              </div>

            </div>


            <img class="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src={userData.profilePic} alt="Bordered avatar" />

          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors"
              onClick={() => { setIsOpen(true) }}
            >
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
        >
          {[
            {
              title: "Total Meetings",
              value: userData.stats.totalMeetings,
              icon: <FiCalendar className="text-teal-600 dark:text-teal-400" size={20} />,
              bg: "bg-teal-100/70 dark:bg-teal-900/30",
              link: 'completed'
              
            },
            {
              title: "Completed",
              value: userData.stats.completedMeetings,
              icon: <FiCheckCircle className="text-teal-600 dark:text-teal-400" size={20} />,
              bg: "bg-teal-100/50 dark:bg-teal-900/20",
              link: 'completed'
            },
            {
              title: "Upcoming",
              value: userData.stats.incompletedMeetings,
              icon: <FiClock className="text-teal-600 dark:text-teal-400" size={20} />,
              bg: "bg-teal-100/30 dark:bg-teal-900/10",
              link: "upcoming"
            }
          ].map((stat, index) => (
            <Link to={stat.link}>
              <motion.div
                key={index}
                variants={slideUp}
                whileHover={{ y: -3 }}
                className={`${stat.bg} rounded-xl p-5 shadow-sm backdrop-blur-sm border border-teal-200/30 dark:border-teal-800/30`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-teal-800/70 dark:text-teal-300/70 mb-1">{stat.title}</p>
                    <p className="text-2xl font-semibold text-teal-900 dark:text-teal-200">{stat.value}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-teal-200/20 dark:bg-teal-800/20">
                    {stat.icon}
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
          ))}
        </motion.div>
\

      </div>
      
    </div>
  );

};

export default Entry;