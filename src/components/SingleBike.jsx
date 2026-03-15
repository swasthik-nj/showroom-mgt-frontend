import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { popularBikes } from '../data/data.js'
import { QRCodeSVG } from 'qrcode.react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'
const AUTH_USER_KEY = 'authUser'

export default function SingleBike() {
	const navigate = useNavigate()
	const { id } = useParams()
	const singleBike = popularBikes.find((bike) => String(bike.id) === id)
	const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
	const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)
	const [createdBooking, setCreatedBooking] = useState(null)
	const [isCheckingExistingBooking, setIsCheckingExistingBooking] = useState(false)

	const [isTestRideModalOpen, setIsTestRideModalOpen] = useState(false)
	const [testRideBooking, setTestRideBooking] = useState(null)
	const [selectedTestDate, setSelectedTestDate] = useState('')
	const [selectedTestTime, setSelectedTestTime] = useState('')

	const storedUser = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY)
	let loggedInUser = null

	if (storedUser) {
		try {
			loggedInUser = JSON.parse(storedUser)
		} catch {
			loggedInUser = null
		}
	}

	if (!singleBike) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-[#f5f6f8] p-6'>
				<div className='rounded-xl border border-gray-200 bg-white px-6 py-5 text-center shadow-sm'>
					<h2 className='text-xl font-semibold text-gray-800'>Bike not found</h2>
					<p className='mt-2 text-sm text-gray-600'>This bike details page does not exist.</p>
					<a
						href='/'
						className='mt-4 inline-block rounded-lg border border-red-900 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-900 hover:text-white'
					>
						Back to Home
					</a>
				</div>
			</div>
		)
	}

	const keySpecs = [
		{ label: 'Engine', value: `${singleBike.engine_cc}cc` },
		{ label: 'Mileage', value: singleBike.mileage },
		{ label: 'Fuel Type', value: singleBike.fuel_type },
		{ label: 'Transmission', value: singleBike.transmission },
		{ label: 'Colors', value: singleBike.color_options.join(', ') },
		{ label: 'Stock', value: `${singleBike.stock} units` },
	]

	const formattedPrice = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		maximumFractionDigits: 0,
	}).format(singleBike.price)

	const variants = [
		{ name: 'Hunter 350 Retro Factory', price: '₹ 1,49,900', waiting: '25 - 40 days' },
		{ name: 'Hunter 350 Metro Dapper', price: '₹ 1,69,400', waiting: '20 - 35 days' },
		{ name: 'Hunter 350 Metro Rebel', price: '₹ 1,74,500', waiting: '20 - 35 days' },
	]

	const loggedInUserId = loggedInUser?._id || loggedInUser?.id || ''
	const loggedInUserEmail = loggedInUser?.email || ''

	const TEST_RIDE_TIME_SLOTS = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM']

	const availableTestDates = (() => {
		const dates = []
		const base = new Date()
		base.setHours(0, 0, 0, 0)
		for (let i = 1; dates.length < 6; i++) {
			const d = new Date(base)
			d.setDate(base.getDate() + i)
			if (d.getDay() !== 0) {
				dates.push(d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))
			}
		}
		return dates
	})()

	const testRideStorageKey = `testRide_bike${singleBike.id}_${loggedInUserId || loggedInUserEmail}`

	useEffect(() => {
		const saved = localStorage.getItem(testRideStorageKey)
		if (saved) {
			try { setTestRideBooking(JSON.parse(saved)) } catch { /* ignore */ }
		}
	}, [testRideStorageKey])

	useEffect(() => {
		const checkExistingBookingForBike = async () => {
			if (!loggedInUser || !singleBike?.id) {
				setCreatedBooking(null)
				return
			}

			try {
				setIsCheckingExistingBooking(true)
				const response = await axios.get(`${API_BASE_URL}/bookings/user-bike`, {
					params: {
						bikeId: singleBike.id,
						userId: loggedInUserId || undefined,
						email: loggedInUserEmail || undefined,
					},
					withCredentials: true,
				})

				setCreatedBooking(response?.data?.data || null)
			} catch {
				setCreatedBooking(null)
			} finally {
				setIsCheckingExistingBooking(false)
			}
		}

		checkExistingBookingForBike()
	}, [loggedInUserId, loggedInUserEmail, singleBike?.id])

	const handleOpenTestRideModal = () => {
		if (!loggedInUser) {
			toast.error('Please login to book a test ride')
			navigate('/login')
			return
		}
		setIsTestRideModalOpen(true)
	}

	const handleConfirmTestRide = () => {
		if (!selectedTestDate || !selectedTestTime) {
			toast.error('Please select a date and time slot')
			return
		}
		const ref = `TR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`
		const booking = {
			ref,
			bikeName: singleBike.name,
			brand: singleBike.brand,
			bikeId: singleBike.id,
			userName: loggedInUser.username,
			email: loggedInUser.email,
			phone: loggedInUser.phone,
			date: selectedTestDate,
			time: selectedTestTime,
			showroom: 'Bike Showroom, Main Road, City Center',
		}
		localStorage.setItem(testRideStorageKey, JSON.stringify(booking))
		setTestRideBooking(booking)
		setSelectedTestDate('')
		setSelectedTestTime('')
		toast.success('Test ride booked!')
	}

	const handleOpenBookingModal = () => {
		if (!loggedInUser) {
			toast.error('Please login to book this bike')
			navigate('/login')
			return
		}

		if (createdBooking) {
			toast.error('You already booked this bike. Get updates from the button below.')
			return
		}

		setIsBookingModalOpen(true)
	}

	const handleConfirmBooking = async () => {
		if (!loggedInUser) {
			toast.error('Please login to book this bike')
			return
		}

		const payload = {
			user: {
				userId: loggedInUser._id || loggedInUser.id || null,
				username: loggedInUser.username,
				email: loggedInUser.email,
				phone: loggedInUser.phone,
			},
			bike: {
				bikeId: singleBike.id,
				name: singleBike.name,
				brand: singleBike.brand,
				price: singleBike.price,
				image: singleBike.image,
				engine_cc: singleBike.engine_cc,
				mileage: singleBike.mileage,
				fuel_type: singleBike.fuel_type,
				transmission: singleBike.transmission,
			},
		}

		try {
			setIsSubmittingBooking(true)
			const response = await axios.post(`${API_BASE_URL}/bookings`, payload, {
				withCredentials: true,
			})
			const bookingData = response?.data?.data || null
			setCreatedBooking(bookingData)
			toast.success(response?.data?.message || 'Booking successful')
		} catch (error) {
			const backendMessage = error?.response?.data?.message
			if (error?.response?.status === 409) {
				const existingBooking = error?.response?.data?.data
				if (existingBooking) {
					setCreatedBooking(existingBooking)
				}
				setIsBookingModalOpen(false)
				toast.error(backendMessage || 'You already booked this bike')
				return
			}

			toast.error(backendMessage || 'Unable to confirm booking right now')
		} finally {
			setIsSubmittingBooking(false)
		}
	}


	return (
		<div className='min-h-screen bg-[#f5f6f8] text-gray-900'>
			<header className='sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur'>
				<div className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10'>
					<h1 className='text-xl font-bold text-red-900'>BikeShowroom</h1>
					<Link
						to='/'
						className='rounded-lg border border-red-900 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-900 hover:text-white'
					>
						Back to Home
					</Link>
				</div>
			</header>

			<main className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8'>


				<section className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
					<div className='mb-5 flex flex-wrap items-start justify-between gap-3'>
						<div>
							<h2 className='text-2xl font-bold sm:text-3xl'>{singleBike.name}</h2>
							<p className='mt-1 text-sm text-gray-500'>
								{singleBike.brand} | {singleBike.engine_cc}cc | {singleBike.mileage}
							</p>
							<div className='mt-2 flex items-center gap-2 text-sm'>
								<span className='rounded-md bg-green-600 px-2 py-0.5 font-semibold text-white'>4.5 ★</span>
								<span className='text-gray-600'>1,250 Ratings</span>
							</div>
						</div>
						
					</div>

					<div className='grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]'>
						<div className='space-y-4'>
							<div className='overflow-hidden rounded-xl border border-gray-200 bg-gray-100'>
								<img
									src={singleBike.image}
									alt={singleBike.name}
									className='h-[240px] w-full object-cover sm:h-[360px]'
								/>
							</div>

							<div className='grid grid-cols-3 gap-3'>
								<img
									src={singleBike.img1}
									alt='Hunter 350 front view'
									className='h-20 w-full rounded-lg object-cover sm:h-35'
								/>
								<img
									src={singleBike.img2}
									alt='Hunter 350 side view'
									className='h-20 w-full rounded-lg object-cover sm:h-35'
								/>
								<img
									src={singleBike.img3}
									alt='Hunter 350 rear view'
									className='h-20 w-full rounded-lg object-cover sm:h-35'
								/>
								
							</div>

							<div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
								<h3 className='text-lg font-semibold'>Bike Highlights</h3>
								<p className='mt-2 text-sm leading-6 text-gray-600'>
									{singleBike.description}
								</p>
							</div>
						</div>

						<aside className='space-y-4'>
							<div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
								<p className='text-sm text-gray-500'>On-road Price (Avg)</p>
								<p className='mt-1 text-3xl font-bold text-gray-900'>{formattedPrice}</p>
								<p className='mt-1 text-xs text-gray-500'>Includes RTO, Insurance and other charges</p>
								<button
									type='button'
									disabled={Boolean(createdBooking) || isCheckingExistingBooking}
									onClick={handleOpenBookingModal}
									className='mt-4 w-full rounded-lg bg-red-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70'
								>
									{isCheckingExistingBooking ? 'Checking Booking...' : createdBooking ? 'Already Booked' : 'Book now'}
								</button>
								{createdBooking && (
									<button
										type='button'
										onClick={() => navigate(`/track-booking/${createdBooking.bookingId}`)}
										className='mt-3 w-full rounded-lg border border-red-900 px-4 py-2.5 text-sm font-semibold text-red-900 transition hover:bg-red-50'
									>
										Get Updates About Your Bike
									</button>
								)}
							</div>

							<div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
								<p className='text-sm font-semibold text-gray-800'>EMI starts at</p>
								<p className='mt-1 text-2xl font-bold'>₹ 6,790 / month</p>
								{/* <button className='mt-3 w-full rounded-lg border border-red-900 px-4 py-2.5 text-sm font-semibold text-red-900 transition hover:bg-red-50'>
									Check Finance
								</button> */}
							</div>

							<div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
								<h4 className='text-sm font-semibold'>Quick Actions</h4>
								<div className='mt-3 space-y-2'>
									<button
										type='button'
										onClick={handleOpenTestRideModal}
										className='w-full rounded-lg border border-red-900 bg-red-50 px-3 py-2 text-left text-sm font-semibold text-red-900 transition hover:bg-red-900 hover:text-white'
									>
										{testRideBooking ? '🏍 Test Ride Booked — View QR' : 'Book Test Ride'}
									</button>
									<button className='w-full rounded-lg border border-gray-300 px-3 py-2 text-left text-sm hover:bg-gray-50'>
										View Deals
									</button>
									<button className='w-full rounded-lg border border-gray-300 px-3 py-2 text-left text-sm hover:bg-gray-50'>
										Download Brochure
									</button>
								</div>
							</div>
						</aside>
					</div>
				</section>

				<section className='mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
					<h3 className='text-xl font-bold'>Key Specifications</h3>
					<div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
						{keySpecs.map((spec) => (
							<article
								key={spec.label}
								className='rounded-lg border border-gray-200 bg-gray-50 p-4 transition hover:border-red-300'
							>
								<p className='text-sm text-gray-500'>{spec.label}</p>
								<p className='mt-1 font-semibold'>{spec.value}</p>
							</article>
						))}
					</div>
				</section>

				<section className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]'>
					<div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
						<h3 className='text-xl font-bold'>Variants & Prices</h3>
						<div className='mt-4 overflow-x-auto'>
							<table className='w-full min-w-[560px] border-collapse text-left'>
								<thead>
									<tr className='border-b border-gray-200 text-sm text-gray-500'>
										<th className='px-3 py-3 font-medium'>Variant</th>
										<th className='px-3 py-3 font-medium'>On-road Price</th>
										<th className='px-3 py-3 font-medium'>Waiting Period</th>
										{/* <th className='px-3 py-3 font-medium'>Action</th> */}
									</tr>
								</thead>
								<tbody>
									{variants.map((variant) => (
										<tr key={variant.name} className='border-b border-gray-100 text-sm'>
											<td className='px-3 py-4 font-semibold text-gray-800'>{variant.name}</td>
											<td className='px-3 py-4'>{variant.price}</td>
											<td className='px-3 py-4 text-gray-600'>{variant.waiting}</td>
											<td className='px-3 py-4'>
												{/* <button className='rounded-md border border-red-900 px-3 py-1.5 text-xs font-semibold text-red-900 hover:bg-red-50'>
													Select
												</button> */}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
						<h3 className='text-xl font-bold'>Pros & Cons</h3>
						<div className='mt-4 space-y-4'>
							<div>
								<p className='font-semibold text-green-700'>What’s Good</p>
								<ul className='mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600'>
									<li>Refined engine with great low-end torque.</li>
									<li>Comfortable ergonomics for city and short tours.</li>
									<li>Strong brand value and resale demand.</li>
								</ul>
							</div>
							<div>
								<p className='font-semibold text-red-700'>Could Be Better</p>
								<ul className='mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600'>
									<li>Top-end performance is moderate.</li>
									<li>Suspension can feel firm on rough roads.</li>
									<li>Feature list could include more modern tech.</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</main>

			{isTestRideModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
					<div className='w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl'>
						<div className='flex items-start justify-between gap-3'>
							<div>
								<h2 className='text-2xl font-bold text-gray-900'>
									{testRideBooking ? 'Your Test Ride Booking' : 'Book a Test Ride'}
								</h2>
								<p className='mt-1 text-sm text-gray-500'>
									{testRideBooking ? 'Show the QR code at the showroom counter.' : `${singleBike.name} · ${singleBike.brand}`}
								</p>
							</div>
							<button
								type='button'
								onClick={() => setIsTestRideModalOpen(false)}
								className='rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100'
							>
								Close
							</button>
						</div>

						{testRideBooking ? (
							<div className='mt-5 flex flex-col items-center gap-4'>
								<div className='w-full rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-gray-700'>
									<p className='font-bold text-green-700 text-base mb-2'>✅ Test Ride Confirmed</p>
									<p><span className='font-semibold text-gray-900'>Ref:</span> {testRideBooking.ref}</p>
									<p><span className='font-semibold text-gray-900'>Bike:</span> {testRideBooking.bikeName} ({testRideBooking.brand})</p>
									<p><span className='font-semibold text-gray-900'>Rider:</span> {testRideBooking.userName}</p>
									<p><span className='font-semibold text-gray-900'>Date:</span> {testRideBooking.date}</p>
									<p><span className='font-semibold text-gray-900'>Time:</span> {testRideBooking.time}</p>
									<p><span className='font-semibold text-gray-900'>Venue:</span> {testRideBooking.showroom}</p>
								</div>

								<div className='flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-5'>
									<p className='text-xs font-semibold uppercase tracking-widest text-gray-500'>Scan at Showroom Counter</p>
									<QRCodeSVG
										value={`BIKE SHOWROOM - TEST RIDE\nRef: ${testRideBooking.ref}\nBike: ${testRideBooking.bikeName} (${testRideBooking.brand})\nRider: ${testRideBooking.userName} | ${testRideBooking.phone}\nDate: ${testRideBooking.date}\nTime: ${testRideBooking.time}\nVenue: ${testRideBooking.showroom}`}
										size={200}
										bgColor='#ffffff'
										fgColor='#7f1d1d'
										level='M'
									/>
									<p className='text-xs text-gray-400'>Show this QR code to the showroom staff</p>
								</div>

								<div className='flex w-full gap-3'>
									<button
										type='button'
										onClick={() => {
											localStorage.removeItem(testRideStorageKey)
											setTestRideBooking(null)
											toast.success('Test ride booking cancelled')
										}}
										className='flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100'
									>
										Cancel Booking
									</button>
									<button
										type='button'
										onClick={() => setIsTestRideModalOpen(false)}
										className='flex-1 rounded-lg bg-red-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800'
									>
										Done
									</button>
								</div>
							</div>
						) : (
							<div className='mt-5 space-y-5'>
								<div>
									<p className='text-sm font-semibold text-gray-800 mb-2'>Select a Date</p>
									<div className='grid grid-cols-3 gap-2'>
										{availableTestDates.map((date) => (
											<button
												key={date}
												type='button'
												onClick={() => setSelectedTestDate(date)}
												className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
													selectedTestDate === date
														? 'border-red-900 bg-red-950 text-white'
														: 'border-gray-200 bg-gray-50 text-gray-800 hover:border-red-300'
												}`}
											>
												{date}
											</button>
										))}
									</div>
								</div>

								<div>
									<p className='text-sm font-semibold text-gray-800 mb-2'>Select a Time Slot</p>
									<div className='flex flex-wrap gap-2'>
										{TEST_RIDE_TIME_SLOTS.map((slot) => (
											<button
												key={slot}
												type='button'
												onClick={() => setSelectedTestTime(slot)}
												className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
													selectedTestTime === slot
														? 'border-red-900 bg-red-950 text-white'
														: 'border-gray-200 bg-gray-50 text-gray-800 hover:border-red-300'
												}`}
											>
												{slot}
											</button>
										))}
									</div>
								</div>

								{selectedTestDate && selectedTestTime && (
									<div className='rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-gray-700'>
										<p className='font-semibold text-gray-900'>📅 {selectedTestDate} · {selectedTestTime}</p>
										<p className='mt-1 text-xs text-gray-500'>Bike Showroom, Main Road, City Center</p>
									</div>
								)}

								<div className='flex gap-3'>
									<button
										type='button'
										onClick={handleConfirmTestRide}
										className='flex-1 rounded-lg bg-red-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60'
									>
										Confirm Test Ride
									</button>
									<button
										type='button'
										onClick={() => setIsTestRideModalOpen(false)}
										className='flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100'
									>
										Cancel
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{isBookingModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
					<div className='w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl'>
						<div className='flex items-start justify-between gap-3'>
							<div>
								<h2 className='text-2xl font-bold text-gray-900'>Confirm Booking</h2>
								<p className='mt-1 text-sm text-gray-600'>Review your details and bike details before confirming booking.</p>
							</div>
							<button
								type='button'
								onClick={() => setIsBookingModalOpen(false)}
								className='rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100'
							>
								Close
							</button>
						</div>

						{createdBooking ? (
							<div className='mt-6 rounded-2xl border border-green-200 bg-green-50 p-5'>
								<h3 className='text-lg font-bold text-green-700'>Booking successful</h3>
								<p className='mt-2 text-sm text-gray-700'>
									Your booking ID is <span className='font-semibold'>{createdBooking.bookingId}</span>.
								</p>
								<div className='mt-4 flex flex-wrap gap-3'>
									<button
										type='button'
										onClick={() => navigate(`/track-booking/${createdBooking.bookingId}`)}
										className='rounded-lg bg-red-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800'
									>
										Get Updates About Your Bike
									</button>
									<button
										type='button'
										onClick={() => setIsBookingModalOpen(false)}
										className='rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100'
									>
										Done
									</button>
								</div>
							</div>
						) : (
							<>
								<div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
									<div className='rounded-2xl border border-gray-200 bg-gray-50 p-4'>
										<h3 className='text-sm font-semibold text-gray-800'>User Details</h3>
										<div className='mt-3 space-y-2 text-sm text-gray-600'>
											<p><span className='font-semibold text-gray-900'>Name:</span> {loggedInUser?.username || 'N/A'}</p>
											<p><span className='font-semibold text-gray-900'>Email:</span> {loggedInUser?.email || 'N/A'}</p>
											<p><span className='font-semibold text-gray-900'>Phone:</span> {loggedInUser?.phone || 'N/A'}</p>
										</div>
									</div>

									<div className='rounded-2xl border border-gray-200 bg-gray-50 p-4'>
										<h3 className='text-sm font-semibold text-gray-800'>Bike Details</h3>
										<div className='mt-3 space-y-2 text-sm text-gray-600'>
											<p><span className='font-semibold text-gray-900'>Bike:</span> {singleBike.name}</p>
											<p><span className='font-semibold text-gray-900'>Brand:</span> {singleBike.brand}</p>
											<p><span className='font-semibold text-gray-900'>Price:</span> {formattedPrice}</p>
											<p><span className='font-semibold text-gray-900'>Specs:</span> {singleBike.engine_cc}cc | {singleBike.mileage}</p>
										</div>
									</div>
								</div>

								<div className='mt-6 flex flex-wrap gap-3'>
									<button
										type='button'
										disabled={isSubmittingBooking}
										onClick={handleConfirmBooking}
										className='rounded-lg bg-red-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70'
									>
										{isSubmittingBooking ? 'Confirming...' : 'Confirm Booking'}
									</button>
									<button
										type='button'
										onClick={() => setIsBookingModalOpen(false)}
										className='rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100'
									>
										Cancel
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
