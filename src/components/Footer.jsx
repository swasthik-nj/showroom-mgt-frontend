import React from 'react'

export default function Footer() {
  return (
    <div>
       <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-2xl font-bold mb-3'>Bike Showroom</h3>
            <p className='text-sm text-gray-200'>
              Your one-stop destination for premium bikes, service support, and test rides.
            </p>
          </div>

          <div>
            <h4 className='font-semibold mb-3 text-yellow-400'>Quick Links</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='#home' className='hover:text-yellow-300'>
                  Home
                </a>
              </li>
              <li>
                <a href='#collection' className='hover:text-yellow-300'>
                  Popular Bikes
                </a>
              </li>
              <li>
                <a href='#about' className='hover:text-yellow-300'>
                  About Showroom
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-3 text-yellow-400'>Contact</h4>
            <p className='text-sm'>Main Road, City Center</p>
            <p className='text-sm'>+91 98765 43210</p>
            <p className='text-sm'>info@bikeshowroom.com</p>
          </div>
        </div>
        <div className='max-w-6xl mx-auto mt-8 pt-4 border-t border-red-800 text-sm text-gray-200 text-center'>
          © 2026 Bike Showroom. All rights reserved.
        </div>
    </div>
  )
}
