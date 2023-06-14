import { translatePath } from '/lib/utils';
import { defaultLocale } from '/lib/i18n'
import { withWebPreviewsEdge } from 'dato-nextjs-utils/hoc';

export const config = {
  runtime: 'edge'
}

export default withWebPreviewsEdge(async ({ item, itemType, locale }) => {

  let path = null;

  const { slug } = item.attributes

  switch (itemType.attributes.api_key) {

    case 'start':
      path = `/`
      break;
    case 'project':
      path = `/projects/${slug}`
      break;
    case 'event':
      path = `/events/${slug}`
      break;
    case 'about':
      path = `/about/${slug}`
      break;
    case 'contact':
      path = `/contact`
      break;
    case 'person':
      path = `/contact`
      break;
    case 'archive':
      path = `/archive`
      break;
    case 'anniversary':
      path = `/bac-20-year-anniversary`
      break;
    case 'anniversary_page':
      path = `/bac-20-year-anniversary/${slug}`
      break;
    default:
      break;
  }

  return path ? translatePath(path, locale, defaultLocale) : null
})