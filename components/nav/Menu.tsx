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
import { defaultLocale, getPathname, Link } from '@/i18n/routing';

type MenuProps = { items: Menu };

export default function Menu({ items }: MenuProps) {
	const t = useTranslations('Menu');
	const locale = useLocale();
	const pathname = usePathname();
	const menuRef = useRef<HTMLUListElement | null>(null);
	const [showMenu, setShowMenu] = useStore(useShallow((state) => [state.showMenu, state.setShowMenu]));
	const [selected, setSelected] = useState<MenuItem | undefined>();
	const [subSelected, setSubSelected] = useState<MenuItem | undefined>();

	const setSelectedByPath = (localePath: string) => {
		let selected = null;

		items.forEach((item) => {
			if (item.href && getPathname({ href: item.href as any, locale }) === localePath) selected = item;
			else if (item.sub) {
				item.sub.forEach((subItem) => {
					if (getPathname({ href: subItem.href as any, locale }) === localePath) {
						selected = subItem;
					}
				});
			}
		});

		if (!selected) {
			const parentPath = `${localePath
				.split('/')
				.slice(0, localePath.split('/').length - 1)
				.join('/')}`;

			selected = items.find((item) => item.href && getPathname({ href: item.href as any, locale }) === parentPath);
		}

		setSelected(selected);
	};

	useEffect(() => {
		setSubSelected(undefined);
		setShowMenu(false);
	}, [pathname]);

	useEffect(() => {
		setSelectedByPath(pathname);
	}, [items, locale, defaultLocale, pathname]);

	useEffect(() => {
		const isArchive = pathname.startsWith(getPathname({ locale, href: '/archive' }));
		document.body.style.background = isArchive ? 'var(--archive)' : 'var(--background)';
	}, [pathname]);

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
								item.href !== undefined && item.href !== null && <Link href={item.href as any}>{item.label}</Link>
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
												{subItem.href && (
													<Link href={subItem.href as any} locale={locale} onClick={(e) => e.stopPropagation()}>
														{subItem.label}
													</Link>
												)}
											</li>
										))}
									</ul>
								</span>
							)}
						</li>
					))}
					<li className={s.language} style={{ animationDelay: `${items.length * 50}ms` }}>
						<Language />
					</li>
				</ul>
				<div className={cn(s.background, showMenu && s.show)}></div>
			</nav>
		</>
	);
}
