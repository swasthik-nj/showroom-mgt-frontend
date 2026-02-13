import React from 'react'
import Nav from './components/Nav'

export default function Home() {
  return (
    <div className='bg-orange-200 h-full'>
        <Nav/>
        <div className='flex flex-col items-center justify-center h-screen pt-16'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 text-center'>
            Welcome to Bike Showroom
          </h1>
          <p className='text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 mb-8 text-center'>
            Explore our collection of bikes and book your ride today!
          </p>
          <button className='px-6 py-3 bg-red-950 text-white rounded-full text-lg hover:bg-red-700 transition duration-300'>
            Explore Now
          </button>
        </div>
    </div>
  )
}
