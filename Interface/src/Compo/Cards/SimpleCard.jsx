import axios from 'axios'
import React from 'react'
import { AiFillBank, AiFillCheckCircle, AiFillGift, AiFillMobile } from 'react-icons/ai'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { Link } from 'react-router'

const SimpleCard = ({ collegeName = "", name = "", email = "", sent, idObj }) => {


    function SendBrouchure()
    {
        (async()=>{
            const res = await axios.post('https://leaveflow.runasp.net/api/request/sendBrochure', {
                "name": name, 
                "email": email,
                "requestId": idObj
            })
            if(res.status == 200)
            {
                sent = true
                alert("Brouchure Sent")
            }
            else
            {
                alert("Error in sending Brouchure")
            }
        })()
    }

    return (
        <div id={idObj} class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <AiFillBank className='text-3xl' />

            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{collegeName}</h5>

            <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">Name : {name}</p>
            <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">Email : {email}</p>

            {sent==false ?
                <p onClick={SendBrouchure} class=" cursor-pointer inline-flex font-medium items-center text-blue-600 hover:underline">
                    Send Brouchere <AiFillMobile className='mx-3' />
                </p> :
                <p class="inline-flex font-medium items-center text-teal-600 hover:underline">
                    Brouchere Sent <AiFillCheckCircle className='mx-3' />
                </p>
            }
        </div>
    )
}

export default SimpleCard