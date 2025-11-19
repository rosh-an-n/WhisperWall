import { useState, useEffect } from 'react'

function FeedbackFeed() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const fetchFeedback = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      if (search) params.append('search', search)
      if (category) params.append('category', category)

      const response = await fetch(`/api/feedback?${params}`)
      const data = await response.json()

      if (data.success) {
        setFeedback(data.data.feedback)
        setTotalPages(data.data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [page, search, category])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchFeedback()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const getStatusClass = (status) => {
    return `status-${status.replace('-', '-')}`
  }

  return (
    <div>
      <h2>Public Feedback Feed</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1 }}>
          <input
            type="text"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">All Categories</option>
            <option value="Canteen">Canteen</option>
            <option value="Academics">Academics</option>
            <option value="Hostel">Hostel</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" className="btn">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading feedback...</div>
      ) : feedback.length === 0 ? (
        <div className="feedback-card">
          <p>No feedback found.</p>
        </div>
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
                {item.tags && item.tags.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Tags:</strong> {item.tags.join(', ')}
                  </div>
                )}
                {item.replies && item.replies.length > 0 && (
                  <div className="replies-section">
                    <strong>Replies:</strong>
                    {item.replies.map((reply, idx) => (
                      <div key={idx} className="reply">
                        <div className="reply-meta">
                          {formatDate(reply.createdAt)}
                        </div>
                        <div>{reply.message}</div>
                      </div>
                    ))}
                  </div>
                )}
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
  )
}

export default FeedbackFeed



