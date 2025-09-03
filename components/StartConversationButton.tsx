'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface StartConversationButtonProps {
  ideaGiverId: string
  ideaGiverName: string
  currentUser: any
}

export function StartConversationButton({ 
  ideaGiverId, 
  ideaGiverName, 
  currentUser 
}: StartConversationButtonProps) {
  const [loading, setLoading] = useState(false)

  const canStartConversation = () => {
    if (!currentUser) return false
    if (currentUser.user_type !== 'investor') return false
    if (!currentUser.is_paid) return false
    if (currentUser.expiry_date && new Date(currentUser.expiry_date) <= new Date()) return false
    return true
  }

  const startConversation = async () => {
    if (!canStartConversation()) {
      alert('You need to be a paid investor to start conversations.')
      return
    }

    setLoading(true)
    
    try {
      // Check if conversation already exists
      const { data: existingMessages } = await supabase
        .from('messages')
        .select('id')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${ideaGiverId}),and(sender_id.eq.${ideaGiverId},receiver_id.eq.${currentUser.id})`)
        .limit(1)

      if (existingMessages && existingMessages.length > 0) {
        // Conversation exists, redirect to messages
        window.location.href = '/messages'
        return
      }

      // Create initial message
      const initialMessage = `Hi ${ideaGiverName}, I'm interested in your idea and would like to discuss it further.`
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          receiver_id: ideaGiverId,
          content: initialMessage
        })

      if (error) throw error

      alert('Conversation started! Check your messages.')
      window.location.href = '/messages'
    } catch (error) {
      console.error('Error starting conversation:', error)
      alert('Failed to start conversation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser || currentUser.user_type !== 'investor' || currentUser.id === ideaGiverId) {
    return null
  }

  return (
    <button
      onClick={startConversation}
      disabled={loading || !canStartConversation()}
      className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
        canStartConversation()
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
      }`}
    >
      <MessageCircle size={14} className="sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">
        {loading ? 'Starting...' : 'Contact'}
      </span>
      <span className="sm:hidden">
        {loading ? '...' : 'Chat'}
      </span>
    </button>
  )
}