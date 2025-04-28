import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateListing from './pages/CreateListing'
import CategoryPage from './pages/CategoryPage'
import SectionPage from './pages/SectionPage'
import MyListings from './pages/MyListings'
import EditListing from './pages/EditListing'

const ErrorBoundary = ({ children }) => {
  try {
    return children
  } catch (err) {
    console.error('Error caught in ErrorBoundary:', err)
    return <div className="text-red-500">Something went wrong while rendering.</div>
  }
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<ErrorBoundary><CreateListing /></ErrorBoundary>} />
        <Route path="/category/:section/:category" element={<CategoryPage />} />
        <Route path="/section/:section" element={<SectionPage />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/edit/:id" element={<EditListing />} />
      </Routes>
    </Router>
  )
}

export default App