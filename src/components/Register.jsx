import React, { useState } from 'react'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className='min-h-screen lg:h-screen page-ambient text-white relative overflow-x-hidden overflow-y-auto lg:overflow-hidden'>
      <div className='absolute inset-0'>
        <div className='absolute -top-36 left-10 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl float-slow'></div>
        <div className='absolute top-20 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl float-slow float-delay'></div>
        <div className='absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl float-slow'></div>
      </div>

      <div className='relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:py-16'>
        <div className='grid w-full items-center gap-8 lg:gap-12 lg:grid-cols-2'>
          <section className='space-y-8 w-full max-w-xl mx-auto lg:max-w-none'>
            <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/70'>
              <span className='h-2 w-2 rounded-full bg-yellow-400'></span>
              Buyer registration
            </div>
            <div className='space-y-4'>
              <h1 className='font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl'>
                Register to find your perfect new bike.
              </h1>
              <p className='max-w-xl text-base text-white/70 sm:text-lg'>
                Create your account, share your requirements, and get matched with bikes that fit your budget and riding needs.
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20'>
                <p className='text-sm text-white/60'>Saved models</p>
                <p className='mt-2 text-2xl font-semibold text-white'>Unlimited</p>
                <p className='text-xs text-emerald-300'>Compare anytime</p>
              </div>
              <div className='rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20'>
                <p className='text-sm text-white/60'>Dealer connect</p>
                <p className='mt-2 text-2xl font-semibold text-white'>24x7</p>
                <p className='text-xs text-cyan-300'>Assisted buying</p>
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-3 text-xs text-white/60'>
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>Bike matching</span>
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>Test ride request</span>
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>Budget planner</span>
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>EMI guidance</span>
            </div>
          </section>

          <section className='glass w-full max-w-xl mx-auto rounded-3xl p-5 shadow-2xl shadow-black/40 sm:p-8 lg:max-w-none lg:p-10'>
            <div className='space-y-3'>
              <h2 className='font-display text-2xl font-semibold sm:text-3xl'>Create account</h2>
              <p className='text-sm text-white/70'>Create a buyer profile and share your bike requirements.</p>
            </div>

            <form className='mt-8 space-y-5'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label className='text-sm text-white/70'>Full name</label>
                  <input
                    type='text'
                    placeholder='Aarav Sharma'
                    required
                    className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm text-white/70'>Phone</label>
                  <input
                    type='tel'
                    placeholder='+91 9XXXX XXXXX'
                    required
                    className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-sm text-white/70'>Email</label>
                <input
                  type='email'
                  placeholder='you@example.com'
                  required
                  className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30'
                />
              </div>


              <div className='space-y-2'>
                <label className='text-sm text-white/70'>Password</label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Create a strong password'
                    required
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
              <div className='space-y-2'>
                <label className='text-sm text-white/70'>Confirm password</label>
                <div className='relative'>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder='Re-enter password'
                    required
                    className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-20 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirm(!showConfirm)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/60 transition hover:text-white'
                  >
                    {showConfirm ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <button
                type='submit'
                className='group relative w-full overflow-hidden rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-yellow-400/30 transition hover:-translate-y-0.5'
              >
                <span className='relative z-10'>Register now</span>
                <span className='absolute inset-0 -translate-x-full bg-linear-to-r from-yellow-200/0 via-white/40 to-yellow-200/0 transition duration-500 group-hover:translate-x-full'></span>
              </button>

              <div className='flex flex-col gap-3 text-center text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between'>
                <span>Already have an account?</span>
                <a href='/login' className='text-yellow-300 hover:text-yellow-200'>
                  Sign in instead
                </a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
