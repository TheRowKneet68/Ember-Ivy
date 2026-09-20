import { CATEGORIES, GALLERY_CATEGORIES } from '../data/seed.js'

export const CAT_OPTIONS = CATEGORIES.map((c) => c.name)
export const GAL_OPTIONS = GALLERY_CATEGORIES.map((c) => c.name)

const T = {
  text: (label) => ({ label, type: 'text' }),
  area: (label) => ({ label, type: 'textarea' }),
  num: (label) => ({ label, type: 'number' }),
  date: (label) => ({ label, type: 'date' }),
  bool: (label) => ({ label, type: 'bool' }),
  select: (label, options) => ({ label, type: 'select', options }),
  image: (label) => ({ label, type: 'image' })
}

export const RESOURCES = [
  {
    key: 'menu',
    title: 'Menu Management',
    desc: 'Dishes, prices, categories and badges.',
    fields: {
      name: T.text('Name'),
      description: T.area('Description'),
      price: T.num('Price (Rs)'),
      category: T.select('Category', CAT_OPTIONS),
      image: T.image('Photo'),
      veg: T.bool('Vegetarian'),
      popular: T.bool('Popular badge'),
      chef: T.bool('Chef’s pick'),
      seasonal: T.bool('Seasonal special'),
      rating: T.num('Rating (1–5)')
    }
  },
  {
    key: 'categories',
    title: 'Category Management',
    desc: 'Menu categories shown as tabs. Add, rename or remove — the menu page updates automatically.',
    fields: {
      name: T.text('Name'),
      icon: T.text('Emoji icon'),
      description: T.area('Description'),
      sort: T.num('Sort order')
    }
  },
  {
    key: 'gallery',
    title: 'Gallery',
    desc: 'Photos shown across the site.',
    fields: {
      src: T.image('Photo'),
      title: T.text('Title'),
      cat: T.select('Category', GAL_OPTIONS)
    }
  },
  {
    key: 'reviews',
    title: 'Reviews',
    desc: 'Guest testimonials.',
    fields: {
      name: T.text('Guest name'),
      rating: T.num('Rating (1–5)'),
      review_date: T.text('When (e.g. “A week ago”)'),
      text: T.area('Review text'),
      tag: T.text('Theme tag')
    }
  },
  {
    key: 'events',
    title: 'Events',
    desc: 'Live music and event calendar.',
    fields: {
      title: T.text('Title'),
      date: T.date('Date'),
      time: T.text('Time'),
      tag: T.text('Tag'),
      description: T.area('Description'),
      image: T.image('Photo'),
      cover: T.num('Cover (Rs, 0 = free)'),
      featured: T.bool('Featured')
    }
  },
  {
    key: 'hero_slides',
    title: 'Home Banner',
    desc: 'Background slideshow images on the home page.',
    fields: {
      image: T.image('Background photo'),
      label: T.text('Slide label'),
      sort: T.num('Sort order')
    }
  },
  {
    key: 'team',
    title: 'Meet Our Team',
    desc: 'Team member cards.',
    fields: {
      name: T.text('Name'),
      role: T.text('Role'),
      image: T.image('Photo'),
      bio: T.area('Short bio')
    }
  },
  {
    key: 'instagram',
    title: 'Instagram Feed',
    desc: 'Images on the home feed.',
    fields: {
      src: T.image('Photo'),
      link: T.text('Post link'),
      sort: T.num('Sort order')
    }
  }
]

export const RESOURCE_INDEX = Object.fromEntries(RESOURCES.map((r) => [r.key, r]))
