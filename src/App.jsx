import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Gallery from './pages/Gallery.jsx'
import Events from './pages/Events.jsx'
import Reservation from './pages/Reservation.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminApp from './admin/AdminApp.jsx'
import { trackVisit } from './lib/store.js'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function VisitTracker() {
  useEffect(() => {
    trackVisit().catch(() => {})
  }, [])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <VisitTracker />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="events" element={<Events />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </>
  )
}
