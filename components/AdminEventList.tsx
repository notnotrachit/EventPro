'use client'

import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

interface Event {
  id: number
  title: string
  date: string
  is_featured: boolean
}

export function AdminEventList() {
  const [events, setEvents] = useState<Event[]>([])
  const supabase = useSupabaseClient()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
    } else {
      setEvents(data || [])
    }
  }

  const toggleFeatured = async (eventId: number, isFeatured: boolean) => {
    const { error } = await supabase
      .from('events')
      .update({ is_featured: !isFeatured })
      .eq('id', eventId)

    if (error) {
      console.error('Error updating event:', error)
    } else {
      fetchEvents()
    }
  }

  return (
    <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Manage Events</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="pb-2">Title</th>
            <th className="pb-2">Date</th>
            <th className="pb-2">Featured</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t border-blue-700">
              <td className="py-2">{event.title}</td>
              <td className="py-2">{new Date(event.date).toLocaleDateString()}</td>
              <td className="py-2">{event.is_featured ? 'Yes' : 'No'}</td>
              <td className="py-2">
                <button
                  onClick={() => toggleFeatured(event.id, event.is_featured)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  {event.is_featured ? 'Unfeature' : 'Feature'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

