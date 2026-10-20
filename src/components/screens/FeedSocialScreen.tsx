import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  CheckCircle2,
  Send,
  X,
} from 'lucide-react';
import { ScreenId } from '../../types/screens';
import { ASSETS } from '../../data/assets';

interface FeedSocialScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
}

interface PostItem {
  id: string;
  author: string;
  authorAvatar: string;
  role: string;
  timeAgo: string;
  content: string;
  imageAttachment?: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  badge?: string;
}

const DEFAULT_POSTS: PostItem[] = [
  {
    id: 'p-1',
    author: 'Capt. Razali Noor',
    authorAvatar: ASSETS.avatars.admin,
    role: 'Crisis Ops Director · National HQ',
    timeAgo: '2h ago',
    content:
      'Alhamdulillah! Today our field squads completed 42 emergency grocery care box deliveries across Sentul and Cheras sectors. Big shoutout to Brother Ahmad Faisal and all 18 volunteer units on duty!',
    imageAttachment: ASSETS.feed.foodDriveAction,
    likes: 84,
    comments: 12,
    liked: false,
    saved: false,
    badge: 'Official Dispatch',
  },
  {
    id: 'p-2',
    author: 'Ustazah Hana Al-Idrus',
    authorAvatar: ASSETS.avatars.teacher,
    role: 'Lead Revert Mentor · Syariah Board',
    timeAgo: '5h ago',
    content:
      'Blessed to host our monthly Sister Reverts Halaqa & Tajweed clinic at Masjid Wilayah today. 14 new Muslim sisters gathered to learn Salah recitation, share their stories, and support one another.',
    imageAttachment: ASSETS.feed.sistersHalaqa,
    likes: 119,
    comments: 19,
    liked: true,
    saved: true,
    badge: 'Community Story',
  },
  {
    id: 'p-3',
    author: 'Ahmad Faisal',
    authorAvatar: ASSETS.avatars.volunteer,
    role: 'Squad Sentul Field Responder',
    timeAgo: '1d ago',
    content:
      'Completed the emergency medical transit for Uncle Daud to HKL this morning. Dialysis session went smoothly on schedule. Huge gratitude to the dispatch coordinators for rapid triage!',
    imageAttachment: ASSETS.feed.volunteerCelebration,
    likes: 62,
    comments: 7,
    liked: false,
    saved: false,
  },
];

export const FeedSocialScreen: React.FC<FeedSocialScreenProps> = ({
  playClickSound,
}) => {
  const [posts, setPosts] = useState<PostItem[]>(() => {
    try {
      const saved = localStorage.getItem('mrm_feed_posts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_POSTS;
  });

  const [showNewPostModal, setShowNewPostModal] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('modal') === 'composer'
  );
  const [newContent, setNewContent] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('mrm_feed_posts', JSON.stringify(posts));
    } catch {}
  }, [posts]);

  const handleLike = (id: string) => {
    playClickSound?.();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            liked: !p.liked,
            likes: p.liked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );
  };

  const handleSave = (id: string) => {
    playClickSound?.();
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  };

  const handleCreatePost = () => {
    if (!newContent.trim()) return;
    playClickSound?.();

    const created: PostItem = {
      id: `post-${Date.now()}`,
      author: 'Ahmad Faisal',
      authorAvatar: ASSETS.avatars.volunteer,
      role: 'Verified Responder',
      timeAgo: 'Just now',
      content: newContent,
      likes: 1,
      comments: 0,
      liked: true,
      saved: false,
      badge: 'Field Update',
    };

    setPosts([created, ...posts]);
    setNewContent('');
    setShowNewPostModal(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    playClickSound?.();
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p))
    );
    setCommentText('');
    setActiveCommentPostId(null);
  };

  const handleShare = async (post: PostItem) => {
    playClickSound?.();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `MRM Community: ${post.author}`,
          text: post.content,
          url: window.location.href,
        });
      } catch {}
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${post.author} on MRM Care:\n${post.content}`);
      alert('Post copied to clipboard!');
    }
  };

  return (
    <div className="relative min-h-full flex flex-col p-4 u-canvas pb-8 select-none space-y-3.5">
      {/* Compose Bar */}
      <div className="p-3 u-card flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={ASSETS.avatars.volunteer}
            alt="Composer"
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <span className="text-xs text-slate-500 truncate">
            Share a field update, revert milestone, or du'a...
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            setShowNewPostModal(true);
          }}
          className="py-1.5 px-3 rounded-xl u-btn-primary text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-3.5">
        {posts.map((post) => (
          <div key={post.id} className="p-4 u-card space-y-3">
            {/* Author Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold truncate">{post.author}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono truncate">
                    <span className="truncate">{post.role}</span>
                    <span>·</span>
                    <span className="shrink-0">{post.timeAgo}</span>
                  </div>
                </div>
              </div>

              {post.badge && (
                <span className="u-badge u-badge-brand text-[9px] shrink-0">
                  {post.badge}
                </span>
              )}
            </div>

            {/* Post Content */}
            <p className="text-xs leading-relaxed">{post.content}</p>

            {/* Attachment */}
            {post.imageAttachment && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200/70 max-h-52">
                <img
                  src={post.imageAttachment}
                  alt="Community impact"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Reactions Bar */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 font-semibold cursor-pointer ${
                    post.liked ? 'text-rose-600' : 'hover:text-slate-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound?.();
                    setActiveCommentPostId(
                      activeCommentPostId === post.id ? null : post.id
                    );
                  }}
                  className="flex items-center gap-1.5 font-semibold hover:text-slate-800 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-1 font-semibold hover:text-slate-800 cursor-pointer"
                  aria-label="Share post"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSave(post.id)}
                className={`cursor-pointer ${
                  post.saved ? 'text-emerald-600' : 'hover:text-slate-800'
                }`}
                aria-label="Bookmark post"
              >
                <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Inline Comment Input */}
            {activeCommentPostId === post.id && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write an encouraging comment or du'a..."
                  className="flex-1 px-3 py-1.5 rounded-xl u-subtle border border-slate-200/80 text-xs focus:outline-hidden focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => handleAddComment(post.id)}
                  className="p-2 rounded-xl u-btn-primary cursor-pointer"
                  aria-label="Post comment"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm p-4 u-card shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Share Community Update</h3>
              <button
                type="button"
                onClick={() => setShowNewPostModal(false)}
                className="p-1 rounded-lg u-btn-secondary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Share field dispatch progress, halaqa reflections, or community announcements..."
              className="w-full p-3 rounded-xl u-subtle border border-slate-200/80 text-xs focus:outline-hidden focus:border-emerald-600"
            />
            <button
              type="button"
              onClick={handleCreatePost}
              className="w-full py-2.5 rounded-xl u-btn-primary text-xs font-bold cursor-pointer"
            >
              Publish to MRM Feed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
