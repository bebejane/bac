import { translatePath } from '/lib/utils';
import { defaultLocale } from '/lib/i18n'
import { withWebPreviewsEdge } from 'dato-nextjs-utils/hoc';

export const config = {
  runtime: 'edge'
}

export default withWebPreviewsEdge(async ({ item, itemType, locale }) => {

  let path = null;

  const slug = typeof item.attributes.slug === 'object' ? item.attributes.slug[locale] : item.attributes.slug
  const { api_key } = itemType.attributes

  switch (api_key) {
    case 'start':
      path = `/`
      break;
    case 'project':
      path = slug ? `/projects/${slug}` : null
      break;
    case 'event':
      path = slug ? `/events/${slug}` : null
      break;
    case 'about':
      path = slug ? `/about/${slug}` : null
      break;
    case 'contact':
      path = `/contact`
      break;
    case 'person':
      path = `/contact`
      break;
    case 'archive':
      path = slug ? `/archive/${slug}` : null
      break;
    case 'anniversary':
      path = `/bac-20-year-anniversary`
      break;
    case 'anniversary_page':
      path = slug ? `/bac-20-year-anniversary/${slug}` : null
      break;
    default:
      break;
  }

  return path ? translatePath(path, locale, defaultLocale) : null
})