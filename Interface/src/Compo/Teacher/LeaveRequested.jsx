import React, { useEffect, useState } from 'react'
import StatCard from './RequestedLeavesStatCard'
import { FiCheck, FiClock, FiUser } from 'react-icons/fi'
import { div } from 'framer-motion/client'
import axios from 'axios'

const LeaveRequested = () => {

  const [Leaves, setLeaves] = useState([])
  const [pending, setPending] = useState(false)

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await axios.get('https://leaveflow.runasp.net/api/LeaveRequests/GetRequestedLeavesOfTheUser?fromme='+localStorage.getItem('id'))
        if(res.status == 200){
          setLeaves(res.data.leaves)
        }
      }
      catch(err){
        alert(err)
      }
    })()
  }, [])

  return (

    <div className="h-screen flex flex-col p-10">
      <div className='mb-10'>
        <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 mb-2">
          My Requested Leaves
        </h1>
        <p className="text-teal-600/80 dark:text-teal-400/80">
          Track your leaves weathar they are approved or not
        </p>

      </div>
      

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {
        Leaves.map((leave, index) => (
          <StatCard key={index} request={leave} />
        ))
      }
       {/* <LeavesCard /> */}
      </div>
    </div>
  )
}

export default LeaveRequested