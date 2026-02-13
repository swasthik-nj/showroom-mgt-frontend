import React, { useState } from 'react'

export default function Login() {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className='min-h-screen page-ambient text-white relative overflow-hidden'>
			<div className='absolute inset-0'>
				<div className='absolute -top-32 -left-24 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl float-slow'></div>
				<div className='absolute top-24 right-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl float-slow float-delay'></div>
				<div className='absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl float-slow'></div>
			</div>

			<div className='relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16'>
				<div className='grid w-full items-center gap-12 lg:grid-cols-2'>
					<section className='space-y-8'>
						<div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/70'>
							<span className='h-2 w-2 rounded-full bg-yellow-400'></span>
							Bike showroom management
						</div>
						<div className='space-y-4'>
							<h1 className='font-display text-4xl font-semibold leading-tight sm:text-5xl'>
								Command your showroom with speed, clarity, and control.
							</h1>
							<p className='max-w-xl text-base text-white/70 sm:text-lg'>
								Log in to track inventory, service slots, and sales performance in a single cockpit built
								for modern bike dealers.
							</p>
						</div>

						<div className='grid gap-4 sm:grid-cols-2'>
							<div className='rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20'>
								<p className='text-sm text-white/60'>Live inventory</p>
								<p className='mt-2 text-2xl font-semibold text-white'>2,184</p>
								<p className='text-xs text-emerald-300'>+14% this month</p>
							</div>
							<div className='rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20'>
								<p className='text-sm text-white/60'>Service bays</p>
								<p className='mt-2 text-2xl font-semibold text-white'>08</p>
								<p className='text-xs text-cyan-300'>3 open now</p>
							</div>
						</div>

						<div className='flex flex-wrap items-center gap-3 text-xs text-white/60'>
							<span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>Dealer CRM</span>
							<span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>Warranty</span>
							<span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>Test ride</span>
							<span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>Smart reports</span>
						</div>
					</section>

					<section className='glass rounded-3xl p-8 shadow-2xl shadow-black/40 sm:p-10'>
						<div className='space-y-3'>
							<h2 className='font-display text-3xl font-semibold'>Welcome back</h2>
							<p className='text-sm text-white/70'>Sign in to manage your showroom floor.</p>
						</div>

						<form className='mt-8 space-y-5'>
							<div className='space-y-2'>
								<label className='text-sm text-white/70'>Work email</label>
								<input
									type='email'
									placeholder='manager@bikehouse.com'
									className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30'
								/>
							</div>
							<div className='space-y-2'>
								<label className='text-sm text-white/70'>Password</label>
								<div className='relative'>
									<input
										type={showPassword ? 'text' : 'password'}
										placeholder='Enter your password'
										className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-20 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30'
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/60 transition hover:text-white'
									>
										{showPassword ? 'HIDE' : 'SHOW'}
									</button>
								</div>
							</div>

							<div className='flex items-center justify-between text-sm text-white/60'>
								<label className='flex items-center gap-2'>
									<input type='checkbox' className='h-4 w-4 rounded border-white/20 bg-white/10' />
									Keep me signed in
								</label>
								<button type='button' className='text-yellow-300 hover:text-yellow-200'>
									Forgot password?
								</button>
							</div>

							<button
								type='submit'
								className='group relative w-full overflow-hidden rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-yellow-400/30 transition hover:-translate-y-0.5'
							>
								<span className='relative z-10'>Sign in</span>
								<span className='absolute inset-0 -translate-x-full bg-gradient-to-r from-yellow-200/0 via-white/40 to-yellow-200/0 transition duration-500 group-hover:translate-x-full'></span>
							</button>

							<div className='flex flex-col gap-3 text-center text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between'>
								<span>Need access for a new branch?</span>
								<button type='button' className='text-yellow-300 hover:text-yellow-200'>
									Request an invite
								</button>
							</div>
						</form>
					</section>
				</div>
			</div>
		</div>
	)
}
