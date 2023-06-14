type SiteLocale = 'en' | 'sv'

type PageSlug = {
  locale: SiteLocale
  value: string
}

type PageProps = {
  title?: string
  isHome: boolean
  slugs?: PageSlugs[]
  section: SectionId
}

type SectionId = 'home' | 'contact' | 'project' | 'event' | 'about' | 'anniversary'

type ThumbnailImage = {
  thumb: FileField
}

type Messages = typeof import('../lib/i18n/en.json');
declare interface IntlMessages extends Messages { }


