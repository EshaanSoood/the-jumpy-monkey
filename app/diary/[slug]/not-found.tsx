import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main-content">
      <h1>Entry Not Found</h1>
      <p>The diary entry you're looking for doesn't exist.</p>
      <Link href="/diary">Back to Diary</Link>
    </main>
  )
}

