import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BiXCircle } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const CollegeInfoModal = ({ closeThis, afterClosing, id }) => {

    let [tempId, setTempid] = useState('') //This id for insert the paid recipt to identify the user
    const onClose = () => {
        closeThis(false);
    }

    console.log(id)

    const [Image, setImage] = useState("");
    const [phase, setPhase] = useState(1); // Single source of truth for phase
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [plans, setPlans] = useState([]); //  fetch plans from an API


    // plan fetching function
    useEffect(() => {
        (() => {
            (async () => {
                try {
                    const res = await axios.get('https://leaveflow.runasp.net/api/Consultancy/GetPlans')
                    if (res.status === 200) {
                        setPlans(res.data)
                    }
                } catch (err) {
                    alert(err)
                }
            })()
        })()
    }, [])


    const handleNext = () => {
        setPhase(prev => {
            if (prev >= 3) return 1; // Reset to 1 if needed
            return prev + 1;
        });
    };

    const handlePrev = () => {
        setPhase(prev => {
            if (prev <= 1) return 3; // Go to last phase if needed
            return prev - 1;
        });
    };


    const InstitutionData = (data) => {
        data.handeled = localStorage.getItem('id');
        (async () => {

            const email = await axios.get

            try {
                const res = await axios.post('https://leaveflow.runasp.net/api/Consultancy/InsertInstitution', data)
                if (res.status === 200) {
                    alert(res.data.message )
                    setTempid(res.data.id)
                    handleNext()

                }
            } catch (err) {
                console.log(err)
                alert(err.response.data.message)
                handlePrev()
            }
        })()

    }

    const SendRecipt = () => {
        const formData = new FormData()
        formData.append('img', Image)
        formData.append('Name', tempId)
        alert(tempId)


        axios.post(`http://localhost:5134/api/Consultancy/PaidReceipt?id=${tempId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            alert(res.data.message)
            closeThis()
            alert("id is "+id)
            afterClosing(id)
        })


    }


    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
                <motion.div
                    key={`phase-${phase}`}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-teal-600 dark:bg-teal-800 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            {phase === 1 && 'Organization Information'}
                            {phase === 2 && 'Plan Selection'}
                            {phase === 3 && 'Send Reciept'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-teal-200 transition-colors"
                        >
                            <BiXCircle size={34} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(phase == 2 ? InstitutionData : SendRecipt)}>
                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-1"
                            >
                                {phase === 1 && (
                                    <>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Name</h3>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            {...register("orgName")}
                                            required
                                        />
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Owner</h3>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            {...register("orgOwner")}
                                            required
                                        />
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Email</h3>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            {...register("mailId")}
                                            required
                                        />
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Head</h3>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            {...register("orgHead")}
                                            required
                                        />
                                        {/* Other phase 1 fields */}
                                    </>
                                )}

                                {phase === 2 && (
                                    <>

                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription Plan</h3>
                                        <select
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            {...register("planId")}
                                            required
                                        >
                                            <option value="" disabled>Select a plan</option>
                                            {plans.map((plan, index) => (
                                                <option key={index} value={plan.planId}>&#8377; {plan.amount} - {plan.planName}</option>
                                            ))}
                                        </select>

                                    </>


                                )}

                                {phase === 3 && (
                                    <>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid Reciept</h3>
                                        <input type='file'
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            onChange={(e) => { setImage(e.target.files[0]) }}
                                        />

                                    </>
                                )}

                            </motion.div>

                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-between">
                            {phase > 1 && (
                                <button
                                    onClick={handlePrev}
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Previous
                                </button>
                            )}

                            <button
                                type={phase === 2 ? "submit" : "button"}
                                onClick={phase === 3 ? SendRecipt : phase == 1 ? handleNext : console.log('aa')}
                                className={`px-4 py-2 ${phase === 3
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-teal-600 hover:bg-teal-700'
                                    } text-white rounded-lg transition-colors ml-auto`}
                            >
                                {phase === 3 ? 'Submit' : 'Next'}
                            </button>
                        </div>

                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CollegeInfoModal;