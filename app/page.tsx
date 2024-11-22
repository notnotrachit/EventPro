import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Navigation } from '@/components/Navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createServerComponentClient({ cookies })
  const { data: featuredEvents } = await supabase
    .from('events')
    .select('*')
    .eq('is_featured', true)
    .order('date', { ascending: true })
    .limit(5)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-4xl font-bold mb-8">Welcome to EventPro</h1>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents?.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="block">
                <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-blue-300">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

