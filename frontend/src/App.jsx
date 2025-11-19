import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SubmitFeedback from './pages/SubmitFeedback'
import FeedbackFeed from './pages/FeedbackFeed'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Router>
      <div>
        <header>
          <div className="container">
            <h1>WhisperWall</h1>
            <p style={{ textAlign: 'center', marginTop: '10px', opacity: 0.9 }}>
              Anonymous College Feedback System
            </p>
            <nav>
              <Link to="/">Submit Feedback</Link>
              <Link to="/feed">Public Feed</Link>
              <Link to="/admin/login">Admin Login</Link>
            </nav>
          </div>
        </header>

        <div className="container">
          <Routes>
            <Route path="/" element={<SubmitFeedback />} />
            <Route path="/feed" element={<FeedbackFeed />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App



