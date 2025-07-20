import React from 'react'
import Camera from '../../components/Camera'

function page() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'>
        <Camera/>
    </div>
  )
}

export default page