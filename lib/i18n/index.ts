import routes from './routes'
import { locales, defaultLocale } from '/next.config.mjs'
export { locales, defaultLocale }

export { default as routes } from './routes'

export const pageSlugs = (id: SectionId, slugs?: PageSlug[]): PageSlug[] => {
  return locales.filter(l => slugs?.find((s) => s.locale === l && s.value)).map((locale) => ({
    locale: locale as SiteLocale,
    value: `/${routes[id][locale]}${slugs ? `/${slugs.find((s) => s.locale === locale).value}` : ''}`
  }))
}