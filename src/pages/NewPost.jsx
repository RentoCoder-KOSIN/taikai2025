import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCategories, createPost } from '../api'

export default function NewPost() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await fetchCategories()
      setCategories(data)
    }
    load()
  }, [])

  const isFormValid = title.trim() && content.trim() && author.trim() && category

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return
    setIsSubmitting(true)
    const res = await createPost({ title, content, author, category, imageUrl })
    if (res.ok) {
      alert('投稿が作成されました')
      navigate('/')
    }
    setIsSubmitting(false)
  }

  return (
    <div>
      <button className="btn-secondary" onClick={() => navigate('/')}>戻る</button>
      <h2 style={{ margin: '16px 0' }}>新規投稿</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>タイトル *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            required
          />
        </div>
        <div className="form-group">
          <label>内容 *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="内容を入力"
            required
          />
        </div>
        <div className="form-group">
          <label>投稿者名 *</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="投稿者名を入力"
            required
          />
        </div>
        <div className="form-group">
          <label>カテゴリ *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">選択してください</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>画像URL（任意）</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>
        <button
          type="submit"
          className="btn-submit"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </button>
      </form>
    </div>
  )
}