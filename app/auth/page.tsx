'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const supabase = useSupabaseClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role: 'creator', // Default role for new users
            }
          }
        })
        if (error) throw error
        // Insert user into the users table
        await supabase.from('users').insert({ id: data.user?.id, name, email, role: 'creator' })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      router.push('/')
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred during authentication')
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto mt-8 px-4">
        <form onSubmit={handleAuth} className="max-w-md mx-auto bg-blue-800 bg-opacity-50 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          {isSignUp && (
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 rounded bg-blue-700 text-white"
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded bg-blue-700 text-white"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded bg-blue-700 text-white"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          <p className="mt-4 text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-blue-300 hover:underline">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>
      </main>
    </div>
  )
}

