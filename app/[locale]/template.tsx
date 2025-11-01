'use client';

import { usePathname } from 'next/navigation';
import s from './template.module.scss';

export default function Template({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	return (
		<main id='content' className={s.main} key={pathname}>
			<article>{children}</article>
		</main>
	);
}
