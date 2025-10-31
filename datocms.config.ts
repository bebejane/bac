import { apiQuery } from 'next-dato-utils/api';
import { SitemapDocument } from '@/graphql';
import { locales, defaultLocale, getPathname, routing } from '@/i18n/routing';
import { DatoCmsConfig, getUploadReferenceRoutes, getItemReferenceRoutes } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';

export default {
	i18n: {
		locales,
		defaultLocale,
	},
	routes: {
		start: async ({ id }, locale) => [
			getPathname({ href: '/', locale }),
			...(await getItemReferenceRoutes(id, locales)),
		],
		project: async ({ id, slug }, locale) => [
			getPathname({ href: '/projects', locale }),
			getPathname({ href: { pathname: '/projects/[project]', params: { project: slug[locale] } }, locale }),
			...(await getItemReferenceRoutes(id, locales)),
		],
		event: async ({ id, slug }, locale) => [
			getPathname({ href: '/events', locale }),
			getPathname({ href: { pathname: '/events/[event]', params: { event: slug[locale] } }, locale }),
			...(await getItemReferenceRoutes(id, locales)),
		],
		about: async ({ id, slug }, locale) => [
			getPathname({ href: { pathname: '/about/[about]', params: { about: slug[locale] } }, locale }),
			...(await getItemReferenceRoutes(id, locales)),
		],
		contact: async ({ id }, locale) => [getPathname({ href: '/contact', locale })],
		person: async ({ id }, locale) => [getPathname({ href: '/contact', locale })],
		archive: async ({ id }, locale) => [getPathname({ href: '/archive', locale })],
		archive_intro: async ({ id }, locale) => [getPathname({ href: '/archive', locale })],
		archive_category: async ({ id }, locale) => [getPathname({ href: '/archive', locale })],
		anniversary: async ({ id }, locale) => [getPathname({ href: '/bac-20-year-anniversary', locale })],
		anniversary_page: async ({ id, slug }, locale) => [
			getPathname({ href: '/bac-20-year-anniversary', locale }),
			getPathname({ href: { pathname: '/bac-20-year-anniversary/[page]', params: { page: slug[locale] } }, locale }),
		],
		upload: async (record) => getUploadReferenceRoutes(record.id, locales),
	},
	sitemap: async () => {
		const otherLocales = locales.filter((l) => l !== defaultLocale);
		const staticRoutes = Object.keys(routing.pathnames)
			.filter((p) => !p.includes('['))
			.map((pathname) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: pathname as any }, locale: defaultLocale })}`,
				lastModified: new Date().toISOString(),
				changeFrequency: pathname === '/' ? 'weekly' : 'monthly',
				priority: pathname === '/' ? 1 : 0.8,
				alternaates: {
					languages: otherLocales.reduce(
						(acc, l, i) => {
							acc[otherLocales[i]] =
								`${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: pathname as any }, locale: otherLocales[i] })}`;
							return acc;
						},
						{} as Record<SiteLocale, { [key: string]: string }>
					),
				},
			}));

		const { allAbouts, allProjects, allEvents, allAnniversaryPages } = await apiQuery(SitemapDocument, {
			all: true,
		});

		const abouts = allAbouts.map(({ slug, _allSlugLocales }) => ({
			url: `${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: '/about/[about]', params: { about: slug } }, locale: defaultLocale })}`,
			lastModified: new Date().toISOString(),
			changeFrequency: 'monthly',
			priority: 0.8,
			alternates: {
				languages: _allSlugLocales.reduce(
					(acc, l, i) => {
						if (l.locale === defaultLocale || !l.value) return acc;
						acc[l.locale as string] =
							`${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: '/about/[about]', params: { about: l.value } }, locale: l.locale })}`;
						return acc;
					},
					{} as Record<SiteLocale, { [key: string]: string }>
				),
			},
		}));

		const projects = allProjects.map(({ slug, _allSlugLocales }) => ({
			url: `${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: '/projects/[project]', params: { project: slug } }, locale: defaultLocale })}`,
			lastModified: new Date().toISOString(),
			changeFrequency: 'monthly',
			priority: 0.8,
			alternates: {
				languages: _allSlugLocales.reduce(
					(acc, l, i) => {
						if (l.locale === defaultLocale || !l.value) return acc;
						acc[l.locale as string] =
							`${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: '/projects/[project]', params: { project: l.value } }, locale: l.locale })}`;
						return acc;
					},
					{} as Record<SiteLocale, { [key: string]: string }>
				),
			},
		}));

		const events = allEvents.map(({ slug, _allSlugLocales }) => ({
			url: `${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: '/events/[event]', params: { event: slug } }, locale: defaultLocale })}`,
			lastModified: new Date().toISOString(),
			changeFrequency: 'weekly',
			priority: 0.5,
			alternates: {
				languages: _allSlugLocales.reduce(
					(acc, l, i) => {
						if (l.locale === defaultLocale || !l.value) return acc;
						acc[l.locale as string] =
							`${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: '/events/[event]', params: { event: l.value } }, locale: l.locale })}`;
						return acc;
					},
					{} as Record<SiteLocale, { [key: string]: string }>
				),
			},
		}));

		const anniversaryPages = allAnniversaryPages.map(({ slug, _allSlugLocales }) => ({
			url: `${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: '/bac-20-year-anniversary/[page]', params: { page: slug } }, locale: defaultLocale })}`,
			lastModified: new Date().toISOString(),
			changeFrequency: 'yearly',
			priority: 0.8,
			alternates: {
				languages: _allSlugLocales.reduce(
					(acc, l, i) => {
						if (l.locale === defaultLocale || !l.value) return acc;
						acc[l.locale as string] =
							`${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: '/bac-20-year-anniversary/[page]', params: { page: l.value } }, locale: l.locale })}`;
						return acc;
					},
					{} as Record<SiteLocale, { [key: string]: string }>
				),
			},
		}));

		const dynamiRoutes = [...abouts, ...projects, ...events, ...anniversaryPages];
		return [...staticRoutes, ...dynamiRoutes] as MetadataRoute.Sitemap;
	},
	manifest: async () => {
		return {
			name: 'Baltic Art Center',
			short_name: 'BAC',
			description: 'Baltic Art Center is a residency for contemporary art on the island of Gotland in the Baltic Sea',
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#000000',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
			},
		};
	},
} satisfies DatoCmsConfig;
