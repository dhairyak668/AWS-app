import { useParams, Link } from 'react-router-dom'

const categoryMap = {
  'for-sale': ['cars', 'motorcycles', 'boats', 'books', 'furniture'],
  'housing': ['apartments', 'rooms', 'houses', 'condos', 'sublets'],
  'services': ['repair', 'cleaning', 'moving', 'tutoring', 'event-planning'],
  'jobs': ['internships', 'full-time', 'part-time', 'remote', 'contract'],
  'community': ['events', 'classes', 'groups', 'lost+found', 'volunteers']
}

const SectionPage = () => {
  const { section } = useParams()
  const categories = categoryMap[section] || []

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-extrabold mb-8 capitalize tracking-wide">{section.replace('-', ' ')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map(category => (
          <Link
            key={category}
            to={`/category/${section}/${category}`}
            className="p-8 bg-gray-900 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 hover:shadow-[0_0_15px_2px_rgba(59,130,246,0.7)] transition-all duration-300"
          >
            <h2 className="text-xl font-semibold capitalize tracking-wide">{category.replace('+', ' ')}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SectionPage