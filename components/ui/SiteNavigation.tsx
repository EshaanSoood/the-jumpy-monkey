import Link from 'next/link'

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="text-lg font-medium text-foreground-muted underline-offset-2 transition-colors hover:text-foreground hover:no-underline focus-ring"
    >
      {children}
    </Link>
  )
}

export function SiteNavigation() {
  return (
    <nav aria-label="Site navigation" className="border-b border-border bg-background">
      <div className="main-content">
        <ul className="flex gap-6 py-4">
          <li>
            <NavLink href="/">Home</NavLink>
          </li>
          <li>
            <NavLink href="/diary">Diary</NavLink>
          </li>
          <li>
            <NavLink href="/drawers">Drawers</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

