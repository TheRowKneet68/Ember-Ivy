export const SITE_IMAGES = [
  { key: 'img_home_about', label: 'About / Story — lounge photo', default: '/images/interior-1.svg' },
  { key: 'img_home_chef', label: 'Chef’s Specials — kitchen photo', default: '/images/chef-1.svg' },
  { key: 'img_home_cta', label: 'Reservation CTA — banner photo', default: '/images/cta-1.svg' },
  { key: 'img_home_today_1', label: 'Today’s Specials — card 1', default: '/images/food-3.svg' },
  { key: 'img_home_today_2', label: 'Today’s Specials — card 2', default: '/images/food-5.svg' },
  { key: 'img_home_today_3', label: 'Today’s Specials — card 3', default: '/images/cocktail-4.svg' }
]

export function pickPics(settings) {
  const pics = {}
  for (const item of SITE_IMAGES) pics[item.key] = settings?.[item.key] || item.default
  return pics
}