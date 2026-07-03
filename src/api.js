// const BASE_URL = '/api';

// export const fetchPost = async () => {
//     const res = await fetch(`${BASE_URL}/posts`);
//     return res.json();
// }

// export const fetchPosts = async (id) => {
//     const res = await fetch(`${BASE_URL}/posts/${id}`);
//     return res.json();
// }

// export const fetchCategories = async () => {
//     const res = await fetch(`${BASE_URL}/categories`);
//     return res.json();
// }

// export const createPost = async (data) => {
//     const res = await fetch(`${BASE_URL}/posts`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//     });
//     return res;
// }

const BASE_URL = '/api'

// モックデータ（練習用）
const mockPosts = [
  {
    id: 1,
    title: '香川のうどんが最高すぎる',
    content: '先日、高松市内のうどん屋さんに行ってきました。コシのある麺と出汁が絶品でした。',
    author: '田中太郎',
    category: 'グルメ',
    likes: 24,
    commentCount: 3,
    imageUrl: '',
    createdAt: '2025-03-10T10:00:00Z',
    comments: [
      { id: 1, author: '鈴木花子', content: '私もそこ行ったことあります！最高ですよね' },
      { id: 2, author: '佐藤次郎', content: 'おすすめのメニューは何ですか？' },
    ]
  },
  {
    id: 2,
    title: '金刀比羅宮に行ってきました',
    content: '785段の階段を登りきりました！眺めが最高でした。',
    author: '山田花子',
    category: '観光',
    likes: 18,
    commentCount: 0,
    imageUrl: '',
    createdAt: '2025-03-12T10:00:00Z',
    comments: []
  },
  {
    id: 3,
    title: '高松港のイベント情報',
    content: '今週末に高松港でマルシェが開催されます。地元の食材や工芸品が並びます。',
    author: '伊藤次郎',
    category: 'イベント',
    likes: 31,
    commentCount: 2,
    imageUrl: '',
    createdAt: '2025-03-15T10:00:00Z',
    comments: [
      { id: 1, author: '田中太郎', content: '行きます！' },
    ]
  },
]

const mockCategories = [
  { id: 1, name: 'グルメ' },
  { id: 2, name: '観光' },
  { id: 3, name: 'イベント' },
  { id: 4, name: '生活' },
]

export const fetchPosts = async () => mockPosts

export const fetchPost = async (id) => {
  return mockPosts.find(p => p.id === Number(id)) || null
}

export const fetchCategories = async () => mockCategories

export const createPost = async (data) => {
  console.log('投稿データ:', data)
  return { ok: true }
}