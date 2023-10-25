import { withRevalidate } from 'dato-nextjs-utils/hoc'
import { translatePath } from '/lib/utils';
import { defaultLocale } from '/lib/i18n'

export default withRevalidate(async (record, revalidate) => {

  const { api_key: apiKey, } = record.model;
  const { slug } = record
  const slugs = typeof slug === 'object' ? slug : { [defaultLocale]: slug }
  const paths = []

  Object.keys(slugs).forEach((locale) => {
    const slug = slugs[locale]
    const localePaths = []
    switch (apiKey) {
      case 'start':
        localePaths.push(`/`)
        break;
      case 'project':
        localePaths.push(`/projects/${slug}`)
        localePaths.push(`/`)
        break;
      case 'event':
        localePaths.push(`/events/${slug}`)
        localePaths.push(`/`)
        break;
      case 'about':
        localePaths.push(`/about/${slug}`)
        break;
      case 'contact':
        localePaths.push(`/contact`)
        break;
      case 'person':
        localePaths.push(`/contact`)
        break;
      case 'archive':
        localePaths.push(`/archive`)
        break;
      case 'archive_intro':
        localePaths.push(`/archive`)
        break;
      case 'archive_category':
        localePaths.push(`/archive`)
        break;
      case 'anniversary':
        localePaths.push(`/bac-20-year-anniversary`)
        break;
      case 'anniversary_page':
        localePaths.push(`/bac-20-year-anniversary/${slug}`)
        break;
      default:
        break;
    }
    localePaths.forEach(p => paths.push(translatePath(p, locale, defaultLocale)))
  })

  revalidate(paths)
})