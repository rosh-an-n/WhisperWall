import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    startDate: '',
    endDate: ''
  })
  const [replyMessage, setReplyMessage] = useState('')
  const [replyPublic, setReplyPublic] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchFeedback()
  }, [page, filters])

  const fetchFeedback = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      if (filters.category) params.append('category', filters.category)
      if (filters.status) params.append('status', filters.status)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const response = await fetch(`/api/admin/feedback?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setFeedback(data.data.feedback)
        setTotalPages(data.data.pagination.pages)
      } else if (data.message?.includes('token') || data.message?.includes('Access denied')) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeedbackDetails = async (id) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/feedback/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setSelectedFeedback(data.data)
      }
    } catch (error) {
      console.error('Error fetching feedback details:', error)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/feedback/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Status updated successfully')
        fetchFeedback()
        if (selectedFeedback && selectedFeedback._id === id) {
          fetchFeedbackDetails(id)
        }
      } else {
        setMessage(data.message || 'Error updating status')
      }
    } catch (error) {
      setMessage('Error updating status')
    }
  }

  const handleAddReply = async (id) => {
    if (!replyMessage.trim()) {
      setMessage('Reply message is required')
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/feedback/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: replyMessage,
          public: replyPublic
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Reply added successfully')
        setReplyMessage('')
        setReplyPublic(false)
        fetchFeedbackDetails(id)
      } else {
        setMessage(data.message || 'Error adding reply')
      }
    } catch (error) {
      setMessage('Error adding reply')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Feedback deleted successfully')
        fetchFeedback()
        if (selectedFeedback && selectedFeedback._id === id) {
          setSelectedFeedback(null)
        }
      } else {
        setMessage(data.message || 'Error deleting feedback')
      }
    } catch (error) {
      setMessage('Error deleting feedback')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const getStatusClass = (status) => {
    return `status-${status.replace('-', '-')}`
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>

      {message && (
        <div className={message.includes('success') ? 'success' : 'error'}>
          {message}
        </div>
      )}

      <div className="admin-dashboard">
        <div className="filters">
          <select
            value={filters.category}
            onChange={(e) => {
              setFilters({ ...filters, category: e.target.value })
              setPage(1)
            }}
          >
            <option value="">All Categories</option>
            <option value="Canteen">Canteen</option>
            <option value="Academics">Academics</option>
            <option value="Hostel">Hostel</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value })
              setPage(1)
            }}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => {
              setFilters({ ...filters, startDate: e.target.value })
              setPage(1)
            }}
            placeholder="Start Date"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => {
              setFilters({ ...filters, endDate: e.target.value })
              setPage(1)
            }}
            placeholder="End Date"
          />
        </div>

        {loading ? (
          <div className="loading">Loading feedback...</div>
        ) : feedback.length === 0 ? (
          <p>No feedback found.</p>
        ) : (
          <>
            <div className="feedback-list">
              {feedback.map((item) => (
                <div key={item._id} className="feedback-card">
                  <h3>{item.title}</h3>
                  <div className="feedback-meta">
                    <span className="category-badge">{item.category}</span>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <p>{item.content}</p>
                  {item.contactEmail && (
                    <p><strong>Contact Email:</strong> {item.contactEmail}</p>
                  )}
                  <div className="admin-actions">
                    <button
                      onClick={() => fetchFeedbackDetails(item._id)}
                      className="btn"
                    >
                      View Details
                    </button>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={page === i + 1 ? 'active' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedFeedback && (
        <div className="admin-dashboard" style={{ marginTop: '30px' }}>
          <h3>Feedback Details</h3>
          <div className="feedback-card">
            <h3>{selectedFeedback.title}</h3>
            <div className="feedback-meta">
              <span className="category-badge">{selectedFeedback.category}</span>
              <span className={`status-badge ${getStatusClass(selectedFeedback.status)}`}>
                {selectedFeedback.status}
              </span>
              <span>{formatDate(selectedFeedback.createdAt)}</span>
            </div>
            <p>{selectedFeedback.content}</p>
            {selectedFeedback.contactEmail && (
              <p><strong>Contact Email:</strong> {selectedFeedback.contactEmail}</p>
            )}
            {selectedFeedback.tags && selectedFeedback.tags.length > 0 && (
              <p><strong>Tags:</strong> {selectedFeedback.tags.join(', ')}</p>
            )}

            {selectedFeedback.replies && selectedFeedback.replies.length > 0 && (
              <div className="replies-section">
                <h4>Replies ({selectedFeedback.replies.length})</h4>
                {selectedFeedback.replies.map((reply, idx) => (
                  <div key={idx} className="reply">
                    <div className="reply-meta">
                      {formatDate(reply.createdAt)} - {reply.public ? 'Public' : 'Private'}
                    </div>
                    <div>{reply.message}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <h4>Add Reply</h4>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Enter your reply..."
                style={{ width: '100%', minHeight: '100px', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={replyPublic}
                    onChange={(e) => setReplyPublic(e.target.checked)}
                  />
                  Make reply public
                </label>
              </div>
              <button
                onClick={() => handleAddReply(selectedFeedback._id)}
                className="btn btn-success"
              >
                Add Reply
              </button>
            </div>

            <button
              onClick={() => setSelectedFeedback(null)}
              className="btn"
              style={{ marginTop: '20px' }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard



