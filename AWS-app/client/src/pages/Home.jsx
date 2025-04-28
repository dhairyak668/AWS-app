import { Link } from 'react-router-dom'
import { Sparkles, Home as HomeIcon, Briefcase, Users, Store, Wrench } from 'lucide-react'

const sections = [
  { name: 'For Sale', slug: 'for-sale', description: 'Buy and sell everything from cars to furniture.', icon: Store, color: 'bg-blue-700 text-black' },
  { name: 'Housing', slug: 'housing', description: 'Find apartments, roommates, and real estate deals.', icon: HomeIcon, color: 'bg-green-700 text-black' },
  { name: 'Services', slug: 'services', description: 'Local repair, cleaning, and professional services.', icon: Wrench, color: 'bg-orange-700 text-black' },
  { name: 'Jobs', slug: 'jobs', description: 'Apply for internships, remote work, or full-time gigs.', icon: Briefcase, color: 'bg-purple-700 text-black' },
  { name: 'Community', slug: 'community', description: 'Connect through events, classes, and groups.', icon: Users, color: 'bg-pink-700 text-black' }
]

const Home = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-mosaic.png'), linear-gradient(to bottom, #1a202c, #2d3748, #1a202c)"}}>
      <div className="absolute inset-0 opacity-30 pointer-events-none"></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Sparkles className="h-12 w-12 text-yellow-400 drop-shadow-[0_0_10px_rgba(252,211,77,0.7)] animate-pulse motion-safe:animate-bounce" />
        </div>
        <h1 className="text-6xl font-extrabold mb-6 text-yellow-400 drop-shadow-[0_0_25px_rgba(252,211,77,1)] font-serif">
          Welcome to Listly
        </h1>
        <p className="text-lg text-gray-300 mb-16 tracking-wide">Your trusted platform for curated local listings</p>
      </div>

      <div className="relative max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {sections.map(({ name, slug, description, icon: Icon, color }) => (
          <Link
            key={slug}
            to={`/section/${slug}`}
            className={`group bg-gray-900 rounded-3xl shadow-lg p-8 border border-transparent hover:border-yellow-400 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_15px_2px_rgba(252,211,77,0.5)] flex flex-col items-start space-y-4 visited:text-white`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 ${color} drop-shadow-[0_0_6px_rgba(252,211,77,0.6)] text-shadow-lg group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-pink-500 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(252,211,77,0.8)] transition-all duration-300`}> 
              <Icon className="w-7 h-7 text-current" />
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(252,211,77,0.8)] transition-colors duration-300 group-hover:text-white">
              {name}
            </h2>
            <p className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">{description}</p>
            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400 flex items-center space-x-1">
              <span className="inline-block transform group-hover:translate-x-2 transition-transform animate-pulse">→</span>
              <span className="inline-block transform group-hover:translate-x-3 transition-transform animate-pulse">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
