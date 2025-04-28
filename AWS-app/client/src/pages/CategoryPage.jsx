import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const CategoryPage = () => {
  const { section, category } = useParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        const res = await axios.get('/api/listings', {
          params: { section, category }
        })
        console.log("Fetched Listings:", res.data)
        setListings(res.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load listings.')
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [section, category])

  const renderDetails = (item) => {
    switch (section) {
      case 'for-sale':
        return (
          <>
            {item.year_built || item.year_built === 0 ? <p className="text-gray-300 font-semibold"><strong>Year Built:</strong> {item.year_built || 'N/A'}</p> : null}
            {item.make_model ? <p className="text-gray-300 font-semibold"><strong>Make/Model:</strong> {item.make_model}</p> : null}
            {item.color ? <p className="text-gray-300 font-semibold"><strong>Color:</strong> {item.color}</p> : null}
            {item.type ? <p className="text-gray-300 font-semibold"><strong>Type:</strong> {item.type}</p> : null}
            {item.status ? <p className="text-gray-300 font-semibold"><strong>Status:</strong> {item.status}</p> : null}
          </>
        )
      case 'housing':
        return (
          <>
            {item.bedrooms || item.bedrooms === 0 ? <p className="text-gray-300 font-semibold"><strong>Bedrooms:</strong> {item.bedrooms || 'N/A'}</p> : null}
            {item.sqft || item.sqft === 0 ? <p className="text-gray-300 font-semibold"><strong>Sqft:</strong> {item.sqft || 'N/A'}</p> : null}
          </>
        )
      case 'services':
        return (
          <>
            {item.service_type ? <p className="text-gray-300 font-semibold"><strong>Service Type:</strong> {item.service_type}</p> : null}
            {item.availability ? <p className="text-gray-300 font-semibold"><strong>Availability:</strong> {item.availability}</p> : null}
          </>
        )
      case 'jobs':
        return (
          <>
            {item.job_type ? <p className="text-gray-300 font-semibold"><strong>Job Type:</strong> {item.job_type}</p> : null}
            {item.salary || item.salary === 0 ? <p className="text-gray-300 font-semibold"><strong>Salary:</strong> {item.salary || 'N/A'}</p> : null}
          </>
        )
      case 'community':
        return (
          <>
            {item.event_name ? <p className="text-gray-300 font-semibold"><strong>Event Name:</strong> {item.event_name}</p> : null}
            {item.event_date ? <p className="text-gray-300 font-semibold"><strong>Event Date:</strong> {item.event_date}</p> : null}
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-extrabold mb-6 capitalize">
        {section.replace('-', ' ')} - {category.replace('-', ' ')}
      </h1>

      {loading && <p className="text-gray-300">Loading listings...</p>}
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {!loading && listings.length === 0 && <p className="text-gray-300">No listings found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map(item => (
          <div key={item.id} className="bg-gray-900 text-white rounded-lg p-6 shadow-lg hover:shadow-glow transition-shadow duration-300 border border-gray-700">
            <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
            {renderDetails(item)}
            <p className="text-green-400 font-bold mt-3 mb-1"><strong>Price:</strong> ${item.price}</p>
            <p className="text-gray-300 font-medium"><strong>City:</strong> {item.city}</p>
            <p className="text-blue-400 font-medium"><strong>Phone:</strong> {item.phone}</p>
            <p className="text-gray-400 text-sm mt-4">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryPage
