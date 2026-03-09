import React from 'react'
import { useParams } from 'react-router-dom'
import { popularBikes } from '../data/data.js'

export default function SingleBike() {
	const { id } = useParams()
	const singleBike = popularBikes.find((bike) => String(bike.id) === id)

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


	return (
		<div className='min-h-screen bg-[#f5f6f8] text-gray-900'>
			<header className='sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur'>
				<div className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10'>
					<h1 className='text-xl font-bold text-red-900'>BikeShowroom</h1>
					<a
						href='/'
						className='rounded-lg border border-red-900 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-900 hover:text-white'
					>
						Back to Home
					</a>
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
						<button className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100'>
							Compare
						</button>
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

							<div className='grid grid-cols-4 gap-3'>
								<img
									src='https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=600&q=80'
									alt='Hunter 350 front view'
									className='h-16 w-full rounded-lg object-cover sm:h-20'
								/>
								<img
									src='https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80'
									alt='Hunter 350 side view'
									className='h-16 w-full rounded-lg object-cover sm:h-20'
								/>
								<img
									src='https://images.unsplash.com/photo-1515777315835-281b94c9589f?auto=format&fit=crop&w=600&q=80'
									alt='Hunter 350 rear view'
									className='h-16 w-full rounded-lg object-cover sm:h-20'
								/>
								<img
									src='https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=600&q=80'
									alt='Hunter 350 close up'
									className='h-16 w-full rounded-lg object-cover sm:h-20'
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
								<button className='mt-4 w-full rounded-lg bg-red-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800'>
									Get Best Offer
								</button>
							</div>

							<div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
								<p className='text-sm font-semibold text-gray-800'>EMI starts at</p>
								<p className='mt-1 text-2xl font-bold'>₹ 6,790 / month</p>
								<button className='mt-3 w-full rounded-lg border border-red-900 px-4 py-2.5 text-sm font-semibold text-red-900 transition hover:bg-red-50'>
									Check Finance
								</button>
							</div>

							<div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
								<h4 className='text-sm font-semibold'>Quick Actions</h4>
								<div className='mt-3 space-y-2'>
									<button className='w-full rounded-lg border border-gray-300 px-3 py-2 text-left text-sm hover:bg-gray-50'>
										Book Test Ride
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
										<th className='px-3 py-3 font-medium'>Action</th>
									</tr>
								</thead>
								<tbody>
									{variants.map((variant) => (
										<tr key={variant.name} className='border-b border-gray-100 text-sm'>
											<td className='px-3 py-4 font-semibold text-gray-800'>{variant.name}</td>
											<td className='px-3 py-4'>{variant.price}</td>
											<td className='px-3 py-4 text-gray-600'>{variant.waiting}</td>
											<td className='px-3 py-4'>
												<button className='rounded-md border border-red-900 px-3 py-1.5 text-xs font-semibold text-red-900 hover:bg-red-50'>
													Select
												</button>
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
		</div>
	)
}
