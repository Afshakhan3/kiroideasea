'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { StartConversationButton } from './StartConversationButton'

interface IdeaCardProps {
  idea: {
    id: string
    title: string
    description: string
    video_url: string
    created_at: string
    user_id: string
    users: {
      name: string
    }
    likes: { id: string }[]
    comments: { id: string }[]
  }
  user: any
  onLike: () => void
}

export function IdeaCard({ idea, user, onLike }: IdeaCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<any[]>([])

  const handleLike = async () => {
    if (!user) {
      alert('Please sign in to like ideas')
      return
    }

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('idea_id', idea.id)
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('likes')
          .insert({
            idea_id: idea.id,
            user_id: user.id,
          })
      }
      
      setIsLiked(!isLiked)
      onLike()
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleComment = async () => {
    if (!user || !comment.trim()) return

    try {
      await supabase
        .from('comments')
        .insert({
          idea_id: idea.id,
          user_id: user.id,
          content: comment.trim(),
        })

      setComment('')
      fetchComments()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('comments')
        .select(`
          *,
          users (name)
        `)
        .eq('idea_id', idea.id)
        .order('created_at', { ascending: true })

      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const toggleComments = () => {
    setShowComments(!showComments)
    if (!showComments) {
      fetchComments()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="video-card relative">
        <video
          src={idea.video_url}
          controls
          className="w-full h-full object-cover"
          poster="/video-placeholder.jpg"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{idea.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {idea.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            by {idea.users.name}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(idea.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{idea.likes.length}</span>
            </button>
            
            <button
              onClick={toggleComments}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle size={20} />
              <span>{idea.comments.length}</span>
            </button>
          </div>
          
          <StartConversationButton
            ideaGiverId={idea.user_id}
            ideaGiverName={idea.users.name}
            currentUser={user}
          />
        </div>

        {showComments && (
          <div className="mt-4 border-t pt-4">
            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="text-sm">
                  <span className="font-medium">{comment.users.name}:</span>
                  <span className="ml-2">{comment.content}</span>
                </div>
              ))}
            </div>
            
            {user && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}