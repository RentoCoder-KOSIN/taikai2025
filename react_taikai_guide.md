# 香川県民コミュニティサイト - React実装 完全解説

React・JS初心者でも「なぜこう書くのか」まで理解できるように解説します。

---

## 全体の構成

```
src/
├── main.jsx          ← Reactのエントリーポイント
├── App.jsx           ← ルーティング設定
├── api.js            ← API通信関数
├── index.css         ← 全体のスタイル
└── pages/
    ├── Home.jsx      ← ホーム画面（投稿一覧・検索・フィルタ）
    ├── PostDetail.jsx ← 投稿詳細画面
    └── NewPost.jsx   ← 新規投稿画面
```

---

## api.js — API通信の関数まとめ

```js
const BASE_URL = '/api'

export const fetchPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts`)
  return res.json()
}
```

### なぜこう書くの？

**`async/await`** は「時間のかかる処理が終わるまで待つ」ための書き方です。
APIからデータを取ってくるのは時間がかかるので、`await` をつけないと
データが届く前に次の処理が走ってしまいます。

```js
// ❌ awaitなし → dataが空のまま次に進んでしまう
const res = fetch('/api/posts')
const data = res.json()  // エラー！

// ✅ awaitあり → データが届いてから次に進む
const res = await fetch('/api/posts')
const data = await res.json()
```

**`export`** をつけることで、他のファイルから `import` して使えるようになります。

**`${BASE_URL}/posts`** はテンプレートリテラルといい、変数を文字列の中に埋め込む書き方です。
`` `/api/posts` `` と同じ意味ですが、BASE_URLを変えるだけで全APIのURLをまとめて変更できます。

---

## App.jsx — ルーティング設定

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import NewPost from './pages/NewPost'

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

export default App
```

### なぜこう書くの？

**`BrowserRouter`** はURLを見て「どの画面を表示するか」を管理する仕組みです。
これで囲むことで、アプリ全体でURLベースのページ切り替えができるようになります。

**`Route`** はURLのパターンと表示するコンポーネントをセットで定義します。
- `path="/"` → ホーム画面
- `path="/posts/:id"` → `:id` の部分は変数。`/posts/1` でも `/posts/42` でもマッチします
- `path="/posts/new"` → 新規投稿画面

**`width: '500px', margin: '0 auto'`** は課題の要件「横幅500px、画面中央」を実現するCSSです。
`margin: '0 auto'` で左右の余白が均等になり、中央に配置されます。

---

## Home.jsx — ホーム画面

```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts, fetchCategories } from '../api'

export default function Home() {
  // ① stateの定義
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [sortBy, setSortBy] = useState('new')

  // ② ページ読み込み時にAPIからデータ取得
  useEffect(() => {
    const load = async () => {
      const [postsData, categoriesData] = await Promise.all([
        fetchPosts(),
        fetchCategories()
      ])
      setPosts(postsData)
      setCategories(['すべて', ...categoriesData.map(c => c.name)])
    }
    load()
  }, [])

  // ③ 検索 → カテゴリ → 並び替えの順でフィルタリング
  const filteredPosts = posts
    .filter(post => {
      if (!searchTerm) return true
      return (
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    .filter(post => {
      if (selectedCategory === 'すべて') return true
      return post.category === selectedCategory
    })
    .sort((a, b) => {
      if (sortBy === 'likes') return b.likes - a.likes
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <div>
      {/* ヘッダー */}
      <div className="page-header">
        <h1>香川県民コミュニティ</h1>
        <Link to="/posts/new" className="btn-primary">新規投稿</Link>
      </div>

      {/* 検索 */}
      <div className="search-box">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="検索..."
        />
      </div>

      {/* カテゴリタブ */}
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

      {/* 並び替え */}
      <div className="sort-list">
        <button onClick={() => setSortBy('new')} className={`sort-btn ${sortBy === 'new' ? 'active' : ''}`}>
          新着順
        </button>
        <button onClick={() => setSortBy('likes')} className={`sort-btn ${sortBy === 'likes' ? 'active' : ''}`}>
          いいね数順
        </button>
      </div>

      {/* 投稿一覧 */}
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
```

