'use client'

import { useState } from 'react'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'

interface Question {
  id: number
  question_text: string
}

interface RegistrationFormProps {
  eventId: number
  questions: Question[]
  requiresApproval: boolean
}

export function RegistrationForm({ eventId, questions, requiresApproval }: RegistrationFormProps) {
  const [responses, setResponses] = useState<Record<number, string>>({})
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert('You must be signed in to register for an event')
      router.push('/auth')
      return
    }

    try {
      const { data: registrationData, error: registrationError } = await supabase
        .from('registrations')
        .insert({
          event_id: eventId,
          user_id: session.user.id,
          status: requiresApproval ? 'pending' : 'approved'
        })
        .select()

      if (registrationError) throw registrationError

      const registrationId = registrationData[0].id

      const responsesToInsert = Object.entries(responses).map(([questionId, responseText]) => ({
        registration_id: registrationId,
        question_id: parseInt(questionId),
        response_text: responseText
      }))

      const { error: responsesError } = await supabase
        .from('responses')
        .insert(responsesToInsert)

      if (responsesError) throw responsesError

      alert('Registration submitted successfully!')
      router.push('/events')
    } catch (error) {
      console.error('Error submitting registration:', error)
      alert('An error occurred while submitting your registration')
    }
  }

  const handleResponseChange = (questionId: number, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-blue-800 bg-opacity-50 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Event Registration</h2>
      {questions.map((question) => (
        <div key={question.id} className="mb-4">
          <label htmlFor={`question-${question.id}`} className="block mb-2">{question.question_text}</label>
          <input
            type="text"
            id={`question-${question.id}`}
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            required
            className="w-full p-2 rounded bg-blue-700 text-white"
          />
        </div>
      ))}
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit Registration
      </button>
      {requiresApproval && (
        <p className="mt-4 text-sm text-blue-300">Note: This event requires approval. Your registration will be pending until approved by the event organizer.</p>
      )}
    </form>
  )
}

