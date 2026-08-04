import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../utils/api-base-url'

const BOOKING_TRACKING_STAGES = [
  {
    value: 'confirmed',
    label: 'Booking Confirmed',
    description: 'Your booking has been accepted by the showroom.',
  },
  {
    value: 'reaching-showroom',
    label: 'Reaching Showroom',
    description: 'Your bike is reaching the showroom for handover.',
  },
  {
    value: 'delivered',
    label: 'Delivered',
    description: 'Your bike was delivered successfully.',
  },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function normalizeBookingStage(status) {
  if (['processing', 'in-transit', 'reaching-showroom'].includes(status)) {
    return 'reaching-showroom'
  }

  if (status === 'delivered') {
    return 'delivered'
  }

  return 'confirmed'
}

export default function TrackBooking() {
  const navigate = useNavigate()
  const { bookingId: routeBookingId = '' } = useParams()
  const [bookingIdInput, setBookingIdInput] = useState(routeBookingId)
  const [booking, setBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchBooking = async (requestedBookingId) => {
    if (!requestedBookingId.trim()) {
      toast.error('Enter a booking ID to track booking')
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.get(`${API_BASE_URL}/bookings/${requestedBookingId.trim()}`, {
        withCredentials: true,
      })
      setBooking(response?.data?.data || null)
      navigate(`/track-booking/${requestedBookingId.trim()}`, { replace: true })
    } catch (error) {
      setBooking(null)
      const backendMessage = error?.response?.data?.message
      toast.error(backendMessage || 'Unable to track booking right now')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (routeBookingId) {
      fetchBooking(routeBookingId)
    }
  }, [routeBookingId])

  const currentStage = booking ? normalizeBookingStage(booking.bookingStatus) : 'confirmed'
  const currentStageIndex = BOOKING_TRACKING_STAGES.findIndex((stage) => stage.value === currentStage)

  return (
    <div className='min-h-screen bg-[#f5f6f8] px-4 py-8 text-gray-900 sm:px-6 lg:px-10'>
      <div className='mx-auto max-w-5xl'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-3xl font-bold text-red-950'>Track Booking</h1>
            <p className='mt-2 text-sm text-gray-600'>Enter your booking ID to check current booking status.</p>
          </div>

          <Link
            to='/available-bikes'
            className='rounded-lg border border-red-900 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-900 hover:text-white'
          >
            Browse Bikes
          </Link>
        </div>

        <section className='mt-6 rounded-3xl bg-white p-5 shadow-md sm:p-6'>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <input
              type='text'
              value={bookingIdInput}
              onChange={(event) => setBookingIdInput(event.target.value)}
              placeholder='Enter booking ID'
              className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-900'
            />
            <button
              type='button'
              disabled={isLoading}
              onClick={() => fetchBooking(bookingIdInput)}
              className='rounded-lg bg-red-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70'
            >
              {isLoading ? 'Tracking...' : 'Track Booking'}
            </button>
          </div>
        </section>

        {booking && (
          <section className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
            <article className='rounded-3xl bg-white p-5 shadow-md sm:p-6'>
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div>
                  <p className='text-sm text-gray-500'>Booking ID</p>
                  <h2 className='text-2xl font-bold text-gray-900'>{booking.bookingId}</h2>
                </div>

                <span className='rounded-full bg-green-100 px-4 py-2 text-sm font-semibold capitalize text-green-700'>
                  {booking.bookingStatus}
                </span>
              </div>

              <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4'>
                  <p className='text-sm font-semibold text-gray-800'>User Details</p>
                  <div className='mt-3 space-y-2 text-sm text-gray-600'>
                    <p><span className='font-semibold text-gray-900'>Name:</span> {booking.user.username}</p>
                    <p><span className='font-semibold text-gray-900'>Email:</span> {booking.user.email}</p>
                    <p><span className='font-semibold text-gray-900'>Phone:</span> {booking.user.phone}</p>
                  </div>
                </div>

                <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4'>
                  <p className='text-sm font-semibold text-gray-800'>Bike Details</p>
                  <div className='mt-3 space-y-2 text-sm text-gray-600'>
                    <p><span className='font-semibold text-gray-900'>Bike:</span> {booking.bike.name}</p>
                    <p><span className='font-semibold text-gray-900'>Brand:</span> {booking.bike.brand}</p>
                    <p><span className='font-semibold text-gray-900'>Price:</span> {formatCurrency(booking.bike.price)}</p>
                    <p><span className='font-semibold text-gray-900'>Specs:</span> {booking.bike.engine_cc}cc | {booking.bike.mileage}</p>
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <p className='text-sm font-semibold text-gray-800'>Three Tracking Stages</p>
                <div className='mt-3 grid grid-cols-1 gap-3 md:grid-cols-3'>
                  {BOOKING_TRACKING_STAGES.map((stage, index) => {
                    const isCompleted = index <= currentStageIndex
                    const isCurrent = stage.value === currentStage

                    return (
                      <div
                        key={stage.value}
                        className={`rounded-2xl border p-4 ${
                          isCurrent
                            ? 'border-red-900 bg-red-950 text-white'
                            : isCompleted
                              ? 'border-green-200 bg-green-50 text-gray-900'
                              : 'border-gray-200 bg-white text-gray-900'
                        }`}
                      >
                        <p className='text-sm font-bold'>{stage.label}</p>
                        <p className={`mt-2 text-xs ${isCurrent ? 'text-white/80' : 'text-gray-500'}`}>
                          {stage.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className='mt-6'>
                <p className='text-sm font-semibold text-gray-800'>Status Timeline</p>
                <div className='mt-3 space-y-3'>
                  {booking.statusHistory?.map((statusItem, index) => (
                    <div key={`${statusItem.status}-${index}`} className='rounded-2xl border border-gray-200 p-4'>
                      <div className='flex flex-wrap items-center justify-between gap-2'>
                        <span className='text-sm font-semibold capitalize text-red-950'>{statusItem.status}</span>
                        <span className='text-xs text-gray-500'>
                          {new Date(statusItem.updatedAt).toLocaleString('en-IN')}
                        </span>
                      </div>
                      {statusItem.note && <p className='mt-2 text-sm text-gray-600'>{statusItem.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <aside className='rounded-3xl bg-white p-5 shadow-md sm:p-6'>
              <img
                src={booking.bike.image}
                alt={booking.bike.name}
                className='h-52 w-full rounded-2xl object-cover'
              />
              <h3 className='mt-4 text-xl font-bold text-gray-900'>{booking.bike.name}</h3>
              <p className='mt-1 text-sm text-gray-600'>{booking.bike.brand} | {booking.bike.fuel_type} | {booking.bike.transmission}</p>
              <p className='mt-4 text-sm text-gray-500'>Booked On</p>
              <p className='text-base font-semibold text-gray-900'>
                {new Date(booking.createdAt).toLocaleString('en-IN')}
              </p>
            </aside>
          </section>
        )}
      </div>
    </div>
  )
}