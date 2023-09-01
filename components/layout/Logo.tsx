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
					<h1 className="logo">
						{'BALTIC '.split('').map((c, i) =>
							<span key={i} className={cn(isHome && s.home, s.logofont1)}>
								{c}
							</span>
						)}
						{'ART '.split('').map((c, i) =>
							<span key={i} className={cn(isHome && s.home, s.logofont2)}>
								{c}
							</span>
						)}
						{'CENTER '.split('').map((c, i) =>
							<span key={i} className={cn(isHome && s.home, s.logofont3)}>
								{c}
							</span>
						)}
					</h1>
				</header>
			</Link>
		</>
	)
}