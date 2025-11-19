import { useState } from 'react'

function SubmitFeedback() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Other',
    tags: '',
    contactEmail: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : []

      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: tagsArray
      }

      if (formData.contactEmail) {
        payload.contactEmail = formData.contactEmail
      }

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Feedback submitted successfully!')
        setFormData({
          title: '',
          content: '',
          category: 'Other',
          tags: '',
          contactEmail: ''
        })
      } else {
        setMessage(data.message || 'Error submitting feedback')
      }
    } catch (error) {
      setMessage('Error submitting feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2>Submit Anonymous Feedback</h2>
      {message && (
        <div className={message.includes('success') ? 'success' : 'error'}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={150}
            placeholder="Enter feedback title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Describe your feedback, complaint, or suggestion"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Canteen">Canteen</option>
            <option value="Academics">Academics</option>
            <option value="Hostel">Hostel</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated, optional)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., wifi, urgent, maintenance"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactEmail">Contact Email (optional)</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Only used if admin needs to contact you"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}

export default SubmitFeedback



