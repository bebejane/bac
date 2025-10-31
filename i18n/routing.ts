import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'sv'];
export const defaultLocale = 'en';
export const localePrefix = 'as-needed';
export const routing = defineRouting({
	locales,
	localePrefix,
	defaultLocale,
	localeDetection: false,
	pathnames: {
		'/': {
			sv: '/',
		},
		'/about/[about]': {
			sv: '/om/[about]',
		},
		'/projects': {
			sv: '/projekt',
		},
		'/projects/[project]': {
			sv: '/projekt/[project]',
		},
		'/events': {
			sv: '/evenemang',
		},
		'/events/[event]': {
			sv: '/evenemang/[event]',
		},
		'/bac-20-year-anniversary': {
			sv: '/bac-20-arsjubileum',
		},
		'/bac-20-year-anniversary/[page]': {
			sv: '/bac-20-arsjubileum/[page]',
		},
		'/archive': {
			sv: '/arkiv',
		},
		'/contact': {
			sv: '/kontakt',
		},
	},
});

export type AppPathnames = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
