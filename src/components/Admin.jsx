import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

const ADMIN_SIDEBAR_ITEMS = [
  { key: 'overview', label: 'Dashboard Overview' },
  { key: 'yearly-sales', label: 'Year Sales Details' },
  { key: 'add-bike', label: 'Add Bike' },
  { key: 'inventory', label: 'Bike Inventory' },
  { key: 'bookings', label: 'Booked Users' },
]

const BOOKING_TRACKING_STAGES = [
  {
    value: 'confirmed',
    label: 'Booking Confirmed',
    description: 'The booking is accepted by the showroom.',
  },
  {
    value: 'reaching-showroom',
    label: 'Reaching Showroom',
    description: 'The bike is reaching the showroom for delivery.',
  },
  {
    value: 'delivered',
    label: 'Delivered',
    description: 'The booking has been delivered successfully.',
  },
]

const INITIAL_BIKE_FORM = {
  id: '',
  name: '',
  brand: '',
  price: '',
  engine_cc: '',
  mileage: '',
  fuel_type: 'Petrol',
  transmission: 'Manual',
  color_options: '',
  stock: '',
  image: '',
  description: '',
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function formatDateTime(value) {
  return new Date(value).toLocaleString('en-IN')
}

function parseColorOptions(value) {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
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

export default function Admin() {
  const [bikeForm, setBikeForm] = useState(INITIAL_BIKE_FORM)
  const [editingBikeId, setEditingBikeId] = useState(null)
  const [showBikeForm, setShowBikeForm] = useState(false)
  const [activeSidebarItem, setActiveSidebarItem] = useState('overview')

  const [bikes, setBikes] = useState([])
  const [bookings, setBookings] = useState([])
  const [salesSummary, setSalesSummary] = useState({
    totalAmount: 0,
    totalUnits: 0,
    bikeCount: 0,
  })
  const [yearlySales, setYearlySales] = useState([])
  const [selectedYear, setSelectedYear] = useState('')
  const [bookingStageDrafts, setBookingStageDrafts] = useState({})

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmittingBike, setIsSubmittingBike] = useState(false)
  const [bookingUpdatingId, setBookingUpdatingId] = useState('')

  const syncBookingStageDrafts = (bookingData) => {
    setBookingStageDrafts(() => {
      const nextDrafts = {}

      bookingData.forEach((booking) => {
        nextDrafts[booking.bookingId] = normalizeBookingStage(booking.bookingStatus)
      })

      return nextDrafts
    })
  }

  const fetchDashboardData = async (yearFilter = '') => {
    try {
      setIsLoading(true)

      const yearlyQuery = yearFilter ? `?year=${yearFilter}` : ''

      const [bikeResponse, summaryResponse, yearlyResponse, bookingResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/bikes`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/admin/sales/summary`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/admin/sales/yearly${yearlyQuery}`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/admin/bookings`, { withCredentials: true }),
      ])

      const bikeData = Array.isArray(bikeResponse?.data?.data) ? bikeResponse.data.data : []
      const summaryData = summaryResponse?.data?.data || {
        totalAmount: 0,
        totalUnits: 0,
        bikeCount: 0,
      }
      const yearlyData = Array.isArray(yearlyResponse?.data?.data) ? yearlyResponse.data.data : []
      const bookingData = Array.isArray(bookingResponse?.data?.data) ? bookingResponse.data.data : []

      setBikes(bikeData)
      setBookings(bookingData)
      setSalesSummary(summaryData)
      setYearlySales(yearlyData)
      syncBookingStageDrafts(bookingData)
    } catch (error) {
      const backendMessage = error?.response?.data?.message
      toast.error(backendMessage || 'Failed to load admin dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchDashboardData()
  }, [])

  const resetBikeForm = () => {
    setBikeForm(INITIAL_BIKE_FORM)
    setEditingBikeId(null)
  }

  const handleAddBikeClick = () => {
    resetBikeForm()
    setShowBikeForm(true)
    setActiveSidebarItem('add-bike')
  }

  const handleSidebarNavigation = (sidebarKey) => {
    setActiveSidebarItem(sidebarKey)

    if (sidebarKey === 'add-bike') {
      resetBikeForm()
      setShowBikeForm(true)
      return
    }

    setShowBikeForm(false)
  }

  const handleBikeFormChange = (event) => {
    const { name, value } = event.target

    setBikeForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const buildBikePayload = () => ({
    id: Number(bikeForm.id),
    name: bikeForm.name.trim(),
    brand: bikeForm.brand.trim(),
    price: Number(bikeForm.price),
    engine_cc: Number(bikeForm.engine_cc),
    mileage: bikeForm.mileage.trim(),
    fuel_type: bikeForm.fuel_type.trim(),
    transmission: bikeForm.transmission.trim(),
    color_options: parseColorOptions(bikeForm.color_options),
    stock: Number(bikeForm.stock),
    image: bikeForm.image.trim(),
    description: bikeForm.description.trim(),
  })

  const handleBikeSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSubmittingBike(true)

      const payload = buildBikePayload()

      if (editingBikeId === null) {
        await axios.post(`${API_BASE_URL}/admin/bikes`, payload, { withCredentials: true })
        toast.success('Bike added successfully')
      } else {
        await axios.put(`${API_BASE_URL}/admin/bikes/${editingBikeId}`, payload, { withCredentials: true })
        toast.success('Bike updated successfully')
      }

      resetBikeForm()
      setShowBikeForm(false)
      setActiveSidebarItem('inventory')
      await fetchDashboardData(selectedYear)
    } catch (error) {
      const backendMessage = error?.response?.data?.message
      toast.error(backendMessage || 'Unable to save bike details')
    } finally {
      setIsSubmittingBike(false)
    }
  }

  const handleBikeEdit = (bike) => {
    setEditingBikeId(bike.id)
    setBikeForm({
      id: String(bike.id),
      name: bike.name || '',
      brand: bike.brand || '',
      price: String(bike.price ?? ''),
      engine_cc: String(bike.engine_cc ?? ''),
      mileage: bike.mileage || '',
      fuel_type: bike.fuel_type || 'Petrol',
      transmission: bike.transmission || 'Manual',
      color_options: Array.isArray(bike.color_options) ? bike.color_options.join(', ') : '',
      stock: String(bike.stock ?? ''),
      image: bike.image || '',
      description: bike.description || '',
    })
    setShowBikeForm(true)
    setActiveSidebarItem('add-bike')
  }

  const handleBikeDelete = async (bikeId) => {
    const shouldDelete = window.confirm('Delete this bike permanently?')
    if (!shouldDelete) {
      return
    }

    try {
      await axios.delete(`${API_BASE_URL}/admin/bikes/${bikeId}`, { withCredentials: true })
      toast.success('Bike deleted successfully')

      if (editingBikeId === bikeId) {
        resetBikeForm()
        setShowBikeForm(false)
      }

      await fetchDashboardData(selectedYear)
    } catch (error) {
      const backendMessage = error?.response?.data?.message
      toast.error(backendMessage || 'Unable to delete bike')
    }
  }

  const handleApplyYearFilter = async () => {
    const yearValue = selectedYear.trim()

    if (yearValue && !/^\d{4}$/.test(yearValue)) {
      toast.error('Year should be in YYYY format')
      return
    }

    await fetchDashboardData(yearValue)
  }

  const handleClearYearFilter = async () => {
    setSelectedYear('')
    await fetchDashboardData('')
  }

  const handleBookingStageSelect = (bookingId, stage) => {
    setBookingStageDrafts((previous) => ({
      ...previous,
      [bookingId]: stage,
    }))
  }

  const handleBookingTrackingUpdate = async (bookingId) => {
    const selectedStage = bookingStageDrafts[bookingId]

    if (!selectedStage) {
      toast.error('Choose a tracking stage first')
      return
    }

    try {
      setBookingUpdatingId(bookingId)
      const response = await axios.patch(
        `${API_BASE_URL}/admin/bookings/${bookingId}/tracking`,
        { bookingStatus: selectedStage },
        { withCredentials: true }
      )
      toast.success(response?.data?.message || 'Tracking updated successfully')
      await fetchDashboardData(selectedYear)
    } catch (error) {
      const backendMessage = error?.response?.data?.message
      toast.error(backendMessage || 'Unable to update booking tracking')
    } finally {
      setBookingUpdatingId('')
    }
  }

  const availableBikes = bikes.filter((bike) => Number(bike.stock) > 0)
  const totalStock = bikes.reduce((sum, bike) => sum + Number(bike.stock || 0), 0)
  const deliveredBookingsCount = bookings.filter(
    (booking) => normalizeBookingStage(booking.bookingStatus) === 'delivered'
  ).length

  return (
    <div className='min-h-screen bg-orange-100 text-gray-800'>
      <main>
        <div className='mx-auto flex max-w-375 gap-6 bg-gray-400/35'>
          <aside className='sticky top-0 h-screen w-84 flex flex-col items-center justify-center bg-rose-950/70 p-4 text-white shadow-md'>
            <h2 className='text-base font-bold text-amber-300'>Admin Functions</h2>
            <p className='mt-1 text-xs text-amber-200'>Quick jump to each functionality</p>

            <nav className='mt-4 w-full max-w-xs space-y-2'>
              {ADMIN_SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type='button'
                  onClick={() => handleSidebarNavigation(item.key)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                    activeSidebarItem === item.key
                      ? 'bg-gray-950 text-white'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className='w-full px-4 pb-8 pt-8 sm:px-6 lg:px-9'>
            {activeSidebarItem === 'overview' && (
              <section className='rounded-3xl bg-white p-5 shadow-md sm:p-6'>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div>
                    <h1 className='text-3xl font-bold sm:text-4xl'>Admin Dashboard</h1>
                    <p className='mt-2 text-sm text-gray-600 sm:text-base'>
                      Manage bikes, booked users, tracking stages, and yearly sales insights.
                    </p>
                  </div>

                  <button
                    type='button'
                    onClick={handleAddBikeClick}
                    className='rounded-lg bg-red-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800'
                  >
                    Add Bike
                  </button>
                </div>

                <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-5'>
                  <article className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                    <p className='text-sm font-medium text-gray-600'>Total Sales Amount</p>
                    <p className='mt-1 text-2xl font-bold text-red-950'>
                      {formatCurrency(salesSummary.totalAmount)}
                    </p>
                  </article>

                  <article className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                    <p className='text-sm font-medium text-gray-600'>Total Units Sold</p>
                    <p className='mt-1 text-2xl font-bold text-red-950'>{salesSummary.totalUnits || 0}</p>
                  </article>

                  <article className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                    <p className='text-sm font-medium text-gray-600'>Total Bikes Type</p>
                    <p className='mt-1 text-2xl font-bold text-red-950'>{salesSummary.bikeCount || bikes.length}</p>
                  </article>

                  <article className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                    <p className='text-sm font-medium text-gray-600'>Total Stock</p>
                    <p className='mt-1 text-2xl font-bold text-red-950'>{totalStock}</p>
                  </article>

                  <article className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                    <p className='text-sm font-medium text-gray-600'>Booked Users</p>
                    <p className='mt-1 text-2xl font-bold text-red-950'>{bookings.length}</p>
                  </article>
                </div>
              </section>
            )}

            {activeSidebarItem === 'yearly-sales' && (
              <section className='rounded-3xl bg-white p-5 shadow-md sm:p-6'>
                <div className='flex flex-wrap items-end justify-between gap-4'>
                  <div>
                    <h2 className='text-2xl font-bold'>Year Sales Details</h2>
                    <p className='mt-1 text-sm text-gray-600'>Check sales totals year-wise and by units sold.</p>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    <input
                      type='text'
                      value={selectedYear}
                      onChange={(event) => setSelectedYear(event.target.value)}
                      placeholder='YYYY (optional)'
                      className='rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-red-900'
                    />
                    <button
                      type='button'
                      onClick={handleApplyYearFilter}
                      className='rounded-lg border border-red-900 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-900 hover:text-white'
                    >
                      Apply
                    </button>
                    <button
                      type='button'
                      onClick={handleClearYearFilter}
                      className='rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700'
                    >
                      Show All
                    </button>
                  </div>
                </div>

                <div className='mt-4 overflow-x-auto'>
                  <table className='w-full min-w-130 border-collapse text-left'>
                    <thead>
                      <tr className='border-b border-gray-200 text-sm text-gray-600'>
                        <th className='px-3 py-3 font-semibold'>Year</th>
                        <th className='px-3 py-3 font-semibold'>Units Sold</th>
                        <th className='px-3 py-3 font-semibold'>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlySales.length === 0 ? (
                        <tr>
                          <td colSpan={3} className='px-3 py-6 text-center text-sm text-gray-500'>
                            No sales data available for the selected year.
                          </td>
                        </tr>
                      ) : (
                        yearlySales.map((sale) => (
                          <tr key={sale.year} className='border-b border-gray-100 text-sm'>
                            <td className='px-3 py-3 font-semibold'>{sale.year}</td>
                            <td className='px-3 py-3'>{sale.totalUnits}</td>
                            <td className='px-3 py-3 font-semibold text-red-950'>
                              {formatCurrency(sale.totalAmount)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeSidebarItem === 'add-bike' && showBikeForm && (
              <section className='rounded-3xl bg-white p-5 shadow-md sm:p-6'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <h2 className='text-2xl font-bold'>{editingBikeId === null ? 'Add New Bike' : 'Update Bike'}</h2>
                  <button
                    type='button'
                    onClick={() => {
                      resetBikeForm()
                      setShowBikeForm(false)
                      setActiveSidebarItem('overview')
                    }}
                    className='rounded-lg border border-gray-400 px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100'
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleBikeSubmit} className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-2'>
                  <label>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Bike ID</span>
                    <input
                      type='number'
                      name='id'
                      value={bikeForm.id}
                      onChange={handleBikeFormChange}
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Name</span>
                    <input
                      type='text'
                      name='name'
                      value={bikeForm.name}
                      onChange={handleBikeFormChange}
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Brand</span>
                    <input
                      type='text'
                      name='brand'
                      value={bikeForm.brand}
                      onChange={handleBikeFormChange}
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Price</span>
                    <input
                      type='number'
                      name='price'
                      value={bikeForm.price}
                      onChange={handleBikeFormChange}
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Engine CC</span>
                    <input
                      type='number'
                      name='engine_cc'
                      value={bikeForm.engine_cc}
                      onChange={handleBikeFormChange}
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Mileage</span>
                    <input
                      type='text'
                      name='mileage'
                      value={bikeForm.mileage}
                      onChange={handleBikeFormChange}
                      placeholder='56 kmpl'
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Fuel Type</span>
                    <input
                      type='text'
                      name='fuel_type'
                      value={bikeForm.fuel_type}
                      onChange={handleBikeFormChange}
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Transmission</span>
                    <input
                      type='text'
                      name='transmission'
                      value={bikeForm.transmission}
                      onChange={handleBikeFormChange}
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Color Options</span>
                    <input
                      type='text'
                      name='color_options'
                      value={bikeForm.color_options}
                      onChange={handleBikeFormChange}
                      placeholder='Yellow, Black'
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Stock</span>
                    <input
                      type='number'
                      name='stock'
                      value={bikeForm.stock}
                      onChange={handleBikeFormChange}
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label className='md:col-span-2'>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Image URL</span>
                    <input
                      type='text'
                      name='image'
                      value={bikeForm.image}
                      onChange={handleBikeFormChange}
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <label className='md:col-span-2'>
                    <span className='mb-1 block text-sm font-semibold text-gray-700'>Description</span>
                    <textarea
                      name='description'
                      rows={3}
                      value={bikeForm.description}
                      onChange={handleBikeFormChange}
                      required
                      className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                    />
                  </label>

                  <div className='md:col-span-2 flex flex-wrap gap-2'>
                    <button
                      type='submit'
                      disabled={isSubmittingBike}
                      className='rounded-lg bg-red-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70'
                    >
                      {isSubmittingBike ? 'Saving...' : editingBikeId === null ? 'Add Bike' : 'Update Bike'}
                    </button>

                    {editingBikeId !== null && (
                      <button
                        type='button'
                        onClick={resetBikeForm}
                        className='rounded-lg border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100'
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </section>
            )}

            {activeSidebarItem === 'inventory' && (
              <section className='w-full'>
                <div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
                  <h2 className='text-2xl font-bold'>Bike Inventory</h2>
                  <div className='flex items-center gap-3'>
                    <p className='text-sm font-medium text-gray-600'>Showing {availableBikes.length} available bikes</p>
                    {isLoading && <p className='text-sm font-medium text-gray-600'>Loading...</p>}
                  </div>
                </div>

                {availableBikes.length === 0 ? (
                  <div className='rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm'>
                    <p className='text-gray-600'>No available bikes in inventory right now.</p>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                    {availableBikes.map((bike) => (
                      <article key={bike.id} className='rounded-2xl border border-gray-200 bg-white p-3 shadow-sm'>
                        <img
                          src={bike.image}
                          alt={bike.name}
                          className='h-32 w-full rounded-xl border border-gray-200 object-cover'
                        />

                        <div className='mt-3'>
                          <h3 className='text-sm font-bold text-gray-900'>{bike.name}</h3>
                          <p className='mt-1 text-xs text-gray-600'>
                            #{bike.id} | {bike.brand} | {bike.engine_cc}cc
                          </p>
                        </div>

                        <div className='mt-3 space-y-1 text-xs text-gray-700'>
                          <p>
                            <span className='font-semibold'>Price:</span> {formatCurrency(bike.price)}
                          </p>
                          <p>
                            <span className='font-semibold'>Stock:</span> {bike.stock}
                          </p>
                        </div>

                        <div className='mt-3 grid grid-cols-2 gap-2'>
                          <button
                            type='button'
                            onClick={() => handleBikeEdit(bike)}
                            className='rounded-lg border border-red-900 px-2 py-2 text-xs font-semibold text-red-900 transition hover:bg-red-900 hover:text-white'
                          >
                            Update
                          </button>
                          <button
                            type='button'
                            onClick={() => handleBikeDelete(bike.id)}
                            className='rounded-lg bg-gray-900 px-2 py-2 text-xs font-semibold text-white transition hover:bg-gray-700'
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeSidebarItem === 'bookings' && (
              <section className='rounded-3xl bg-white p-5 shadow-md sm:p-6'>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div>
                    <h2 className='text-2xl font-bold'>Booked Users</h2>
                    <p className='mt-1 text-sm text-gray-600'>
                      View booked users and update three tracking stages until delivery.
                    </p>
                  </div>

                  <div className='flex flex-wrap gap-3 text-sm'>
                    <div className='rounded-xl border border-gray-200 bg-gray-50 px-4 py-3'>
                      <p className='text-gray-500'>Total Bookings</p>
                      <p className='font-bold text-red-950'>{bookings.length}</p>
                    </div>
                    <div className='rounded-xl border border-gray-200 bg-gray-50 px-4 py-3'>
                      <p className='text-gray-500'>Delivered</p>
                      <p className='font-bold text-red-950'>{deliveredBookingsCount}</p>
                    </div>
                  </div>
                </div>

                {bookings.length === 0 ? (
                  <div className='mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600'>
                    No users have booked a bike yet.
                  </div>
                ) : (
                  <div className='mt-6 space-y-5'>
                    {bookings.map((booking) => {
                      const currentStage = normalizeBookingStage(booking.bookingStatus)
                      const selectedStage = bookingStageDrafts[booking.bookingId] || currentStage
                      const currentStageIndex = BOOKING_TRACKING_STAGES.findIndex(
                        (stage) => stage.value === currentStage
                      )
                      const selectedStageIndex = BOOKING_TRACKING_STAGES.findIndex(
                        (stage) => stage.value === selectedStage
                      )

                      return (
                        <article key={booking.bookingId} className='rounded-2xl border border-gray-200 bg-gray-50 p-5'>
                          <div className='flex flex-wrap items-start justify-between gap-3'>
                            <div>
                              <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Booking ID</p>
                              <h3 className='text-lg font-bold text-gray-900'>{booking.bookingId}</h3>
                              <p className='mt-1 text-sm text-gray-600'>Booked on {formatDateTime(booking.createdAt)}</p>
                            </div>

                            <span className='rounded-full bg-green-100 px-4 py-2 text-sm font-semibold capitalize text-green-700'>
                              {currentStage.replace('-', ' ')}
                            </span>
                          </div>

                          <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2'>
                            <div className='rounded-2xl bg-white p-4 shadow-sm'>
                              <p className='text-sm font-semibold text-gray-800'>User Details</p>
                              <div className='mt-3 space-y-2 text-sm text-gray-600'>
                                <p><span className='font-semibold text-gray-900'>Name:</span> {booking.user.username}</p>
                                <p><span className='font-semibold text-gray-900'>Email:</span> {booking.user.email}</p>
                                <p><span className='font-semibold text-gray-900'>Phone:</span> {booking.user.phone}</p>
                              </div>
                            </div>

                            <div className='rounded-2xl bg-white p-4 shadow-sm'>
                              <p className='text-sm font-semibold text-gray-800'>Bike Details</p>
                              <div className='mt-3 space-y-2 text-sm text-gray-600'>
                                <p><span className='font-semibold text-gray-900'>Bike:</span> {booking.bike.name}</p>
                                <p><span className='font-semibold text-gray-900'>Brand:</span> {booking.bike.brand}</p>
                                <p><span className='font-semibold text-gray-900'>Price:</span> {formatCurrency(booking.bike.price)}</p>
                                <p><span className='font-semibold text-gray-900'>Specs:</span> {booking.bike.engine_cc}cc | {booking.bike.mileage}</p>
                              </div>
                            </div>
                          </div>

                          <div className='mt-5'>
                            <p className='text-sm font-semibold text-gray-800'>Three Tracking Stages</p>
                            <div className='mt-3 grid grid-cols-1 gap-3 md:grid-cols-3'>
                              {BOOKING_TRACKING_STAGES.map((stage, index) => {
                                const isCompleted = index <= currentStageIndex
                                const isSelected = stage.value === selectedStage

                                return (
                                  <button
                                    key={stage.value}
                                    type='button'
                                    onClick={() => handleBookingStageSelect(booking.bookingId, stage.value)}
                                    className={`rounded-2xl border p-4 text-left transition ${
                                      isSelected
                                        ? 'border-red-900 bg-red-950 text-white'
                                        : isCompleted
                                          ? 'border-green-200 bg-green-50 text-gray-900'
                                          : 'border-gray-200 bg-white text-gray-900 hover:border-red-300'
                                    }`}
                                  >
                                    <p className='text-sm font-bold'>{stage.label}</p>
                                    <p className={`mt-2 text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                                      {stage.description}
                                    </p>
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                            <p className='text-sm text-gray-600'>
                              Selected stage: <span className='font-semibold capitalize text-red-950'>{selectedStage.replace('-', ' ')}</span>
                            </p>

                            <button
                              type='button'
                              disabled={bookingUpdatingId === booking.bookingId || selectedStageIndex <= currentStageIndex}
                              onClick={() => handleBookingTrackingUpdate(booking.bookingId)}
                              className='rounded-lg bg-red-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70'
                            >
                              {bookingUpdatingId === booking.bookingId ? 'Updating...' : 'Update Track Details'}
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}