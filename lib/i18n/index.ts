import routes from './routes'
import { locales, defaultLocale } from '/next.config.mjs'
export { locales, defaultLocale }

export const pageSlugs = (id: SectionId, slugs?: PageSlug[]): PageSlug[] => {

  return locales.map((locale) => ({
    locale: locale as SiteLocale,
    value: `/${routes[id][locale]}${slugs ? `/${slugs.find((s) => s.locale === locale).value}` : ''}`
  }))
}