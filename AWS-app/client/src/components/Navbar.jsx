import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()

  console.log("Navbar user:", user)
  useEffect(() => {
    console.log("User changed in Navbar:", user)
  }, [user])
  
  return (
    <nav className="bg-gray-950 shadow-lg py-6 px-8 w-full flex flex-wrap justify-between items-center rounded-b-lg">
      <Link to="/" className="text-2xl font-semibold text-white transition-colors duration-300 hover:text-blue-400 mb-2 md:mb-0">Craigslist Clone</Link>

      <div className="flex flex-wrap space-x-6 items-center">
        {!user ? (
          <>
            <Link to="/login" className="text-lg text-blue-400 hover:text-blue-600 transition-colors duration-300 rounded-lg px-3 py-2 hover:bg-gray-800 mb-2 md:mb-0">Login</Link>
            <Link to="/signup" className="text-lg text-blue-400 hover:text-blue-600 transition-colors duration-300 rounded-lg px-3 py-2 hover:bg-gray-800 mb-2 md:mb-0">Signup</Link>
          </>
        ) : (
          <>
            <span className="text-lg text-white w-full md:w-auto mb-2 md:mb-0">Welcome, {user.name}</span>
            <div className="flex flex-wrap space-x-6 items-center">
              <Link to="/create" className="text-lg text-green-400 hover:text-green-600 transition-colors duration-300 rounded-lg px-3 py-2 hover:bg-gray-800 mb-2 md:mb-0">Create Listing</Link>
              <Link to="/my-listings" className="text-lg text-green-400 hover:text-green-600 transition-colors duration-300 rounded-lg px-3 py-2 hover:bg-gray-800 mb-2 md:mb-0">My Listings</Link>
              <button onClick={logout} className="text-lg text-red-500 hover:text-red-700 transition-colors duration-300 rounded-lg px-3 py-2 hover:bg-gray-800 mb-2 md:mb-0">Logout</button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar