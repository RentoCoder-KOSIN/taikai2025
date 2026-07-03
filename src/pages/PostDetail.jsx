import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPost } from '../api'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const load = async () => {
      const data = await fetchPost(id)
      setPost(data)
    }
    load()
  }, [id])

  if (!post) return <p>読み込み中...</p>

  return (
    <div>
      <button className="btn-secondary" onClick={() => navigate('/')}>戻る</button>

      <div className="detail-card">
        <span className="post-category">{post.category}</span>
        <h2 className="post-title">{post.title}</h2>
        <div className="post-meta">
          <span>👤 {post.author}</span>
          <span>❤️ {post.likes}</span>
        </div>
        {post.imageUrl && <img src={post.imageUrl} alt="" className="post-image" />}
        <p className="post-content">{post.content}</p>
      </div>

      <div style={{ marginTop: '24px' }}>
        <h3>コメント</h3>
        {post.comments?.length === 0 ? (
          <p className="empty-message">コメントがありません</p>
        ) : (
          post.comments?.map(comment => (
            <div key={comment.id} className="comment-card">
              <p className="comment-author">{comment.author}</p>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}