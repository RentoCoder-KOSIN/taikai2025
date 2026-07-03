import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import NewPost from './pages/NewPost';
function App() {
  return (
    <BrowserRouter>
      <div style={{ width: '500px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/new" element={<NewPost />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;