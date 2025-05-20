import React from 'react'

const Loading = () => {
  return (
    <div className='h-full w-full flex items-center justify-center'>
        <div className='h-[100px] w-[100px]  border-4 border-teal-500 border-t-teal-800 rounded-full animate-spin flex items-center justify-center '>
            Loading
        </div>
    </div>
  )
}

export default Loading