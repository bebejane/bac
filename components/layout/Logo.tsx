import s from './Logo.module.scss'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePage } from '/lib/context/page'
export type LayoutProps = {

}

export default function Logo({ }: LayoutProps) {

	const { isHome } = usePage()

	return (
		<>
			<Link href="/">
				<header className={s.logo}>
					<h1 className="logo">{'BALTIC ART CENTER'.split('').map(c =>
						<span className={cn(isHome && s.home)}>
							{c}
						</span>
					)}
					</h1>
				</header>
			</Link>
		</>
	)
}