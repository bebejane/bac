'use client';

import Link from 'next/link';
import { Menu } from '@/lib/menu';
import { locales, defaultLocale } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export type Props = {
	menu: Menu;
};

export default function Language({ menu }: Props) {
	const locale = useLocale();

	return (
		<>
			{locales.map((l: string, i: number) => (
				<Link key={i} href={'/'} locale={l}>
					{l === 'en' ? 'English' : 'Svenska'}
				</Link>
			))}
		</>
	);
}
