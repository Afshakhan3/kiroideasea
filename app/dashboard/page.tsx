'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, CreditCard, MessageCircle } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        window.location.href = '/auth/signin'
        return
      }
      setUser(currentUser)
      
      if (currentUser.user_type === 'giver') {
        fetchUserIdeas(currentUser.id)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserIdeas = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          likes (id),
          comments (id)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setIdeas(data || [])
    } catch (error) {
      console.error('Error fetching ideas:', error)
    }
  }

  const getPaymentUrl = (type: string) => {
    switch (type) {
      case 'single':
        return process.env.NEXT_PUBLIC_GUMROAD_IDEA_SINGLE_URL
      case 'unlimited':
        return process.env.NEXT_PUBLIC_GUMROAD_IDEA_UNLIMITED_URL
      case 'investor':
        return process.env.NEXT_PUBLIC_GUMROAD_INVESTOR_URL
      default:
        return '#'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome back, {user.name}!
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Account Status</h2>
              <p className="text-gray-600">
                Account Type: <span className="font-medium capitalize">{user.user_type}</span>
              </p>
              <p className="text-gray-600">
                Plan: <span className="font-medium">{user.plan_type || 'Free'}</span>
              </p>
              <p className="text-gray-600">
                Status: <span className={`font-medium ${user.is_paid ? 'text-green-600' : 'text-red-600'}`}>
                  {user.is_paid ? 'Paid' : 'Unpaid'}
                </span>
              </p>
              {user.expiry_date && (
                <p className="text-gray-600">
                  Expires: <span className="font-medium">{new Date(user.expiry_date).toLocaleDateString()}</span>
                </p>
              )}
            </div>
            
            {!user.is_paid && (
              <div className="space-y-2">
                {user.user_type === 'giver' && (
                  <>
                    <a
                      href={getPaymentUrl('single')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
                    >
                      <CreditCard className="inline mr-2" size={16} />
                      Pay $1 per idea
                    </a>
                    <a
                      href={getPaymentUrl('unlimited')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-center"
                    >
                      <CreditCard className="inline mr-2" size={16} />
                      Unlimited for $10/5 years
                    </a>
                  </>
                )}
                
                {user.user_type === 'investor' && (
                  <a
                    href={getPaymentUrl('investor')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-center"
                  >
                    <CreditCard className="inline mr-2" size={16} />
                    Investor Access $10/5 years
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {user.user_type === 'giver' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Ideas</h2>
                <Link
                  href="/submit-idea"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  <span>Submit New Idea</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ideas.map((idea) => (
                  <div key={idea.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="aspect-video">
                      <video
                        src={idea.video_url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{idea.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {idea.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{idea.likes.length} likes</span>
                        <span>{idea.comments.length} comments</span>
                        <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {ideas.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">You haven't submitted any ideas yet.</p>
                  <Link
                    href="/submit-idea"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                    <span>Submit Your First Idea</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {user.user_type === 'investor' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Investor Dashboard</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 mb-4">
                  As an investor, you can browse all ideas on the homepage and initiate conversations with idea givers.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
                  >
                    Browse Ideas
                  </Link>
                  <Link
                    href="/messages"
                    className="block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-center"
                  >
                    <MessageCircle className="inline mr-2" size={16} />
                    View Messages
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/messages"
                className="block text-blue-600 hover:text-blue-800"
              >
                <MessageCircle className="inline mr-2" size={16} />
                Messages
              </Link>
              <Link
                href="/"
                className="block text-blue-600 hover:text-blue-800"
              >
                Browse Ideas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}