import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillCalendar, AiFillClockCircle } from 'react-icons/ai';
import { Link, useParams } from 'react-router';
import axios from 'axios';

const ScheduleMeeting = () => {

    const[requester, SetRequester] = useState([])
    const[allow, setAllow] = useState(false)
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 3); // 3 months from now    

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const { requestId } = useParams();

    useEffect(() => {
        (async () => {
            try{
                const res = await axios.get(`https://leaveflow.runasp.net/api/request/${requestId}`);
                if (res.status == 200) {
                    SetRequester(res.data);
                    console.log(res.data);
                    setAllow(true);
                }
            }
            catch
            {
                setAllow(false);
            }
        })()
    },[])

    const onSubmit = (data) => {
        data.RequestId = requestId;
        let r = `${data.ScheduledTime}:00`;
        data.ScheduledTime = r;
       
        (async()=>{
            const res = await axios.post(`https://leaveflow.runasp.net/api/request/fixmeeting`, data)
            alert(res.data.message)
        })()
        // Add your form submission logic here
    };

    if(!allow)
    {
        return(
            <p className='text-5xl '>You are not supposed to Enter here, Go back to <Link to={"/"}>Homepage</Link></p>
        )
    }
    else 
        return (
         <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 text-center">
                Schedule a Meeting
            </h2>
            <p className='text-center mb-3'>Hey <span className='font-semibold'>{requester.name}</span>, Choose a time that works for you.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Date Field */}
                <div>
                    <label htmlFor="date" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Date
                    </label>
                    <div className="relative">
                        <input
                            id="date"
                            type="date"
                            {...register('ScheduledDate', { required: 'Date is required' })}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 dark:text-white"
                            min={new Date().toISOString().split('T')[0]} // Disable past dates
                            max={endDate.toISOString().split('T')[0]} // Disable dates beyond 3 months
                        />
                        <AiFillCalendar className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                    </div>
                    {errors.date && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                            {errors.date.message}
                        </p>
                    )}
                </div>

                {/* Time Field */}
                <div>
                    <label htmlFor="time" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Time
                    </label>
                    <div className="relative">
                        <input
                            id="time"
                            type="time"

                            {...register('ScheduledTime', { required: 'Time is required' })}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 dark:text-white"
                            min="09:00"
                            max="17:00"
                        />
                        <AiFillClockCircle className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                    </div>
                    {errors.time && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                            {errors.time.message}
                        </p>
                    )}
                </div>

                {/* Meeting Type */}
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Type
                    </label>
                    <div className="space-y-2">
                        {['Consultation', 'Project Discussion', 'Support', 'Other'].map((type) => (
                            <div key={type} className="flex items-center">
                                <input
                                    id={type.toLowerCase()}
                                    type="radio"
                                    value={type}
                                    {...register('MeetingReason', { required: 'Please select a meeting type' })}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600"
                                />
                                <label htmlFor={type.toLowerCase()} className="ml-3 block text-gray-700 dark:text-gray-300">
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.meetingType && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                            {errors.meetingType.message}
                        </p>
                    )}
                </div>


                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    Schedule Meeting
                </button>
            </form>
        </div>
    );
};

export default ScheduleMeeting;