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
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Your Ideas Into
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Reality</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Connect innovative entrepreneurs with global investors. Share your breakthrough ideas through engaging videos and get the funding you need to succeed.
          </p>
          
          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Vision</h3>
              <p className="text-gray-600">Create compelling video pitches to showcase your innovative ideas to the world</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">Get exposure to investors and partners from around the globe, not just your local area</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Funding</h3>
              <p className="text-gray-600">Connect directly with verified investors ready to fund promising ventures</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200 text-lg"
              >
                🚀 Share Your Ideas
              </a>
              <a
                href="/auth/signup"
                className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200 text-lg"
              >
                💰 Become an Investor
              </a>
            </div>
          )}
        </div>

        {/* How It Works Section */}
        {ideas.length === 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How IdeaSea Works</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* For Entrepreneurs */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">For Entrepreneurs</h3>
                  <p className="text-gray-600">Turn your innovative ideas into funded ventures</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Create Your Account</h4>
                      <p className="text-gray-600 text-sm">Sign up as an Idea Giver and choose your plan</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Record Your Pitch</h4>
                      <p className="text-gray-600 text-sm">Create a compelling video explaining your idea and its potential</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Get Global Exposure</h4>
                      <p className="text-gray-600 text-sm">Your idea is showcased to investors worldwide</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Connect & Fund</h4>
                      <p className="text-gray-600 text-sm">Interested investors will contact you directly to discuss funding</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">💡 What You Get:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Global visibility for your ideas</li>
                    <li>• Direct access to verified investors</li>
                    <li>• Community feedback and support</li>
                    <li>• Potential funding opportunities</li>
                  </ul>
                </div>
              </div>

              {/* For Investors */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">For Investors</h3>
                  <p className="text-gray-600">Discover the next big thing before everyone else</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Join as Investor</h4>
                      <p className="text-gray-600 text-sm">Get verified investor access for just $10/5 years</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Browse Ideas</h4>
                      <p className="text-gray-600 text-sm">Watch video pitches from innovative entrepreneurs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Connect Directly</h4>
                      <p className="text-gray-600 text-sm">Message entrepreneurs whose ideas interest you</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Make Deals</h4>
                      <p className="text-gray-600 text-sm">Negotiate and fund promising ventures</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">💰 What You Get:</h5>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Early access to innovative ideas</li>
                    <li>• Direct communication with founders</li>
                    <li>• Curated investment opportunities</li>
                    <li>• Global deal flow pipeline</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Section */}
        {!user && ideas.length === 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Simple, Transparent Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Single Idea */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Single Idea</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">$1</div>
                <p className="text-gray-600 mb-6">Perfect for testing the waters</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Submit 1 idea</li>
                  <li>• Global exposure</li>
                  <li>• Investor connections</li>
                  <li>• Community feedback</li>
                </ul>
                <a href="/auth/signup" className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </a>
              </div>

              {/* Unlimited Ideas */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-xl text-center text-white relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                  POPULAR
                </div>
                <h3 className="text-xl font-bold mb-2">Unlimited Ideas</h3>
                <div className="text-3xl font-bold mb-4">$10<span className="text-lg">/5 years</span></div>
                <p className="mb-6 opacity-90">For serious entrepreneurs</p>
                <ul className="text-sm space-y-2 mb-6 opacity-90">
                  <li>• Unlimited idea submissions</li>
                  <li>• Priority visibility</li>
                  <li>• Advanced analytics</li>
                  <li>• 5 years of access</li>
                </ul>
                <a href="/auth/signup" className="block w-full bg-white text-blue-600 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                  Start Building
                </a>
              </div>

              {/* Investor Access */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Investor Access</h3>
                <div className="text-3xl font-bold text-green-600 mb-4">$10<span className="text-lg">/5 years</span></div>
                <p className="text-gray-600 mb-6">Discover the next big thing</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Browse all ideas</li>
                  <li>• Message entrepreneurs</li>
                  <li>• Early access to deals</li>
                  <li>• 5 years of access</li>
                </ul>
                <a href="/auth/signup" className="block w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Start Investing
                </a>
              </div>
            </div>
          </div>
        )}

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