import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ icon, title, value, className, oncl}) => {
    
    return(<motion.div
        whileHover={{ y: -5 }}
        onClick={oncl}
        className={`${className} p-6 rounded-xl border border-gray-100`}
    >
        <div className="flex justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className="p-3 rounded-lg bg-teal-50 text-teal-600">
                {icon}
            </div>
        </div>
    </motion.div>
)};



export default StatCard