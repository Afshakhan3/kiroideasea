'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    // Check if user has liked this idea
    if (user) {
      const userLike = idea.likes.find((like: any) => like.user_id === user.id)
      setIsLiked(!!userLike)
    } else {
      setIsLiked(false)
    }
  }, [user, idea.id, idea.likes])

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
    if (!user) {
      alert('Please sign in to comment on ideas')
      return
    }
    
    if (!comment.trim()) return

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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Video Section */}
      <div className="relative aspect-[9/16] sm:aspect-video bg-gray-900">
        <video
          src={idea.video_url}
          controls
          className="w-full h-full object-cover"
          poster="/video-placeholder.jpg"
          preload="metadata"
        />
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
      
      {/* Content Section */}
      <div className="p-4 sm:p-6">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 line-clamp-2">
            {idea.title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
            {idea.description}
          </p>
        </div>
        
        {/* Author and Date */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {idea.users.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                {idea.users.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {new Date(idea.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          {/* Contact Button - Desktop */}
          <div className="hidden sm:block">
            <StartConversationButton
              ideaGiverId={idea.user_id}
              ideaGiverName={idea.users.name}
              currentUser={user}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                isLiked 
                  ? 'text-red-500 scale-105' 
                  : 'text-gray-500 hover:text-red-500 hover:scale-105'
              }`}
            >
              <Heart 
                size={20} 
                fill={isLiked ? 'currentColor' : 'none'} 
                className="transition-all duration-200"
              />
              <span className="font-medium text-sm sm:text-base">
                {idea.likes.length}
              </span>
            </button>
            
            <button
              onClick={toggleComments}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-all duration-200 hover:scale-105"
            >
              <MessageCircle size={20} />
              <span className="font-medium text-sm sm:text-base">
                {idea.comments.length}
              </span>
            </button>
          </div>
          
          {/* Contact Button - Mobile */}
          <div className="sm:hidden">
            <StartConversationButton
              ideaGiverId={idea.user_id}
              ideaGiverName={idea.users.name}
              currentUser={user}
            />
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            {/* Comments List */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xs">
                        {comment.users.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold text-gray-900">
                          {comment.users.name}
                        </span>
                        <span className="ml-2 text-gray-700">
                          {comment.content}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Comment Input */}
            {user ? (
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  />
                  <button
                    onClick={handleComment}
                    disabled={!comment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-3">
                  Sign in to join the conversation
                </p>
                <div className="flex space-x-3 justify-center">
                  <a
                    href="/auth/signin"
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full text-sm hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/auth/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}