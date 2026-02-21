import React from 'react'
import Nav from './components/Nav'

export default function Home() {
  const popularBikes = [
    {
      name: 'Yamaha MT-15',
      type: 'Street Bike',
      price: '₹1,68,000',
      image:
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Royal Enfield Classic 350',
      type: 'Cruiser',
      price: '₹1,93,000',
      image:
        'https://images.unsplash.com/photo-1580310614729-ccd69652491d?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'KTM Duke 200',
      type: 'Sports Naked',
      price: '₹1,97,000',
      image:
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80',
    },
  ]

  return (
    <div className='bg-orange-200 min-h-screen text-gray-800'>
      <Nav />

      <section
        id='home'
        className='pt-28 md:pt-32 px-4 sm:px-8 lg:px-16 min-h-[90vh] flex items-center'
      >
        <div className='max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
          <div>
            <p className='text-red-900 font-semibold tracking-wide mb-3'>Premium Bike Showroom</p>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5'>
              Find Your Next Ride With Confidence
            </h1>
            <p className='text-base sm:text-lg text-gray-700 mb-8'>
              Discover top brands, compare popular models, and book a test ride from one trusted
              showroom.
            </p>
            <div className='flex flex-wrap gap-4'>
              <a
                href='#collection'
                className='px-6 py-3 bg-red-950 text-white rounded-full text-base font-semibold hover:bg-red-800 transition duration-300'
              >
                Explore Bikes
              </a>
              <a
                href='#about'
                className='px-6 py-3 border-2 border-red-950 text-red-950 rounded-full text-base font-semibold hover:bg-red-950 hover:text-white transition duration-300'
              >
                About Showroom
              </a>
            </div>
          </div>

          <div className='rounded-3xl overflow-hidden shadow-xl'>
            <img
              src='https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1400&q=80'
              alt='Sports bike in showroom'
              className='w-full h-[300px] sm:h-[420px] object-cover'
            />
          </div>
        </div>
      </section>

      <section id='collection' className='px-4 sm:px-8 lg:px-16 py-16 bg-orange-200/60'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-3'>Popular Bikes</h2>
          <p className='text-gray-700 mb-10'>Top picks our customers are booking this season.</p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
            {popularBikes.map((bike) => (
              <article
                key={bike.name}
                className='bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'
              >
                <img src={bike.image} alt={bike.name} className='w-full h-52 object-cover' />
                <div className='p-5'>
                  <h3 className='text-xl font-bold mb-2'>{bike.name}</h3>
                  <p className='text-gray-600 text-sm mb-3'>{bike.type}</p>
                  <div className='flex items-center justify-between'>
                    <span className='text-red-900 font-bold text-lg'>{bike.price}</span>
                    <button className='px-4 py-2 bg-red-950 text-white rounded-lg hover:bg-red-800 transition duration-300'>
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id='about' className='px-4 sm:px-8 lg:px-16 py-16'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
          <div className='rounded-3xl overflow-hidden shadow-xl'>
            <img
              src='https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?auto=format&fit=crop&w=1200&q=80'
              alt='Bike showroom interior'
              className='w-full h-[280px] sm:h-[360px] object-cover'
            />
          </div>

          <div>
            <h2 className='text-3xl sm:text-4xl font-bold mb-4'>About Our Showroom</h2>
            <p className='text-gray-700 mb-4'>
              We are a trusted multi-brand bike showroom helping riders choose the right bike for
              city travel, touring, and performance riding.
            </p>
            <p className='text-gray-700 mb-6'>
              From expert guidance to transparent pricing and easy finance support, our team makes
              your bike-buying journey smooth from first visit to delivery.
            </p>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-white p-4 rounded-xl shadow text-center'>
                <p className='text-2xl font-bold text-red-900'>10+</p>
                <p className='text-sm text-gray-600'>Top Brands</p>
              </div>
              <div className='bg-white p-4 rounded-xl shadow text-center'>
                <p className='text-2xl font-bold text-red-900'>5000+</p>
                <p className='text-sm text-gray-600'>Happy Riders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id='contact' className='bg-red-950 text-white px-4 sm:px-8 lg:px-16 py-10'>
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
      </footer>
    </div>
  )
}
