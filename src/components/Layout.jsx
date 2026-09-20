import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import Loader from './Loader.jsx'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Icon from './Icons.jsx'

function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="float-actions">
      <Link to="/reservation" className="float-reserve">
        <Icon name="calendar" size={16} /> Reserve
      </Link>
      {showTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <Icon name="arrowUp" size={20} />
        </button>
      )}
    </div>
  )
}

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <>
      <Loader key={pathname} />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}