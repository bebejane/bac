import { apiQuery } from 'next-dato-utils/api';
import { MenuDocument } from '@/graphql';
import { locales, routing, getPathname } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';

const base: Menu = [
	{ id: 'home', label: 'Home', href: '/' },
	{ id: 'about', label: 'About', href: null, sub: [] },
	{ id: 'project', label: 'Projects', href: '/projects' },
	{ id: 'event', label: 'Events', href: '/events' },
	{ id: 'anniversary', label: 'BAC 20 Years', href: '/bac-20-year-anniversary' },
	{ id: 'archive', label: 'Archive', href: '/archive' },
	{ id: 'contact', label: 'Contact', href: '/contact' },
];

export const buildMenu = async (locale: SiteLocale) => {
	const messages = await getMessages({ locale });
	const altLocale = locales.find((l) => locale != l) as SiteLocale;
	const { abouts } = await apiQuery(MenuDocument, { variables: { locale, altLocale } });
	const menu = base.map((item) => {
		let sub: MenuItem[];
		item.href = item.href && getPathname({ href: item.href, locale });

		switch (item.id) {
			case 'about':
				sub = abouts
					.filter((el) => el.slug)
					.map((el) => ({
						id: `about-${el.slug}`,
						label: el.title,
						href: getPathname({ locale, href: { pathname: `/about/[about]`, params: { about: el.slug } } }),
					}));
				break;
			default:
				break;
		}
		return {
			...item,
			sub: sub || item.sub || null,
		};
	});

	return menu;
};

export type Menu = MenuItem[];

export type MenuItem = {
	id: string;
	label: string;
	href?: ReturnType<typeof getPathname>;
	sub?: MenuItem[];
	general?: boolean;
};

export type MenuQueryResponse = {
	abouts: (AboutRecord & { althref: string })[];
};
