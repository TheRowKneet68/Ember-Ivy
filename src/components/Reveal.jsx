import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 }
}

export default function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const Tag = motion[as] || motion.div

  return (
    <Tag
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}
