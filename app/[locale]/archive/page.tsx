import s from './page.module.scss';
import { AllArchivesDocument, ArchiveIntroDocument } from '@/graphql';
import { Article, CardContainer, Card } from '@/components';
import { randomLogoFonts } from '@/lib/utils';
import React from 'react';
import { apiQuery } from 'next-dato-utils/api';
import { Link, locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export type ArchivesByYear = {
	year: number;
	archives: AllArchivesQuery['allArchives'][0][];
}[];

export default async function Archive({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { archiveIntro } = await apiQuery(ArchiveIntroDocument, { variables: { locale } });

	if (!archiveIntro) return notFound();

	const { allArchives } = await apiQuery(AllArchivesDocument, { all: true, variables: { locale } });
	const { title, text } = archiveIntro;
	const randomFonts = randomLogoFonts(allArchives.length);

	const archivesByYear = allArchives
		.reduce((acc, archive) => {
			const year = new Date(archive._createdAt).getFullYear();
			const yearArchives = acc.find((el) => el.year === year);
			if (yearArchives) yearArchives.archives.push(archive);
			else acc.push({ year, archives: [archive] });

			return acc;
		}, [] as ArchivesByYear)
		.sort((a, b) => (a.year < b.year ? 1 : -1));

	return (
		<Article id={'archive'} title={title} intro={text}>
			<div className={s.list}>
				{archivesByYear.map(({ archives, year }, i) => {
					return (
						<CardContainer key={i}>
							{archives.map(({ title, slug, _createdAt }, idx) => (
								<React.Fragment key={idx}>
									{idx === 0 && (
										<Card>
											<h2 className={s.year} style={{ fontFamily: randomFonts[i] }}>
												{year.toString()}
											</h2>
										</Card>
									)}
									<Card>
										<Link href={{ pathname: `/archive/[archive]`, params: { archive: slug } }}>
											<h3 className={s.title}>{title}</h3>
										</Link>
									</Card>
								</React.Fragment>
							))}
						</CardContainer>
					);
				})}
			</div>
		</Article>
	);
}
