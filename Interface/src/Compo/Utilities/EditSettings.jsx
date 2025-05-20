import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const EditSettings = ({ onClose }) => {

    const [error, setError] = useState(null);
    const [passwordChange, setPasswordChange] = useState(false);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            username: localStorage.getItem('username')}
            
    });

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

    return (
        <>
            < AnimatePresence >
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
            </AnimatePresence >
        </>

    )
}

export default EditSettings