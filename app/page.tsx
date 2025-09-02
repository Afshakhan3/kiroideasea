'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { IdeaCard } from '@/components/IdeaCard'
import { getCurrentUser } from '@/lib/auth'

interface Idea {
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

export default function HomePage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIdeas()
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          users (name),
          likes (id),
          comments (id)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setIdeas(data || [])
    } catch (error) {
      console.error('Error fetching ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Innovative Ideas
        </h1>
        <p className="text-xl text-gray-600">
          Browse creative ideas from entrepreneurs and connect with investors
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            user={user}
            onLike={() => fetchIdeas()}
          />
        ))}
      </div>

      {ideas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No ideas yet. Be the first to share one!</p>
        </div>
      )}
    </div>
  )
}