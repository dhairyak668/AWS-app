import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const CreateListing = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log("User inside CreateListing:", user)
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  try {
    console.log("Rendering CreateListing component...")
  } catch (err) {
    console.error("Error inside CreateListing:", err)
  }

  const initialFormData = {
    title: '',
    year_built: '',
    make_model: '',
    color: '',
    type: '',
    status: '',
    price: '',
    description: '',
    city: '',
    phone: '',
    section: 'for-sale',
    category: 'cars',
    bedrooms: '',
    square_footage: '',
    service_type: '',
    availability: '',
    job_type: '',
    salary: '',
    event_name: '',
    event_date: '',
  }

  const [formData, setFormData] = useState(initialFormData)

  const [error, setError] = useState('')

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

    try {
      let payload = {
        title: formData.title,
        price: formData.price,
        description: formData.description,
        city: formData.city,
        phone: formData.phone,
        section: formData.section,
        category: formData.category,
      };

      if (formData.section === 'for-sale') {
        payload.year_built = formData.year_built;
        payload.make_model = formData.make_model;
        payload.color = formData.color;
        payload.type = formData.type;
        payload.status = formData.status;
      } else if (formData.section === 'housing') {
        payload.bedrooms = formData.bedrooms;
        payload.square_footage = formData.square_footage;
      } else if (formData.section === 'services') {
        payload.service_type = formData.service_type;
        payload.availability = formData.availability;
      } else if (formData.section === 'jobs') {
        payload.job_type = formData.job_type;
        payload.salary = formData.salary;
      } else if (formData.section === 'community') {
        payload.event_name = formData.event_name;
        payload.event_date = formData.event_date;
      }

      await axios.post('http://localhost:5001/api/listings', payload, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      navigate(`/my-listings`)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Error creating listing')
    }
  }

  const handleClear = () => {
    setFormData(initialFormData)
    setError('')
  }

  const categoryOptions = {
    'for-sale': ['cars', 'motorcycles', 'boats', 'books', 'furniture'],
    housing: ['apartments', 'rooms', 'houses', 'condos', 'sublets'],
    services: ['repair', 'cleaning', 'moving', 'tutoring', 'event-planning'],
    jobs: ['internships', 'full-time', 'part-time', 'remote', 'contract'],
    community: ['events', 'classes', 'groups', 'lost+found', 'volunteers']
  }

  // Dynamic placeholders for for-sale section based on category
  const getTypePlaceholder = () => {
    if (formData.section !== 'for-sale') return "Type (e.g., Sedan, Boat, Sofa)";
    switch(formData.category) {
      case 'cars':
        return "Type (e.g., Sedan, SUV, Coupe)";
      case 'motorcycles':
        return "Type (e.g., Cruiser, Sportbike)";
      case 'boats':
        return "Type (e.g., Sailboat, Yacht)";
      case 'books':
        return "Type (e.g., Paperback, Hardcover)";
      case 'furniture':
        return "Type (e.g., Sofa, Table)";
      default:
        return "Type (e.g., Sedan, Boat, Sofa)";
    }
  }

  const getMakeModelPlaceholder = () => {
    if (formData.section !== 'for-sale') return "Make / Model";
    switch(formData.category) {
      case 'cars':
        return "Make / Model (e.g., Toyota Corolla)";
      case 'motorcycles':
        return "Make / Model (e.g., Harley Davidson)";
      case 'boats':
        return "Make / Model (e.g., Bayliner 175)";
      case 'books':
        return "Make / Model (e.g., Title / Author)";
      case 'furniture':
        return "Make / Model (e.g., Brand / Model)";
      default:
        return "Make / Model";
    }
  }

  const getStatusPlaceholder = () => {
    if (formData.section !== 'for-sale') return "Condition";
    switch(formData.category) {
      case 'cars':
        return "Condition (e.g., New, Used)";
      case 'motorcycles':
        return "Condition (e.g., New, Used)";
      case 'boats':
        return "Condition (e.g., New, Used)";
      case 'books':
        return "Condition (e.g., New, Used)";
      case 'furniture':
        return "Condition (e.g., New, Used)";
      default:
        return "Condition";
    }
  }

  const getBedroomsPlaceholder = () => {
    if (formData.section !== 'housing') return "Number of Bedrooms";
    switch(formData.category) {
      case 'apartments':
        return "Number of Bedrooms";
      case 'rooms':
        return "Number of Bedrooms";
      case 'houses':
        return "Number of Bedrooms";
      case 'condos':
        return "Number of Bedrooms";
      case 'sublets':
        return "Number of Bedrooms";
      default:
        return "Number of Bedrooms";
    }
  }

  const getSquareFootagePlaceholder = () => {
    if (formData.section !== 'housing') return "Square Footage";
    switch(formData.category) {
      case 'apartments':
        return "Square Footage";
      case 'rooms':
        return "Square Footage";
      case 'houses':
        return "Square Footage";
      case 'condos':
        return "Square Footage";
      case 'sublets':
        return "Square Footage";
      default:
        return "Square Footage";
    }
  }

  const getServiceTypePlaceholder = () => {
    if (formData.section !== 'services') return "Service Type";
    switch(formData.category) {
      case 'repair':
        return "Service Type (e.g., Plumbing, Electrical)";
      case 'cleaning':
        return "Service Type (e.g., House Cleaning, Carpet Cleaning)";
      case 'moving':
        return "Service Type (e.g., Local, Long Distance)";
      case 'tutoring':
        return "Service Type (e.g., Math, Science)";
      case 'event-planning':
        return "Service Type (e.g., Wedding, Corporate)";
      default:
        return "Service Type (e.g., Plumbing, Lawn Care)";
    }
  }

  const getAvailabilityPlaceholder = () => {
    if (formData.section !== 'services') return "Availability";
    switch(formData.category) {
      case 'repair':
        return "Availability (e.g., Weekdays, Weekends)";
      case 'cleaning':
        return "Availability (e.g., Weekdays, Weekends)";
      case 'moving':
        return "Availability (e.g., Weekdays, Weekends)";
      case 'tutoring':
        return "Availability (e.g., Evenings, Weekends)";
      case 'event-planning':
        return "Availability (e.g., Flexible)";
      default:
        return "Availability";
    }
  }

  const getJobTypePlaceholder = () => {
    if (formData.section !== 'jobs') return "Job Type";
    switch(formData.category) {
      case 'internships':
        return "Job Type (e.g., Summer, Part-Time)";
      case 'full-time':
        return "Job Type (e.g., Permanent)";
      case 'part-time':
        return "Job Type (e.g., Temporary)";
      case 'remote':
        return "Job Type (e.g., Work from Home)";
      case 'contract':
        return "Job Type (e.g., Freelance)";
      default:
        return "Job Type (e.g., Internship, Full-Time)";
    }
  }

  const getEventNamePlaceholder = () => {
    if (formData.section !== 'community') return "Event Name";
    switch(formData.category) {
      case 'events':
        return "Event Name (e.g., Book Fair)";
      case 'classes':
        return "Event Name (e.g., Yoga Class)";
      case 'groups':
        return "Event Name (e.g., Hiking Group)";
      case 'lost+found':
        return "Event Name (e.g., Lost Dog)";
      case 'volunteers':
        return "Event Name (e.g., Beach Cleanup)";
      default:
        return "Event Name (e.g., Book Fair)";
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create a New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" onChange={handleChange} value={formData.title} placeholder="Title" className="w-full border px-3 py-2 rounded" />
        {formData.section === 'for-sale' && (
          <>
            <input name="year_built" type="number" onChange={handleChange} value={formData.year_built} placeholder="Year Built" className="w-full border px-3 py-2 rounded" />
            <input name="make_model" onChange={handleChange} value={formData.make_model} placeholder={getMakeModelPlaceholder()} className="w-full border px-3 py-2 rounded" />
            <input name="color" onChange={handleChange} value={formData.color} placeholder="Color" className="w-full border px-3 py-2 rounded" />
            <input name="type" onChange={handleChange} value={formData.type} placeholder={getTypePlaceholder()} className="w-full border px-3 py-2 rounded" />
            <input name="status" onChange={handleChange} value={formData.status} placeholder={getStatusPlaceholder()} className="w-full border px-3 py-2 rounded" />
          </>
        )}
        {formData.section === 'housing' && (
          <>
            <input name="bedrooms" type="number" onChange={handleChange} value={formData.bedrooms} placeholder={getBedroomsPlaceholder()} className="w-full border px-3 py-2 rounded" />
            <input name="square_footage" type="number" onChange={handleChange} value={formData.square_footage} placeholder={getSquareFootagePlaceholder()} className="w-full border px-3 py-2 rounded" />
          </>
        )}
        {formData.section === 'services' && (
          <>
            <input name="service_type" onChange={handleChange} value={formData.service_type} placeholder={getServiceTypePlaceholder()} className="w-full border px-3 py-2 rounded" />
            <input name="availability" onChange={handleChange} value={formData.availability} placeholder={getAvailabilityPlaceholder()} className="w-full border px-3 py-2 rounded" />
          </>
        )}
        {formData.section === 'jobs' && (
          <>
            <input name="job_type" onChange={handleChange} value={formData.job_type} placeholder={getJobTypePlaceholder()} className="w-full border px-3 py-2 rounded" />
            <input name="salary" type="number" onChange={handleChange} value={formData.salary} placeholder="Salary" className="w-full border px-3 py-2 rounded" />
          </>
        )}
        {formData.section === 'community' && (
          <>
            <input name="event_name" onChange={handleChange} value={formData.event_name} placeholder={getEventNamePlaceholder()} className="w-full border px-3 py-2 rounded" />
            <input name="event_date" type="date" onChange={handleChange} value={formData.event_date} placeholder="Event Date" className="w-full border px-3 py-2 rounded" />
          </>
        )}
        <input name="price" type="number" onChange={handleChange} value={formData.price} placeholder="Price" className="w-full border px-3 py-2 rounded" />
        <textarea name="description" onChange={handleChange} value={formData.description} placeholder="Description" className="w-full border px-3 py-2 rounded" />
        <input name="city" onChange={handleChange} value={formData.city} placeholder="City" className="w-full border px-3 py-2 rounded" />
        <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Phone Number" className="w-full border px-3 py-2 rounded" />

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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit Listing
          </button>
          <button type="button" onClick={handleClear} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
            Clear Form
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateListing