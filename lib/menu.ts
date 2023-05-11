import { apiQuery } from 'dato-nextjs-utils/api';
import { MenuDocument } from "/graphql";
import { locales } from '/lib/i18n'
import routes from '/lib/i18n/routes'

const base: Menu = [
  { id: 'home', label: 'Hem', slug: '/', general: true },
]

export const buildMenu = async (locale: string) => {

  const messages = (await import(`./i18n/${locale}.json`)).default
  const altLocale = locales.find(l => locale != l)
  const menu = []

  return menu
}

export type Menu = MenuItem[]

export type MenuItem = {
  id: SectionId
  label: string
  slug?: string
  altSlug?: string
  sub?: MenuItem[]
  general?: boolean
}
