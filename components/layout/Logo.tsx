import s from './Logo.module.scss'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePage } from '/lib/context/page'
import { useRouter } from 'next/router'
import { is } from 'date-fns/locale'
export type LayoutProps = {

}

export default function Logo({ }: LayoutProps) {

	const router = useRouter()
	const { isHome } = usePage()
	const [fonts, setFonts] = useState<string[]>([])
	const [hover, setHover] = useState(false)

	useEffect(() => {
		setFonts([s.f1, s.f2, s.f3, s.f4].sort(() => Math.random() - 0.5 > 0 ? 1 : -1))
	}, [router.asPath, hover])

	return (
		<>
			<Link href="/">
				<header className={s.logo}>
					<h1 className="logo" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
						{'BALTIC'.split('').map((c, i) =>
							<span key={i} className={cn(isHome && s.home, fonts[0])}>
								{c}
							</span>
						)}
						<span className={cn(isHome && s.home)}>&nbsp;</span>
						{'ART'.split('').map((c, i) =>
							<span key={i} className={cn(isHome && s.home, fonts[1])}>
								{c}
							</span>
						)}
						<span className={cn(isHome && s.home)}>&nbsp;</span>
						{'CENTER'.split('').map((c, i) =>
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