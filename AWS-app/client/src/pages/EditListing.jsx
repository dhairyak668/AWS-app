import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const EditListing = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchListing = async () => {
      try {
        const res = await axios.get(`/api/listings/mine`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        const listing = res.data.find(item => item.id === parseInt(id))
        if (!listing) throw new Error('Listing not found')
        setFormData(listing)
      } catch (err) {
        console.error(err)
        setError('Failed to load listing')
      }
    }

    fetchListing()
  }, [user, id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "section") {
      const firstCategory = (categoryOptions[value] && categoryOptions[value][0]) || "";
      setFormData({ ...formData, section: value, category: firstCategory });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    // Dynamically construct payload based on section
    const commonFields = {
      title: formData.title,
      price: formData.price,
      description: formData.description,
      city: formData.city,
      phone: formData.phone,
      section: formData.section,
      category: formData.category,
    }
    let detailFields = {}
    switch (formData.section) {
      case 'for-sale':
        detailFields = {
          year_built: formData.year_built,
          make_model: formData.make_model,
          color: formData.color,
          type: formData.type,
          status: formData.status,
        }
        break
      case 'housing':
        detailFields = {
          bedrooms: formData.bedrooms,
          sqft: formData.sqft,
        }
        break
      case 'services':
        detailFields = {
          service_type: formData.service_type,
          availability: formData.availability,
        }
        break
      case 'jobs':
        detailFields = {
          job_type: formData.job_type,
          salary: formData.salary,
        }
        break
      case 'community':
        detailFields = {
          event_name: formData.event_name,
          event_date: formData.event_date,
        }
        break
      default:
        detailFields = {}
    }
    const updatePayload = { ...commonFields, ...detailFields }
    try {
      await axios.put(`/api/listings/${id}`, updatePayload, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      navigate('/my-listings')
    } catch (err) {
      console.error(err)
      setError('Failed to update listing')
    }
  }

  if (!formData) return <p className="p-6">Loading listing...</p>

  const categoryOptions = {
    'for-sale': ['cars', 'motorcycles', 'boats', 'books', 'furniture'],
    housing: ['apartments', 'rooms', 'houses', 'condos', 'sublets'],
    services: ['repair', 'cleaning', 'moving', 'tutoring', 'event-planning'],
    jobs: ['internships', 'full-time', 'part-time', 'remote', 'contract'],
    community: ['events', 'classes', 'groups', 'lost+found', 'volunteers']
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border px-3 py-2 rounded" />
        <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full border px-3 py-2 rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border px-3 py-2 rounded" />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full border px-3 py-2 rounded" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full border px-3 py-2 rounded" />

        <select name="section" value={formData.section} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value="for-sale">For Sale</option>
          <option value="housing">Housing</option>
          <option value="services">Services</option>
          <option value="jobs">Jobs</option>
          <option value="community">Community</option>
        </select>

        <select name="category" value={formData.category} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          {(categoryOptions[formData.section] || []).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {formData.section === 'for-sale' && (
          <>
            <input name="year_built" type="number" value={formData.year_built || ''} onChange={handleChange} placeholder="Year Built" className="w-full border px-3 py-2 rounded" />
            <input name="make_model" value={formData.make_model || ''} onChange={handleChange} placeholder="Make/Model" className="w-full border px-3 py-2 rounded" />
            <input name="color" value={formData.color || ''} onChange={handleChange} placeholder="Color" className="w-full border px-3 py-2 rounded" />
            <input name="type" value={formData.type || ''} onChange={handleChange} placeholder="Type" className="w-full border px-3 py-2 rounded" />
            <input name="status" value={formData.status || ''} onChange={handleChange} placeholder="Status" className="w-full border px-3 py-2 rounded" />
          </>
        )}

        {formData.section === 'housing' && (
          <>
            <input name="bedrooms" type="number" value={formData.bedrooms || ''} onChange={handleChange} placeholder="Bedrooms" className="w-full border px-3 py-2 rounded" />
            <input name="sqft" type="number" value={formData.sqft || ''} onChange={handleChange} placeholder="Square Feet" className="w-full border px-3 py-2 rounded" />
          </>
        )}

        {formData.section === 'services' && (
          <>
            <input name="service_type" value={formData.service_type || ''} onChange={handleChange} placeholder="Service Type" className="w-full border px-3 py-2 rounded" />
            <input name="availability" value={formData.availability || ''} onChange={handleChange} placeholder="Availability" className="w-full border px-3 py-2 rounded" />
          </>
        )}

        {formData.section === 'jobs' && (
          <>
            <input name="job_type" value={formData.job_type || ''} onChange={handleChange} placeholder="Job Type" className="w-full border px-3 py-2 rounded" />
            <input name="salary" type="number" value={formData.salary || ''} onChange={handleChange} placeholder="Salary" className="w-full border px-3 py-2 rounded" />
          </>
        )}

        {formData.section === 'community' && (
          <>
            <input name="event_name" value={formData.event_name || ''} onChange={handleChange} placeholder="Event Name" className="w-full border px-3 py-2 rounded" />
            <input name="event_date" type="date" value={formData.event_date || ''} onChange={handleChange} placeholder="Event Date" className="w-full border px-3 py-2 rounded" />
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Listing
        </button>
      </form>
    </div>
  )
}

export default EditListing
