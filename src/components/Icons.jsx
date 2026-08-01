const paths = {
  phone: 'M2.5 3.5a1 1 0 0 1 1-1h2.1a1 1 0 0 1 .98.8l.7 3.2a1 1 0 0 1-.3.9l-1.4 1.4a12 12 0 0 0 5.7 5.7l1.4-1.4a1 1 0 0 1 .9-.3l3.2.7a1 1 0 0 1 .8 1v2.1a1 1 0 0 1-1 1h-1C9.5 21 3 14.5 2.5 4.5z',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  pin: 'M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-14v5l3 3',
  calendar: 'M4 7h16v13H4zM4 11h16M8 3v4m8-4v4',
  users: 'M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M10 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 10v-2a4 4 0 0 0-3-3.9M15 3.1a4 4 0 0 1 0 7.8',
  star: 'M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17l-5.9 3.2 1.3-6.6L2.5 9l6.6-.8z',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm4.5-3.3a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6z',
  facebook: 'M13 21v-7h3l.6-3H13V9.5c0-.9.3-1.5 1.6-1.5H17V5.4C16.7 5.3 15.7 5.2 14.6 5.2 12.3 5.2 11 6.4 11 8.9V11H8v3h3v7z',
  tiktok: 'M14 3c.3 2.3 1.8 3.9 4.2 4.2v2.7c-1.5 0-2.9-.5-4.2-1.4V15a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.9a2.5 2.5 0 1 0 1.6 2.4V3z',
  music: 'M9 18V6l12-3v11M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-4a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  arrowUp: 'M12 19V5m-7 7 7-7 7 7',
  close: 'M6 6l12 12M18 6L6 18',
  chevron: 'M9 6l6 6-6 6',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-15v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  check: 'M5 12l5 5 9-11',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z',
  quote: 'M7 7h4v4c0 2-1 3.5-3 4.5L6 14c1-.8 1.5-1.7 1.5-3H7zm8 0h4v4c0 2-1 3.5-3 4.5l-2-1.5c1-.8 1.5-1.7 1.5-3H15z',
  heart: 'M12 21s-8-4.9-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.1-8 11-8 11z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  plus: 'M12 5v14m-7-7h14',
  'arrow-right': 'M4 12h16m-7-7 7 7-7 7',
  upload: 'M12 16V4m-5 5 5-5 5 5M4 20h16'
}

export default function Icon({ name, size = 18, className = '', strokeWidth = 1.7, ...rest }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}
