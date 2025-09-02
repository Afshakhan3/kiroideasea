'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Upload } from 'lucide-react'

export default function SubmitIdeaPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

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
      if (currentUser.user_type !== 'giver') {
        window.location.href = '/dashboard'
        return
      }
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const canSubmitIdea = () => {
    if (!user) return false
    
    // If user has unlimited plan and is paid
    if (user.plan_type === 'unlimited' && user.is_paid) {
      const expiryDate = new Date(user.expiry_date)
      return expiryDate > new Date()
    }
    
    // If user has single plan and is paid (they can submit one idea)
    if (user.plan_type === 'single' && user.is_paid) {
      return true
    }
    
    return false
  }

  const uploadVideo = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `videos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('idea-videos')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('idea-videos')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canSubmitIdea()) {
      setError('Please purchase a plan to submit ideas.')
      return
    }

    if (!formData.video) {
      setError('Please select a video file.')
      return
    }

    setLoading(true)
    setError('')

    try {
      setUploading(true)
      const videoUrl = await uploadVideo(formData.video)
      setUploading(false)

      const { error: insertError } = await supabase
        .from('ideas')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          video_url: videoUrl,
        })

      if (insertError) throw insertError

      // If single plan, mark as used
      if (user.plan_type === 'single') {
        await supabase
          .from('users')
          .update({ is_paid: false })
          .eq('id', user.id)
      }

      alert('Idea submitted successfully!')
      window.location.href = '/dashboard'
    } catch (error: any) {
      setError(error.message)
      setUploading(false)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit Your Idea</h1>
        <p className="text-gray-600">
          Share your innovative idea with potential investors through a short video presentation.
        </p>
      </div>

      {!canSubmitIdea() && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Payment Required</p>
          <p>You need to purchase a plan to submit ideas. Visit your dashboard to choose a plan.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Idea Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a catchy title for your idea"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your idea in detail..."
            />
          </div>

          <div>
            <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
              Video Presentation *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="video-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a video</span>
                    <input
                      id="video-upload"
                      name="video-upload"
                      type="file"
                      accept="video/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setFormData({ ...formData, video: file })
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  MP4, MOV, AVI up to 100MB
                </p>
                {formData.video && (
                  <p className="text-sm text-green-600 font-medium">
                    Selected: {formData.video.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading || !canSubmitIdea()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading Video...' : loading ? 'Submitting...' : 'Submit Idea'}
          </button>
        </div>
      </form>
    </div>
  )
}