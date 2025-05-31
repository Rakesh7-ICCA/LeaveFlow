import React, { useEffect, useState } from 'react'
import StatCard from '../OrgHead/StatCard'
import { FiCheck, FiClock, FiUser, FiX } from 'react-icons/fi'
import { div } from 'framer-motion/client'
import LeavesCard from '../OrgHead/LeavesCard'
import axios from 'axios'

const LeaveRequest = () => {

  const [Leaves, setLeaves] = useState([])
  const [pending, setPending] = useState(false)
  const [pendingLeaves, setPendingLeaves] = useState([])
  const [approvedLeaves, setApprovedLeaves] = useState([])
  const [RejectedLeaves, setRejectedLeaves] = useState([])
  const [ApproveAndPending, setApproveAndPending] = useState({})


  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('https://leaveflow.runasp.net/api/LeaveRequests/GetRequestedLeaves?toHigherId=' + localStorage.getItem('id'))
        if (res.status == 200) {
          if (res.data.leaves) {
            setLeaves(res.data.leaves)
            setApproveAndPending(
              {
                pending: res.data.leaves.filter(e => e.granted == null).length,
                approved: res.data.leaves.filter(e => e.granted == true).length,
                rejected: res.data.leaves.filter(e => e.granted == false).length,
                total: res.data.leaves.length
              }

            )
            setPendingLeaves(res.data.leaves.filter(e => e.granted == null))
            setApprovedLeaves(res.data.leaves.filter(e => e.granted == true))
            console.log(pendingLeaves)
          }
        }
      }
      catch (err) {
        alert(err)
      }
    })()
  }, [])

  return (

    <div className="h-screen flex flex-col p-10">
      <div className='mb-10'>
        <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 mb-2">
          Leave Requests
        </h1>
        <p className="text-teal-600/80 dark:text-teal-400/80">
          Based on the reason Accept or Reject Leave
        </p>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          icon={<FiClock className="text-teal-600" size={20} />}
          title="Pending Approvals"
          oncl={() => setPending(false)}
          value={ApproveAndPending.pending}
          className={`bg-teal-100/30 ${!pending && "border-4 border-teal-800"} dark:bg-teal-900/10 rounded-xl p-5 shadow-sm backdrop-blur-sm border border-teal-200/30 dark:border-teal-800/30`}
        />
        <StatCard
          icon={<FiCheck className="text-green-500" size={20} />}
          title="Approved Leaves"
          value={ApproveAndPending.approved}
          oncl={() => setPending(true)}
          trend="down"
          className={`bg-teal-100/30 ${pending && "border-4 border-teal-800"} dark:bg-teal-900/10 rounded-xl p-5 shadow-sm backdrop-blur-sm border border-teal-200/30 dark:border-teal-800/30`}
        />
        {/* <StatCard
          icon={<FiX className="text-red-500" size={20} />}
          title="Rejected Leaves"
          value={ApproveAndPending.approved}
          oncl={() => setPending(true)}
          trend="down"
          className={`bg-teal-100/30 ${pending && "border-4 border-teal-800"} dark:bg-teal-900/10 rounded-xl p-5 shadow-sm backdrop-blur-sm border border-teal-200/30 dark:border-teal-800/30`}
        /> */}

      </div>

      <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 mb-5">
        Leaves {!pending ? "Requests" : "Approved"}
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {
          !pending ? (
            pendingLeaves.length > 0 ? (
              pendingLeaves.map((leave, index) => (
                <LeavesCard key={leave.id || index} ind={index} request={leave} leavesSetFunc={setPendingLeaves} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No pending leave requests found
              </div>
            )
          ) : (
            approvedLeaves.length > 0 ? (
              approvedLeaves.map((leave, index) => (
                <LeavesCard key={index} ind={index} request={leave} leavesSetFunc={setApprovedLeaves} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No approved leave requests found
              </div>
            )
          )
        }
        {/* <LeavesCard /> */}
      </div>
    </div>
  )
}

export default LeaveRequest