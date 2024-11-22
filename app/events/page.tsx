import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'

export default async function Events() {
  const supabase = createServerComponentClient({ cookies })
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id} className="block">
              <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-blue-300 mb-2">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-sm text-blue-200 truncate">{event.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

