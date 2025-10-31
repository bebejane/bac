import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import React from 'react';
import { Block } from '@/components';

export type PageProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function Home({ params }: PageProps) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	setRequestLocale(locale);

	const { start, draftUrl } = await apiQuery(StartDocument, { variables: { locale: locale as SiteLocale } });
	console.log(start);
	if (!start) return notFound();

	/*
	useEffect(() => { // Randomize line sizes
		const hrs = containerRef.current?.querySelectorAll('hr');
		hrs?.forEach(hr => {
			const i = Math.floor(Math.random() * lineSizes.length);
			hr.style.setProperty('height', `${lineSizes[i]}px`);
		})
	}, [])
	*/

	return (
		<>
			<div className={s.container}>
				{start?.content?.map((block, idx) => (
					<React.Fragment key={idx}>
						<hr />
						<Block data={block} record={start} />
					</React.Fragment>
				))}
			</div>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}

export async function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}