### なぜこう書くの？

#### ① useState — 変化する値を記憶する

```jsx
const [posts, setPosts] = useState([])
```

`useState` は「変化する値」を記憶するHookです。
- `posts` → 現在の値
- `setPosts` → 値を更新する関数
- `[]` → 初期値（最初は空の配列）

値が変わるたびにReactが自動で画面を更新します。

#### ② useEffect + Promise.all — 初回にAPIを呼ぶ

```jsx
useEffect(() => {
  const load = async () => {
    const [postsData, categoriesData] = await Promise.all([
      fetchPosts(),
      fetchCategories()
    ])
    setPosts(postsData)
    setCategories(['すべて', ...categoriesData.map(c => c.name)])
  }
  load()
}, [])  // ← [] = 最初の1回だけ実行
```

**`useEffect`** はコンポーネントが表示されたときに実行されます。
`[]` を渡すと「最初の1回だけ実行」という意味になります。

**`Promise.all`** は複数のAPIを「同時に」呼び出して、両方終わったら次に進む書き方です。
1つずつ順番に呼ぶより速く処理できます。

**`['すべて', ...categoriesData.map(c => c.name)]`** の意味：
- `categoriesData.map(c => c.name)` → カテゴリオブジェクトの配列からname（文字列）だけ取り出す
- `['すべて', ...]` → 先頭に「すべて」を追加する

#### ③ filter + sort — 絞り込みと並び替え

```jsx
const filteredPosts = posts
  .filter(post => {
    if (!searchTerm) return true  // 検索ワードなし → 全件
    return (
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })
```

**`filter`** は条件に合う要素だけ残した新しい配列を返します。
`true` を返すと残す、`false` を返すと除外します。

**`toLowerCase().includes()`** は大文字・小文字を区別しない部分一致検索です。
「React」でも「react」でも「REACT」でもヒットするようになります。

```jsx
.sort((a, b) => {
  if (sortBy === 'likes') return b.likes - a.likes  // いいね降順
  return new Date(b.createdAt) - new Date(a.createdAt)  // 日付降順
})
```

**`sort`** の `(a, b)` は2つの要素を比較します。
- `b - a` → 大きい順（降順）
- `a - b` → 小さい順（昇順）

#### JSXのポイント

```jsx
{filteredPosts.length === 0 ? (
  <p>検索結果が見つかりませんでした</p>
) : (
  filteredPosts.map(post => (
    <Link to={`/posts/${post.id}`} key={post.id}>
      ...
    </Link>
  ))
)}
```

**`条件 ? A : B`** は三項演算子。条件が true なら A、false なら B を表示します。

**`map()`** は配列の各要素をJSXに変換してリスト表示します。

**`key={post.id}`** はReactがリストの各要素を識別するために必須です。ないと警告が出ます。

```jsx
{post.imageUrl && <img src={post.imageUrl} alt="" />}
```

**`条件 && JSX`** は「条件が true のときだけ表示する」パターンです。
画像URLがある場合だけ `<img>` を表示します。

```jsx
className={`tab ${selectedCategory === cat ? 'active' : ''}`}
```

選択中のタブに `active` クラスを動的に付けるパターンです。
CSSで `.tab.active` のスタイルを定義しておけば、選択中だけスタイルが変わります。

---

## PostDetail.jsx — 投稿詳細画面

```jsx
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
```

### なぜこう書くの？

#### useParams — URLからIDを取得する

```jsx
const { id } = useParams()
// URL: /posts/42 → id = "42"（文字列）
```

`useParams` はURLの `:id` 部分を取り出します。
`App.jsx` で `path="/posts/:id"` と定義したので、その `:id` の値が取れます。

#### useNavigate — プログラムからページ移動

```jsx
const navigate = useNavigate()
navigate('/')  // ホームに移動
```

ボタンを押したときにページ移動したいときに使います。
`<Link>` はクリックできるリンク、`useNavigate` はJSのコードから移動するときに使います。

#### useEffectの依存配列に [id] を指定する理由

```jsx
useEffect(() => {
  // idを使ってデータ取得
}, [id])  // ← idが変わったら再実行
```

