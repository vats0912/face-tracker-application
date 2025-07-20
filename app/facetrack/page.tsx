'use client'
import React from 'react'
import dynamic from 'next/dynamic';
const Camera = dynamic(() => import('../../components/Camera'), { ssr: false });


function page() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'>
        <Camera/>
    </div>
  )
}

export default page
