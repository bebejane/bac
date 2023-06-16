import routes from './routes'
import { locales, defaultLocale } from '/next.config.mjs'
export { locales, defaultLocale }

export { default as routes } from './routes'

export const pageSlugs = (id: SectionId, slugs?: PageSlug[]): PageSlug[] => {

  return locales.map((locale) => {
    const s = slugs?.find((s) => s.locale === locale)
    return ({
      locale: locale as SiteLocale,
      value: slugs && s.value ? `/${routes[id][locale]}${slugs ? `/${s.value}` : ''}` : slugs && !s.value ? '/' : `/${routes[id][locale]}`
    })
  })
}