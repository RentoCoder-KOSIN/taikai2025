import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, fetchCategories } from '../api'

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('すべて');
    const [sortBy, setSortBy] = useState('new');

    useEffect(() => {
        const load = async () => {
            const [postsData, categoriesData] = await Promise.all([
                fetchPosts(),
                fetchCategories()
            ])
            setPosts(postsData);
            setCategories(['すべて', ...categoriesData.map(c => c.name)]);
        }
        load()
    }, []);

    const filteredPosts = posts.filter(post => {
        if (!searchTerm) return true;
        return (
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }).filter(post => {
        if (selectedCategory === 'すべて') return true;
        return post.category === selectedCategory;
    }).sort((a, b) => {
        if (sortBy === 'likes') return b.likes - a.likes;
        return new Date(b.createdAt) - new Date(a.createdAt);
    })
    return (
        <div>
          <div className="page-header">
            <h1>香川県民コミュニティ</h1>
            <Link to="/posts/new" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px' }}>新規投稿</Link>
          </div>
      
          <div className="search-box">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="検索..."
            />
          </div>
      
          <div className="tab-list">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`tab ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
      
          <div className="sort-list">
            <button onClick={() => setSortBy('new')} className={`sort-btn ${sortBy === 'new' ? 'active' : ''}`}>新着順</button>
            <button onClick={() => setSortBy('likes')} className={`sort-btn ${sortBy === 'likes' ? 'active' : ''}`}>いいね数順</button>
          </div>
      
          {filteredPosts.length === 0 ? (
            <p className="empty-message">検索結果が見つかりませんでした</p>
          ) : (
            filteredPosts.map(post => (
              <Link to={`/posts/${post.id}`} key={post.id}>
                <div className="post-card">
                  <span className="post-category">{post.category}</span>
                  <h3 className="post-title">{post.title}</h3>
                  {post.imageUrl && <img src={post.imageUrl} alt="" className="post-image" />}
                  <div className="post-meta">
                    <span>👤 {post.author}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.commentCount || 0}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )
}