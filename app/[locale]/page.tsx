import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { setRequestLocale } from 'next-intl/server';
import { getPathname, locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import React from 'react';
import { Block, RandomLineSizes } from '@/components';

export default async function Home({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	setRequestLocale(locale);

	const { start, draftUrl } = await apiQuery(StartDocument, { variables: { locale: locale as SiteLocale } });

	if (!start) return notFound();

	const path = getPathname({ locale, href: { pathname: '/' } });

	return (
		<>
			<div id='start' className={s.container}>
				{start?.content?.map((block, idx) => (
					<React.Fragment key={idx}>
						<hr />
						<Block data={block} record={start} />
					</React.Fragment>
				))}
			</div>
			<RandomLineSizes />
			<DraftMode url={draftUrl} path={path} />
		</>
	);
}

export async function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}
