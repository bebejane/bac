import { apiQuery } from 'next-dato-utils/api';
import { locales, defaultLocale, getPathname } from '@/i18n/routing';
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
			getPathname({ href: { pathname: '/projects/[project]', params: { project: slug } }, locale }),
			...(await getItemReferenceRoutes(id, locales)),
		],
		event: async ({ id, slug }, locale) => [
			getPathname({ href: '/events', locale }),
			getPathname({ href: { pathname: '/events/[event]', params: { event: slug } }, locale }),
			...(await getItemReferenceRoutes(id, locales)),
		],
		about: async ({ id, slug }, locale) => [
			getPathname({ href: { pathname: '/about/[about]', params: { about: slug } }, locale }),
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
			getPathname({ href: { pathname: '/bac-20-year-anniversary/[page]', params: { page: slug } }, locale }),
		],
		upload: async (record) => getUploadReferenceRoutes(record.id, locales),
	},
	sitemap: async () => {
		return [
			{
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
				lastModified: new Date(),
				changeFrequency: 'daily',
				priority: 1,
			},
		] as MetadataRoute.Sitemap;
	},
	manifest: async () => {
		return {
			name: 'next-dato-boiler',
			short_name: 'next-dato-boiler',
			description: 'next-dato-boiler description',
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