`[]` にすると最初の1回だけ実行されます。
`[id]` にすると、URLのidが変わるたびに再実行されます。
詳細画面から別の投稿の詳細に移動したとき、新しいidでデータを取得するために必要です。

#### null チェック

```jsx
if (!post) return <p>読み込み中...</p>
```

データを取得中は `post` が `null` です。
`null` のまま `post.title` などを使おうとするとエラーになるので、
データが来るまで「読み込み中」を表示します。

#### オプショナルチェーン

```jsx
post.comments?.length
post.comments?.map(...)
```

`?.` は「nullやundefinedでもエラーにしない」演算子です。
`post.comments` が `undefined` の場合、`post.comments.length` はエラーになりますが、
`post.comments?.length` は `undefined` を返してエラーになりません。

---

## NewPost.jsx — 新規投稿画面

```jsx
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

  // 必須項目が全部入力されているか確認
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
```

### なぜこう書くの？

#### フォームの状態管理パターン

```jsx
const [title, setTitle] = useState('')

<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

これが「制御されたコンポーネント」パターンです。
- `value={title}` → inputの表示内容をstateで制御する
- `onChange={(e) => setTitle(e.target.value)}` → 入力があるたびにstateを更新する

これにより、常に `title` の値がinputの内容と同期します。

#### バリデーション

```jsx
const isFormValid = title.trim() && content.trim() && author.trim() && category
```

**`trim()`** は前後の空白を取り除きます。
スペースだけ入力されても無効にするために必要です。

**`&&`** はAND条件。全部が truthy（空文字でない）ときだけ `isFormValid` が true になります。

```jsx
<button disabled={!isFormValid || isSubmitting}>
  {isSubmitting ? '投稿中...' : '投稿する'}
</button>
```

- `disabled={!isFormValid}` → フォームが無効なときボタンを押せなくする
- `{isSubmitting ? '投稿中...' : '投稿する'}` → 送信中はラベルを変える

#### フォーム送信処理

```jsx
const handleSubmit = async (e) => {
  e.preventDefault()  // ← これが重要！
  ...
}
```

**`e.preventDefault()`** はフォームのデフォルト動作（ページのリロード）をキャンセルします。
これがないとページがリロードされてしまいます。

```jsx
setIsSubmitting(true)
const res = await createPost(...)
if (res.ok) {
  alert('投稿が作成されました')
  navigate('/')
}
setIsSubmitting(false)
```

送信中フラグを `true` にしてボタンを無効化 → APIを呼ぶ → 成功したらホームへ移動、という流れです。
`res.ok` はHTTPステータスコードが200番台（成功）のときに `true` になります。

---

## よく使うJSXのパターン まとめ

```jsx
// 条件付き表示
{条件 && <Component />}
{条件 ? <A /> : <B />}

// リスト表示（keyは必須）
{array.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// 動的なclassName
className={`base ${条件 ? 'active' : ''}`}

// イベント処理
onClick={() => handler()}
onChange={(e) => setState(e.target.value)}
onSubmit={handleSubmit}

// null安全アクセス
data?.property
array?.length
array?.map(...)
```

## よく使うHooks まとめ

| Hook | 用途 | 例 |
|---|---|---|
| `useState` | 変化する値を記憶 | 入力値、フラグ、配列 |
| `useEffect` | 副作用の実行 | APIコール、初期データ取得 |
| `useParams` | URLパラメータ取得 | 詳細ページのID |
| `useNavigate` | ページ遷移 | 送信後、戻るボタン |

## 大会本番のチェックリスト

- [ ] `api.js` をモックから実際のAPIに切り替えた
- [ ] 検索・カテゴリ・並び替えが組み合わせて動く
- [ ] 検索結果0件のメッセージが表示される
- [ ] コメントが0件のときメッセージが表示される
- [ ] 必須項目が全部入力されるまで投稿ボタンが無効
- [ ] 送信中は「投稿中...」と表示される
- [ ] 投稿成功後にアラートが出てホームに遷移する
- [ ] `npm run build` でエラーなくビルドできる
- [ ] ビルド後のファイルを競技サーバーにアップロードした
- [ ] `_src` フォルダにソースコードをアップロードした
