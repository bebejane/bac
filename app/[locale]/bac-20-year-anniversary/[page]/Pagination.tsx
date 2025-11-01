'use client';

import s from './Pagination.module.scss';
import cn from 'classnames';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export const Pagination = ({
	pages,
	color,
}: {
	pages: AllAnniversaryPagesQuery['allAnniversaryPages'][0][];
	color: ColorField;
}) => {
	const pathname = usePathname();
	const t = useTranslations('Anniversary');
	const currentSlug = pathname.split('/').at(-1);
	const prevIndex = pages.findIndex(({ slug }) => slug === currentSlug) - 1;
	const nextIndex = pages.findIndex(({ slug }) => slug === currentSlug) + 1;
	const prev = pages[prevIndex] ?? pages[pages.length - 1];
	const next = pages[nextIndex] ?? pages[0];

	useEffect(() => {
		if (!color?.hex) return;
		document.body.style.setProperty('--background-fade-color', color.hex);
		document.body.classList.add('gradient-background');
		return () => {
			document.body.style.setProperty('--background-fade-color', 'var(--white)');
			document.body.classList.remove('gradient-background');
		};
	}, [color]);

	return (
		<nav className={cn(s.pagination, 'background-palette-animation')}>
			<Link href={{ pathname: `/bac-20-year-anniversary/[page]`, params: { page: prev.slug } }}>{t('previous')}</Link>
			<Link href={{ pathname: `/bac-20-year-anniversary` }} className={s.logo}>
				<img src='/images/anniversary-logo-20.svg' alt='BAC Logo' />
				<span>Översikt</span>
			</Link>
			<Link href={{ pathname: `/bac-20-year-anniversary/[page]`, params: { page: next.slug } }}>{t('next')}</Link>
		</nav>
	);
};
