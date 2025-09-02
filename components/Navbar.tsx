'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCurrentUser, signOut } from '@/lib/auth'
import { User, LogOut, Plus, MessageCircle } from 'lucide-react'

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            IdeaSea
          </Link>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <span className="text-gray-700">
                      Welcome, {user.name}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {user.user_type}
                    </span>
                    
                    {user.user_type === 'giver' && (
                      <Link
                        href="/submit-idea"
                        className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        <Plus size={16} />
                        <span>Submit Idea</span>
                      </Link>
                    )}
                    
                    <Link
                      href="/messages"
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                    >
                      <MessageCircle size={20} />
                    </Link>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                    >
                      <User size={20} />
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                    >
                      <LogOut size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}