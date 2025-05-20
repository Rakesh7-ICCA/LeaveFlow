import React, { useEffect, useState } from 'react'
import { AiFillGift, AiOutlineBank, AiOutlineSearch } from 'react-icons/ai'
import { FaExternalLinkAlt } from 'react-icons/fa'
import SimpleCard from '../Cards/SimpleCard'
import axios from 'axios'
import Loading from '../Utilities/Loading'

const ServiceRequests = () => {

    const [Requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [Err, setErr] = useState(false)

    useEffect(() => {

        (async () => {
            try {
                const res = await axios.get('https://leaveflow.runasp.net/api/request/getAllRequests')
                if (res.status == 200) {
                    if (res.data.data.length == 0) {
                        setErr(true)
                    }
                    else
                    {
                        setRequests(res.data.data)
                        console.log(res.data.data)
                        setErr(false)
                    }
                    setLoading(false)
                }
                console.log(Err)
            }
            catch (err) {
                alert(err.response.data.message)
            }
        })();
    }, [])

    return (
        <div className='flex flex-col '>
            <p className='text-2xl'>Service Requests</p>
            <form class="flex items-center w-full my-4 mx-auto ">
                <label for="simple-search" class="sr-only">Search</label>
                <div class="relative w-full">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <AiOutlineBank className='text-gray-500 text-2xl' />
                    </div>
                    <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full ps-10 p-2.5 text-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                        placeholder="Search College name..." required />

                </div>
                <button type="submit" class="p-2.5 ms-2 text-sm font-medium text-white bg-teal-700 rounded-lg border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">
                    <AiOutlineSearch className='text-xl' />
                </button>
            </form>

            {/* card */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                {
                    ((Err == true) && <h1 className='text-3xl'>No Requests are not at moment</h1>)
                    
                }
                {loading ?
                    <Loading /> :
                    Requests.map((item, index) => (
                        <SimpleCard key={item.reqId} idObj={item.reqId} collegeName={item.req_College} name={item.req_name} email={item.req_email} sent={item.brouchureSent} />
                    ))

                }

            </div>
        </div>
    )
}

export default ServiceRequests