import React from 'react'

export default function ErrorMessage({children}: {children: React.ReactNode}) {
  return (
    <div className='text-red-600 font-bold text-center p-3 uppercase bg-red-100 text-sm mb-2'>
        {children}
    </div>
  )
}
