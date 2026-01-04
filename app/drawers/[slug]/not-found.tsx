import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main-content">
      <h1>Drawer not found</h1>
      <p>The drawer you're looking for doesn't exist or has been removed.</p>
      <nav aria-label="Navigation">
        <Link href="/drawers">← Back to Drawers</Link>
      </nav>
    </main>
  )
}

