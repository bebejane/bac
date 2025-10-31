'use client';

import s from './Menu.module.scss';
import cn from 'classnames';
import { useState, useRef, useEffect } from 'react';
import type { Menu, MenuItem } from '@/lib/menu';
import { useLocale, useTranslations } from 'next-intl';
import { Hamburger } from '@/components';
import useStore, { useShallow } from '@/lib/store';
import { Language } from '@/components';
import { usePathname } from 'next/navigation';
import { defaultLocale, Link } from '@/i18n/routing';

export type MenuProps = { items: Menu };

export default function Menu({ items }: MenuProps) {
	const t = useTranslations('Menu');
	const locale = useLocale();
	const pathname = usePathname();

	const menuRef = useRef<HTMLUListElement | null>(null);
	const [showMenu, setShowMenu] = useStore(useShallow((state) => [state.showMenu, state.setShowMenu]));

	const [selected, setSelected] = useState<MenuItem | undefined>();
	const [subSelected, setSubSelected] = useState<MenuItem | undefined>();

	const setSelectedByPath = (path: string) => {
		let selected = null;
		const localePath = `${locale !== defaultLocale ? `/${locale}` : ''}${path}`;

		items.forEach((item) => {
			if (translatePath(item.slug, locale, defaultLocale) === localePath) selected = item;
			else if (item.sub) {
				item.sub.forEach((subItem) => {
					if (translatePath(subItem.slug, locale, defaultLocale) === localePath) {
						selected = subItem;
					}
				});
			}
		});

		if (!selected) {
			// Check base path
			const parentPath = `${localePath
				.split('/')
				.slice(0, localePath.split('/').length - 1)
				.join('/')}`;
			//selected = items.find((item) => translatePath(item.slug, locale, defaultLocale) === parentPath);
		}

		setSelected(selected);
	};

	useEffect(() => {
		setSubSelected(undefined);
		setShowMenu(false);
		/*
		const handleRouteChangeStart = (path: string) => {}; //setSelectedByPath(path)

		router.events.on('routeChangeStart', handleRouteChangeStart);
		router.events.on('routeChangeComplete', handleRouteChangeComplete);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChangeComplete);
			router.events.off('routeChangeStart', handleRouteChangeStart);
		};
		*/
	}, [pathname]);

	useEffect(() => {
		//setSelectedByPath(pathname);
	}, [items, locale, defaultLocale, pathname]);

	return (
		<>
			<Hamburger />
			<nav className={cn(s.menu)}>
				<ul ref={menuRef} className={cn(showMenu && s.show)}>
					{items.map((item, index) => (
						<li
							key={index}
							className={cn(selected?.id === item.id && s.selected)}
							style={{ animationDelay: `${index * 50}ms` }}
						>
							{!item.sub ? (
								<Link href={item.href} locale={locale}>
									{item.label}
								</Link>
							) : (
								<span onClick={() => setSubSelected(subSelected?.id === item.id ? undefined : item)}>
									{item.label}
									<ul
										className={cn(
											(subSelected?.id === item.id || item.sub.find((el) => el.id === selected?.id)) && s.show
										)}
									>
										{item.sub.map((subItem, index) => (
											<li key={index} className={cn(selected?.id === subItem.id && s.selected)}>
												<Link href={subItem.href} locale={locale} onClick={(e) => e.stopPropagation()}>
													{subItem.label}
												</Link>
											</li>
										))}
									</ul>
								</span>
							)}
						</li>
					))}
					<li className={s.language} style={{ animationDelay: `${items.length * 50}ms` }}>
						<Language menu={items} />
					</li>
				</ul>
				<div className={cn(s.background, showMenu && s.show)}></div>
			</nav>
		</>
	);
}
