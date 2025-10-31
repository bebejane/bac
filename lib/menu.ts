import { apiQuery } from 'next-dato-utils/api';
import { MenuDocument } from '@/graphql';
import { locales, getPathname, AppPathnames } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import { Messages } from 'next-intl';

export type Menu = MenuItem[];

export type MenuItem = {
	id: string;
	label?: Messages[0];
	href?: {
		pathname: AppPathnames;
		params?: any;
	};
	sub?: MenuItem[];
	general?: boolean;
};

const base: MenuItem[] = [
	{ id: 'home', label: null, href: { pathname: '/' } },
	{ id: 'about', label: null, href: undefined, sub: [] },
	{ id: 'project', label: null, href: { pathname: '/projects' } },
	{ id: 'event', label: null, href: { pathname: '/events' } },
	{ id: 'anniversary', label: null, href: { pathname: '/bac-20-year-anniversary' } },
	{ id: 'archive', label: null, href: { pathname: '/archive' } },
	{ id: 'contact', label: null, href: { pathname: '/contact' } },
];

export const buildMenu = async (locale: SiteLocale): Promise<Menu> => {
	const messages = await getMessages({ locale });
	const altLocale = locales.find((l) => locale != l) as SiteLocale;
	const { abouts } = await apiQuery(MenuDocument, { variables: { locale, altLocale } });

	const menu = base.map((item: MenuItem) => {
		let sub: MenuItem[];
		const menuItem: MenuItem = { ...item };
		menuItem.label = messages.Menu[item.id];

		switch (item.id) {
			case 'about':
				sub = abouts
					.filter((el) => el.slug)
					.map((el) => ({
						id: `about-${el.slug}`,
						label: el.title,
						href: {
							pathname: `/about/[about]`,
							params: { about: el.slug },
						},
					}));
				break;
			default:
				break;
		}
		return {
			...menuItem,
			sub: sub || menuItem.sub || null,
		};
	});

	return menu;
};
