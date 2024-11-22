'use client'

import { useState } from 'react'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'

export default function CreateEvent() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [requiresApproval, setRequiresApproval] = useState(false)
  const [questions, setQuestions] = useState([''])
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert('You must be signed in to create an event')
      return
    }

    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          creator_id: session.user.id,
          title,
          description,
          date,
          requires_approval: requiresApproval
        })
        .select()

      if (eventError) throw eventError

      const eventId = eventData[0].id

      const questionsToInsert = questions
        .filter(q => q.trim() !== '')
        .map(question => ({
          event_id: eventId,
          question_text: question
        }))

      if (questionsToInsert.length > 0) {
        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert)

        if (questionsError) throw questionsError
      }

      router.push('/events')
    } catch (error) {
      console.error('Error creating event:', error)
      alert('An error occurred while creating the event')
    }
  }

  const addQuestion = () => {
    setQuestions([...questions, ''])
  }

  const updateQuestion = (index: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = value
    setQuestions(updatedQuestions)
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-blue-800 bg-opacity-50 p-8 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Event Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 rounded bg-blue-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 rounded bg-blue-700 text-white"
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block mb-2">Date</label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-2 rounded bg-blue-700 text-white"
            />
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="mr-2"
              />
              Requires Approval
            </label>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Registration Questions</h3>
            {questions.map((question, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  className="w-full p-2 rounded bg-blue-700 text-white"
                />
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add Question
            </button>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Event
          </button>
        </form>
      </main>
    </div>
  )
}

