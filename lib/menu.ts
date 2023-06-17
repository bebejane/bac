import { apiQuery } from 'dato-nextjs-utils/api';
import { MenuDocument } from "/graphql";
import { locales, routes } from '/lib/i18n'

const base: Menu = [
  { id: 'home', label: 'Home', slug: '/' },
  { id: 'about', label: 'About', slug: null, sub: [] },
  { id: 'project', label: 'Projects', slug: '/projects' },
  { id: 'event', label: 'Events', slug: '/events' },
  { id: 'anniversary', label: 'BAC 20 Years', slug: '/bac-20-year-anniversary' },
  { id: 'archive', label: 'Archive', slug: '/archive' },
  { id: 'contact', label: 'Contact', slug: '/contact' },
]

export const buildMenu = async (locale: string) => {

  const messages = (await import(`./i18n/${locale}.json`)).default
  const altLocale = locales.find(l => locale != l)
  const res: MenuQueryResponse = await apiQuery(MenuDocument, { variables: { locale, altLocale } });

  const menu = base.map(item => {

    let sub: MenuItem[];

    //if (item.slug) {
    console.log(messages.Menu[item.id])
    item.label = messages.Menu[item.id]
    item.slug = `/${routes[item.id][locale]}`
    item.altSlug = `/${routes[item.id][altLocale]}`
    //}

    switch (item.id) {
      case 'about':
        //@ts-ignore
        sub = res.abouts.filter(el => el.slug).map(el => ({
          id: `about-${el.slug}`,
          label: el.title,
          slug: `/${routes.about[locale]}/${el.slug}`,
          altSlug: `/${routes.about[altLocale]}/${el.altSlug}`
        }))
        break;
      default:
        break;
    }
    return {
      ...item,
      sub: sub || item.sub || null,
    }
  })

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

export type MenuQueryResponse = {
  abouts: (AboutRecord & { altSlug: string })[]
}
