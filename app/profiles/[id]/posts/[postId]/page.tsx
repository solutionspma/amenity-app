'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

interface PostDetail {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  image?: string;
  video?: string;
  liked?: boolean;
}

interface Comment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

export default function PostDetailPage({ params }: { params: { id: string; postId: string } }) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { getBackdropStyle } = useBackdrop();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Mock post data
        const mockPost: PostDetail = {
          id: params.postId,
          author: {
            id: params.id,
            name: params.id === 'me' ? 'Your Profile' : `User ${params.id}`,
            username: params.id === 'me' ? '@yourhandle' : `@user${params.id}`,
            avatar: '/logos/altar-life-logo.png',
            verified: Math.random() > 0.5
          },
          content: "Just had the most amazing experience at the new coffee shop downtown! ☕ The community vibes are incredible here on Amenity. It's so wonderful to connect with like-minded people who share the same values and faith. Looking forward to many more meaningful conversations and connections! #Community #Faith #Coffee",
          timestamp: new Date().toISOString(),
          likes: Math.floor(Math.random() * 300) + 10,
          comments: Math.floor(Math.random() * 50) + 5,
          shares: Math.floor(Math.random() * 25) + 1,
          image: Math.random() > 0.5 ? '/images/sample-post.jpg' : undefined,
          liked: Math.random() > 0.5
        };

        const mockComments: Comment[] = Array.from({ length: 8 }, (_, i) => ({
          id: `comment-${i}`,
          author: {
            name: ['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'David Rodriguez', 'Jessica Wilson'][i % 5] || `User ${i}`,
            username: `@user${i}`,
            avatar: '/logos/altar-life-logo.png'
          },
          content: [
            'This looks amazing! I need to check this place out 😍',
            'Love this! The community aspect is so important',
            'Great shot! The lighting is perfect ✨',
            'Thanks for sharing! Adding this to my must-visit list',
            'This reminds me of my favorite spot back home',
            'Beautiful! Faith-based communities are so special 🙏',
            'Can\'t wait to visit when I\'m in town!',
            'The ambiance looks so peaceful and welcoming'
          ][i] || `Great post! Thanks for sharing.`,
          timestamp: new Date(Date.now() - i * 3600000).toISOString(),
          likes: Math.floor(Math.random() * 20)
        }));

        setPost(mockPost);
        setComments(mockComments);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, params.postId]);

  const handleLike = () => {
    if (post) {
      setPost({
        ...post,
        liked: !post.liked,
        likes: post.liked ? post.likes - 1 : post.likes + 1
      });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-new-${Date.now()}`,
        author: {
          name: 'You',
          username: '@you',
          avatar: '/logos/altar-life-logo.png'
        },
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
      if (post) {
        setPost({ ...post, comments: post.comments + 1 });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={getBackdropStyle('profile')}>
        <AmenityHeader currentPage={`/profiles/${params.id}/posts/${params.postId}`} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span>Loading post...</span>
          </div>
        </div>
        <AmenityFooter />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen" style={getBackdropStyle('profile')}>
        <AmenityHeader currentPage={`/profiles/${params.id}/posts/${params.postId}`} />
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <div className="text-white text-6xl">😔</div>
          <div className="text-white text-xl">Post not found</div>
          <button 
            onClick={() => router.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
        <AmenityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={getBackdropStyle('profile')}>
      <AmenityHeader currentPage={`/profiles/${params.id}/posts/${params.postId}`} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Profile
          </button>
        </div>

        {/* Main Post */}
        <div className="bg-black/30 rounded-2xl p-8 border border-gray-700 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div 
              onClick={() => router.push(`/profiles/${post.author.id}`)}
              className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer"
            >
              {post.author.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 
                  onClick={() => router.push(`/profiles/${post.author.id}`)}
                  className="text-white font-semibold text-lg cursor-pointer hover:text-purple-300 transition-colors"
                >
                  {post.author.name}
                </h3>
                {post.author.verified && <span className="text-blue-400">✓</span>}
              </div>
              <p className="text-gray-400">{post.author.username}</p>
              <p className="text-gray-500 text-sm">{new Date(post.timestamp).toLocaleDateString()}</p>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              ⋯
            </button>
          </div>
          
          <p className="text-white text-lg leading-relaxed mb-6">{post.content}</p>
          
          {post.image && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-64 rounded-xl mb-6 flex items-center justify-center border border-gray-700">
              <span className="text-gray-400 text-xl">📷 Image Content</span>
            </div>
          )}

          {post.video && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-64 rounded-xl mb-6 flex items-center justify-center border border-gray-700">
              <span className="text-gray-400 text-xl">🎥 Video Content</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <div className="flex space-x-8">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  post.liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <span className="text-xl">{post.liked ? '❤️' : '🤍'}</span>
                <span className="font-medium">{post.likes}</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-xl">💬</span>
                <span className="font-medium">{post.comments}</span>
              </div>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                <span className="text-xl">🔄</span>
                <span className="font-medium">{post.shares}</span>
              </button>
            </div>
            <button className="text-gray-400 hover:text-yellow-400 transition-colors text-xl">
              🔖
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-black/20 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Comments ({post.comments})</h2>
          
          {/* Add Comment */}
          <div className="mb-8">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                Y
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none resize-none"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-sm">{newComment.length}/500</span>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-full font-medium transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                  {comment.author.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-white">{comment.author.name}</span>
                      <span className="text-gray-400 text-sm">{comment.author.username}</span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-200">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 ml-4">
                    <button className="text-gray-400 hover:text-red-400 transition-colors text-sm flex items-center space-x-1">
                      <span>🤍</span>
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Comments */}
          <div className="text-center mt-8">
            <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Load more comments
            </button>
          </div>
        </div>
      </main>

      <AmenityFooter />
    </div>
  );
}