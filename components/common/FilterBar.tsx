'use client';

import s from './FilterBar.module.scss';
import cn from 'classnames';
import { use, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, Link, AppPathnames } from '@/i18n/routing';

export type FilterOption = {
	value: string;
	label: string;
};

export type Props = {
	options: FilterOption[];
	value: string;
};

export default function FilterBar({ options = [], value }: Props) {
	const t = useTranslations('FilterBar');
	const pathname = usePathname();
	const locale = useLocale();

	return (
		<nav className={s.filter}>
			<span>{t('sortBy')}:</span>
			{options.map((opt, idx) => (
				<Link
					key={idx}
					href={`${pathname}?filter=${opt.value}` as any}
					className={cn(s.option, value === opt.value && s.selected)}
					locale={locale}
				>
					{opt.label}
				</Link>
			))}
		</nav>
	);
}
