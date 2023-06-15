import s from './Logo.module.scss'
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
					<h1>{!isHome ? 'BAC' : 'BALTIC ART CENTER'}</h1>
				</header>
			</Link>
		</>
	)
}