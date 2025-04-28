import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const MyListings = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchListings = async () => {
      try {
        const res = await axios.get('/api/listings/mine', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        setListings(res.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load your listings')
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [user, navigate])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return

    try {
      await axios.delete(`/api/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setListings(listings.filter(listing => listing.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete listing')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Listings</h1>

      {loading && <p>Loading...</p>}
      {!loading && listings.length === 0 && !error && <p>No listings found.</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {listings.map(listing => (
          <div key={listing.id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">{listing.title}</h2>
            <p className="text-gray-700">{listing.description}</p>
            <p className="text-green-600 font-bold">${listing.price}</p>
            <div className="mt-2 space-x-4">
              <Link to={`/edit/${listing.id}`} className="text-blue-600 hover:underline">Edit</Link>
              <button onClick={() => handleDelete(listing.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyListings
