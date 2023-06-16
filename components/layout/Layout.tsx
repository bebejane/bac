import s from './Layout.module.scss'
import React, { useEffect, useState } from 'react'
import { Content, Footer, Grid, Menu, Logo, FullscreenGallery } from '/components'
import type { MenuItem } from '/lib/menu'
import { buildMenu } from '/lib/menu'
import { useRouter } from 'next/router'
import { useStore } from '/lib/store'
import { usePage } from '/lib/context/page'

export type LayoutProps = {
	children: React.ReactNode,
	menu: MenuItem[],
	contact: ContactRecord
	title: string
}

export default function Layout({ children, menu: menuFromProps, contact, title }: LayoutProps) {

	const router = useRouter()
	const { section } = usePage()
	const [menu, setMenu] = useState(menuFromProps)
	const [images, imageId, setImageId] = useStore((state) => [state.images, state.imageId, state.setImageId])

	useEffect(() => { // Refresh menu on load.
		buildMenu(router.locale).then(res => setMenu(res)).catch(err => console.error(err))
	}, [router.locale])


	return (
		<>
			<div className={s.topline}></div>
			<Logo />
			<Menu items={menu} />
			<div className={s.layout}>
				<Content menu={menu}>
					{children}
				</Content>
			</div>

			<Footer contact={contact} />
			<Grid />
		</>
	)
}