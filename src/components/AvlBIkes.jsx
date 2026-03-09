import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from './Nav'
import { popularBikes } from '../data/data.js'

const PRICE_RANGES = [
  { value: 'all', label: 'Any Budget', min: 0, max: Infinity },
  { value: 'budget', label: 'Up to INR 1,00,000', min: 0, max: 100000 },
  { value: 'mid', label: 'INR 1,00,001 - INR 1,60,000', min: 100001, max: 160000 },
  { value: 'premium', label: 'INR 1,60,001 - INR 2,20,000', min: 160001, max: 220000 },
  { value: 'performance', label: 'Above INR 2,20,000', min: 220001, max: Infinity },
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'mileage-desc', label: 'Mileage: High to Low' },
  { value: 'engine-desc', label: 'Engine: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
]

const MILEAGE_OPTIONS = [0, 35, 40, 45, 50, 55]

function parseMileage(mileageText) {
  const firstValue = String(mileageText).split(' ')[0]
  return Number(firstValue) || 0
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function AvlBIkes() {
  const [searchText, setSearchText] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedFuel, setSelectedFuel] = useState('all')
  const [selectedTransmission, setSelectedTransmission] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [minimumMileage, setMinimumMileage] = useState(0)
  const [stockOnly, setStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const brandOptions = useMemo(() => ['all', ...new Set(popularBikes.map((bike) => bike.brand))], [])
  const fuelOptions = useMemo(() => ['all', ...new Set(popularBikes.map((bike) => bike.fuel_type))], [])
  const transmissionOptions = useMemo(
    () => ['all', ...new Set(popularBikes.map((bike) => bike.transmission))],
    []
  )

  const filteredBikes = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    const selectedRange = PRICE_RANGES.find((range) => range.value === selectedPriceRange) || PRICE_RANGES[0]

    const filtered = popularBikes.filter((bike) => {
      const bikeSearchText = `${bike.name} ${bike.brand}`.toLowerCase()
      const bikeMileage = parseMileage(bike.mileage)

      const matchesSearch = !query || bikeSearchText.includes(query)
      const matchesBrand = selectedBrand === 'all' || bike.brand === selectedBrand
      const matchesFuel = selectedFuel === 'all' || bike.fuel_type === selectedFuel
      const matchesTransmission =
        selectedTransmission === 'all' || bike.transmission === selectedTransmission
      const matchesPrice = bike.price >= selectedRange.min && bike.price <= selectedRange.max
      const matchesMileage = bikeMileage >= Number(minimumMileage)
      const matchesStock = !stockOnly || bike.stock > 0

      return (
        matchesSearch &&
        matchesBrand &&
        matchesFuel &&
        matchesTransmission &&
        matchesPrice &&
        matchesMileage &&
        matchesStock
      )
    })

    switch (sortBy) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price)
      case 'mileage-desc':
        return [...filtered].sort((a, b) => parseMileage(b.mileage) - parseMileage(a.mileage))
      case 'engine-desc':
        return [...filtered].sort((a, b) => b.engine_cc - a.engine_cc)
      case 'name-asc':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return filtered
    }
  }, [
    minimumMileage,
    searchText,
    selectedBrand,
    selectedFuel,
    selectedPriceRange,
    selectedTransmission,
    sortBy,
    stockOnly,
  ])

  const resetFilters = () => {
    setSearchText('')
    setSelectedBrand('all')
    setSelectedFuel('all')
    setSelectedTransmission('all')
    setSelectedPriceRange('all')
    setMinimumMileage(0)
    setStockOnly(false)
    setSortBy('featured')
  }

  return (
    <div className='min-h-screen bg-orange-100 text-gray-800'>
      <Nav />

      <main className='px-4 pb-14 pt-28 sm:px-8 md:pt-32 lg:px-16'>
        <section className='mx-auto max-w-6xl rounded-3xl bg-white p-5 shadow-md sm:p-6'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold sm:text-4xl'>All Available Bikes</h1>
              <p className='mt-2 text-sm text-gray-600 sm:text-base'>
                Showing {filteredBikes.length} of {popularBikes.length} bikes
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={() => setShowAdvanced((current) => !current)}
                className='rounded-lg border border-red-950 px-4 py-2 text-sm font-semibold text-red-950 transition hover:bg-red-950 hover:text-white'
              >
                {showAdvanced ? 'Hide More Options' : 'More Options'}
              </button>
              <button
                type='button'
                onClick={resetFilters}
                className='rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700'
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className='mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4'>
            <label className='md:col-span-2'>
              <span className='mb-1 block text-sm font-semibold text-gray-700'>Search Bike</span>
              <input
                type='text'
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder='Search by bike name or brand'
                className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
              />
            </label>

            <label>
              <span className='mb-1 block text-sm font-semibold text-gray-700'>Brand</span>
              <select
                value={selectedBrand}
                onChange={(event) => setSelectedBrand(event.target.value)}
                className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
              >
                {brandOptions.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand === 'all' ? 'All Brands' : brand}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className='mb-1 block text-sm font-semibold text-gray-700'>Sort By</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {showAdvanced && (
            <div className='mt-4 grid grid-cols-1 gap-3 border-t border-gray-200 pt-4 md:grid-cols-2 lg:grid-cols-5'>
              <label>
                <span className='mb-1 block text-sm font-semibold text-gray-700'>Fuel Type</span>
                <select
                  value={selectedFuel}
                  onChange={(event) => setSelectedFuel(event.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                >
                  {fuelOptions.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel === 'all' ? 'All Fuel Types' : fuel}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className='mb-1 block text-sm font-semibold text-gray-700'>Transmission</span>
                <select
                  value={selectedTransmission}
                  onChange={(event) => setSelectedTransmission(event.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                >
                  {transmissionOptions.map((transmission) => (
                    <option key={transmission} value={transmission}>
                      {transmission === 'all' ? 'All Types' : transmission}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className='mb-1 block text-sm font-semibold text-gray-700'>Price Range</span>
                <select
                  value={selectedPriceRange}
                  onChange={(event) => setSelectedPriceRange(event.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className='mb-1 block text-sm font-semibold text-gray-700'>Minimum Mileage</span>
                <select
                  value={minimumMileage}
                  onChange={(event) => setMinimumMileage(event.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-900'
                >
                  {MILEAGE_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value === 0 ? 'Any Mileage' : `${value} kmpl+`}
                    </option>
                  ))}
                </select>
              </label>

              <label className='flex items-end'>
                <span className='inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-medium'>
                  <input
                    type='checkbox'
                    checked={stockOnly}
                    onChange={(event) => setStockOnly(event.target.checked)}
                    className='h-4 w-4 accent-red-900'
                  />
                  In Stock Only
                </span>
              </label>
            </div>
          )}
        </section>

        <section className='mx-auto mt-8 max-w-6xl'>
          {filteredBikes.length === 0 ? (
            <div className='rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm'>
              <h2 className='text-2xl font-semibold text-gray-800'>No bikes found</h2>
              <p className='mt-2 text-sm text-gray-600'>Try changing filters or clear all filters.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredBikes.map((bike) => (
                <article
                  key={bike.id}
                  className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md'
                >
                  <img src={bike.image} alt={bike.name} className='h-48 w-full object-cover' />

                  <div className='p-5'>
                    <div className='flex items-start justify-between gap-2'>
                      <h2 className='text-lg font-bold text-gray-900'>{bike.name}</h2>
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          bike.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {bike.stock > 0 ? `${bike.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    <p className='mt-2 text-sm text-gray-600'>
                      {bike.brand} | {bike.engine_cc}cc | {bike.mileage}
                    </p>
                    <p className='mt-2 text-sm text-gray-600'>{bike.description}</p>

                    <div className='mt-3 flex flex-wrap gap-2'>
                      {bike.color_options.slice(0, 3).map((color) => (
                        <span
                          key={`${bike.id}-${color}`}
                          className='rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-800'
                        >
                          {color}
                        </span>
                      ))}
                      {bike.color_options.length > 3 && (
                        <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700'>
                          +{bike.color_options.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className='mt-5 flex items-center justify-between'>
                      <p className='text-xl font-bold text-red-950'>{formatPrice(bike.price)}</p>
                      <Link
                        to={`/bikes/${bike.id}`}
                        className='rounded-lg bg-red-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800'
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
    