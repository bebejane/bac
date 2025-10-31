'use client';

import { locales, Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function Language() {
	const locale = useLocale();

	return (
		<>
			{locales
				.filter((l) => l !== locale)
				.map((l: string, i: number) => (
					<Link key={i} href={'/'} locale={l}>
						{l === 'en' ? 'English' : 'Svenska'}
					</Link>
				))}
		</>
	);
}
