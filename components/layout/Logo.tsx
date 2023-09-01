import s from './Logo.module.scss'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePage } from '/lib/context/page'
export type LayoutProps = {

}

export default function Logo({ }: LayoutProps) {

	const { isHome } = usePage()
	const fonts = [s.f1, s.f2, s.f3, s.f4].sort(() => Math.random() - 0.5 > 0 ? 1 : -1)

	return (
		<>
			<Link href="/">
				<header className={s.logo}>
					<h1 className="logo">
						{'BALTIC '.split('').map((c, i) =>
							<span key={i} className={cn(isHome && s.home, fonts[0])}>
								{c}
							</span>
						)}
						{'ART '.split('').map((c, i) =>
							<span key={i} className={cn(isHome && s.home, fonts[1])}>
								{c}
							</span>
						)}
						{'CENTER '.split('').map((c, i) =>
							<span key={i} className={cn(isHome && s.home, fonts[3])}>
								{c}
							</span>
						)}
					</h1>
				</header>
			</Link>
		</>
	)
}