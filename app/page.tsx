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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Discover Innovative
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Ideas</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Browse creative ideas from entrepreneurs and connect with investors in our vibrant community
          </p>
          
          {/* CTA Buttons */}
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a
                href="/auth/signup"
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Share Your Ideas
              </a>
              <a
                href="/auth/signup"
                className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200"
              >
                Become an Investor
              </a>
            </div>
          )}
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              user={user}
              onLike={() => fetchIdeas()}
            />
          ))}
        </div>

        {/* Empty State */}
        {ideas.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No ideas yet!</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Be the first to share your innovative idea with our community of entrepreneurs and investors.
            </p>
            {user?.user_type === 'giver' && (
              <a
                href="/submit-idea"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Your First Idea
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}