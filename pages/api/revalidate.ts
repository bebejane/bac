import { withRevalidate } from 'dato-nextjs-utils/hoc'
import { translatePath } from '/lib/utils';
import { defaultLocale } from '/lib/i18n'

export default withRevalidate(async (record, revalidate) => {

  const { api_key: apiKey, } = record.model;
  const { slug } = record
  const slugs = typeof slug === 'object' ? slug : { [defaultLocale]: slug }
  const paths = []

  console.log('revalidate', apiKey)

  Object.keys(slugs).forEach((locale) => {
    const slug = slugs[locale]
    const localePaths = []
    switch (apiKey) {
      case 'start':
        localePaths.push('/')
        break;
      case 'about':
        localePaths.push(`/om/${slug}`)
        break;
      default:
        break;
    }
    localePaths.forEach(p => paths.push(translatePath(p, locale, defaultLocale)))
  })
  console.log(paths)
  revalidate(paths)
})