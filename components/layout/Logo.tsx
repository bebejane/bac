import s from './Logo.module.scss'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
export type LayoutProps = {

}

export default function Logo({ }: LayoutProps) {

	return (
		<>
			<Link href="/">
				<header className={s.logo}>
					<h1>BALTIC ART CENTER</h1>
				</header>
			</Link>
		</>
	)
}