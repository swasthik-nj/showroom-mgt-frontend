import React, { useState } from 'react'

export default function Nav() {
      const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
     <>
      <nav className='bg-red-950 h-16 fixed top-0 left-0 right-0 font-bold text-white rounded-tl-0 rounded-bl-4xl rounded-br-4xl flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-20 md:h-20 lg:h-20 z-40'>
        <div className='text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold'>
          <h1>Bike
            <span className='text-yellow-400 text-2xl'>Showroom</span>
          </h1>
        </div>

        
        <button 
          onClick={toggleMenu}
          className='lg:hidden flex flex-col cursor-pointer z-50'
          aria-label='Toggle menu'
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white my-1 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

       
        <div className='hidden lg:flex items-center gap-0'>
          <div className='flex flex-row'>
            <a href='#' className='px-4 py-3  lg:mx-4 lg:py-0 hover:text-yellow-400 lg:text-lg transition duration-300'>
              Home
            </a>
            <a href='#' className='px-4 py-3 lg:mx-4 lg:py-0 hover:text-yellow-400 lg:text-lg transition duration-300'>
              Collection
            </a>
            <a href='#' className='px-4 py-3 lg:mx-4 lg:py-0 hover:text-yellow-400 lg:text-lg transition duration-300'>
              Book
            </a>
            <a href='#' className='px-4 py-3 lg:mx-4 lg:py-0 hover:text-yellow-400 lg:text-lg transition duration-300'>
              Contact
            </a>
          </div>
        </div>
      </nav>

      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800/95 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full text-white'>
          
          <div className='flex justify-end p-4'>
            <button
              onClick={() => setIsOpen(false)}
              className='text-white hover:text-yellow-400 focus:outline-none'
              aria-label='Close menu'
            >
              <svg
                className='h-6 w-6'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          
          <div className='flex flex-col space-y-1 px-4 py-2'>
            <a
              href='#'
              className='text-white hover:text-yellow-400 hover:bg-gray-700 px-4 py-3 rounded-md text-base font-medium transition duration-300'
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a
              href='#'
              className='text-white hover:text-yellow-400 hover:bg-gray-700 px-4 py-3 rounded-md text-base font-medium transition duration-300'
              onClick={() => setIsOpen(false)}
            >
              Collection
            </a>
            <a
              href='#'
              className='text-white hover:text-yellow-400 hover:bg-gray-700 px-4 py-3 rounded-md text-base font-medium transition duration-300'
              onClick={() => setIsOpen(false)}
            >
              Book
            </a>
            <a
              href='#'
              className='text-white hover:text-yellow-400 hover:bg-gray-700 px-4 py-3 rounded-md text-base font-medium transition duration-300'
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <div className='border-t border-gray-700 my-2'></div>
            
          </div>
        </div>
      </div>
    </>
  )
}
