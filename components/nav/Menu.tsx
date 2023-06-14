import s from './Menu.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import type { Menu, MenuItem } from '/lib/menu'

import { useTranslations } from 'next-intl'
import { Hamburger } from '/components'
import useStore from '/lib/store'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { useWindowSize } from 'usehooks-ts'
import useDevice from '/lib/hooks/useDevice'
import { Link, Language } from '/components'
import { translatePath } from '/lib/utils'

export type MenuProps = { items: Menu }

export default function Menu({ items }: MenuProps) {

	const t = useTranslations('Menu')
	const router = useRouter()
	const { asPath, locale, defaultLocale } = router
	const menuRef = useRef<HTMLUListElement | null>(null);
	const [showMenu, setShowMenu, searchQuery, setSearchQuery] = useStore((state) => [state.showMenu, state.setShowMenu, state.searchQuery, state.setSearchQuery])

	const [selected, setSelected] = useState<MenuItem | undefined>()
	const { scrolledPosition, documentHeight, viewportHeight } = useScrollInfo()
	const { width, height } = useWindowSize()
	const { isDesktop, isMobile } = useDevice()

	const setSelectedByPath = (path: string) => {

		let selected = null;

		items.forEach((item) => {
			if (translatePath(item.slug, locale, defaultLocale) === path)
				selected = item
			else if (item.sub) {
				item.sub.forEach((subItem) => {
					if (translatePath(subItem.slug, locale, defaultLocale).replace(`/${locale}/`, '/') === path)
						selected = item
				})
			}
		})

		setSelected(selected)
	}

	useEffect(() => {
		const handleRouteChangeComplete = (path: string) => setShowMenu(false)
		const handleRouteChangeStart = (path: string) => { }//setSelectedByPath(path)

		router.events.on('routeChangeStart', handleRouteChangeStart)
		router.events.on('routeChangeComplete', handleRouteChangeComplete)
		return () => {
			router.events.off('routeChangeComplete', handleRouteChangeComplete)
			router.events.off('routeChangeStart', handleRouteChangeStart)
		}
	}, [locale, defaultLocale])

	useEffect(() => {
		setSelectedByPath(asPath)
	}, [asPath, locale, defaultLocale])

	return (
		<>
			<Hamburger />
			<nav className={cn(s.menu)}>
				<ul ref={menuRef} className={cn(showMenu && s.show)}>
					{items.map((item, index) =>
						<li key={index} className={cn(asPath === item.slug && s.selected)}>
							{!item.sub ?
								<Link href={item.slug}>{item.label}</Link>
								:
								<span onClick={() => setSelected(selected?.id === item.id ? undefined : item)}>
									{item.label}
									<ul className={cn(selected?.id === item.id && s.show)}>
										{item.sub.map((subItem, index) =>
											<li key={index} className={cn(asPath === subItem.slug && s.selected)}>
												<Link href={subItem.slug} onClick={(e) => e.stopPropagation()}>{subItem.label}</Link>
											</li>
										)}
									</ul>
								</span>
							}
						</li>
					)}
					<li>
						<Language menu={items} />
					</li>
				</ul>
			</nav>
		</>
	)
}

