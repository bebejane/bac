import { translatePath } from '/lib/utils';
import { defaultLocale } from '/lib/i18n'
import { withWebPreviews } from 'dato-nextjs-utils/hoc';

export default withWebPreviews(async ({ item, itemType, locale }) => {

  let path = null;

  const { slug: baseSlug } = item.attributes

  switch (itemType.attributes.api_key) {
    case 'start':
      path = `/`
      break;
    default:
      break;
  }

  return path ? translatePath(path, locale, defaultLocale) : null
})