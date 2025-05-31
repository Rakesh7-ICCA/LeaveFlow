import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import axios from 'axios';

const LeaveRequestForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onFormSubmit = (data) => {
    data.fromUserId = localStorage.getItem('id');
    (async () => {
      try{
        const res = await axios.post(`https://leaveflow.runasp.net/api/leaveRequests/AskRequest/${localStorage.getItem('role') == 'ORGHEAD'?true:false}`, data)
        alert(res.data.message);
        nav("/")
      }
      catch(err){
        console.log(err);
        alert('Error submitting request. Please try again later.');
      }

    })()
    console.log(data);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-light text-gray-800 mb-2"
          >
            Request Leave
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500"
          >
            Fill in your leave details
          </motion.p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              LEAVE TYPE
            </label>
            <select
              {...register('leaveType', { required: 'Leave type is required' })}
              className="w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-teal-500 focus:ring-0 bg-transparent text-gray-700"
            >
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="annual">Annual Leave</option>
              <option value="emergency">Emergency Leave</option>
            </select>
            {errors.leaveType && <p className="text-red-500 text-sm">{errors.leaveType.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                START DATE
              </label>
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                className="w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-teal-500 focus:ring-0 bg-transparent text-gray-700"
              />
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                END DATE
              </label>
              <input
                type="date"
                {...register('endDate', { required: 'End date is required' })}
                className="w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-teal-500 focus:ring-0 bg-transparent text-gray-700"
              />
              {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              REASON
            </label>
            <textarea
              {...register('reason', { required: 'Reason is required' })}
              rows="3"
              className="w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-teal-500 focus:ring-0 bg-transparent text-gray-700"
            />
            {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              CONTACT INFO
            </label>
            <input
              type="text"
              {...register('contact', { required: 'Contact info is required' })}
              placeholder="Phone or email"
              className="w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-teal-500 focus:ring-0 bg-transparent text-gray-700"
            />
            {errors.contactInfo && <p className="text-red-500 text-sm">{errors.contactInfo.message}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Submit Request
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LeaveRequestForm;