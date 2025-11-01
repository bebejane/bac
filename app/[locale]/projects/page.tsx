import s from './page.module.scss';
import React from 'react';
import { AllProjectsDocument } from '@/graphql';
import { Thumbnail, CardContainer, Card, Article, FilterBar } from '@/components';
import { sortSwedish } from 'next-dato-utils/utils';
import { randomLogoFonts } from '@/lib/utils';
import { apiQuery } from 'next-dato-utils/api';
import { getPathname, locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { getMessages } from 'next-intl/server';
import { loadSearchParams } from './searchParams';
import { buildMetadata } from '@/app/[locale]/layout';
import { Metadata } from 'next';

export type Props = {
	projects: AllProjectsQuery['allProjects'][0][];
	randomFonts: string[];
};

export type ProjectsByType = {
	projects: AllProjectsQuery['allProjects'][0][];
	typeTitle: string;
}[];

export default async function Projects({ params, searchParams }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { filter } = await loadSearchParams(searchParams);
	const t = (await getMessages({ locale })).FilterBar;
	const res = await apiQuery(AllProjectsDocument, { all: true, variables: { locale } });
	const allProjects = res?.allProjects.filter(({ slug }) => slug);
	const draftUrl = res?.draftUrl;

	const randomFonts = randomLogoFonts(allProjects.length);
	const projectsByYear = allProjects
		.reduce((acc, project) => {
			const year = new Date(project.endDate ?? project._createdAt).getFullYear().toString();
			const yearProject = acc.find((el) => el.typeTitle === year);
			if (yearProject) yearProject.projects.push(project);
			else acc.push({ typeTitle: year, projects: [project] });
			return acc;
		}, [] as ProjectsByType)
		.sort((a, b) => (a.typeTitle > b.typeTitle ? -1 : 1));

	const projectsByArtistName = sortSwedish(
		allProjects.reduce((acc, project) => {
			const letter = project.subtitle[0]?.toUpperCase();
			const letterProject = acc.find((el) => el.typeTitle === letter);

			if (letterProject) letterProject.projects.push(project);
			else acc.push({ typeTitle: letter, projects: [project] });
			return acc;
		}, [] as ProjectsByType),
		'typeTitle'
	) as ProjectsByType;

	const projectsByType = filter === 'year' ? projectsByYear : projectsByArtistName;

	const path = getPathname({ locale, href: { pathname: '/projects' } });

	return (
		<>
			<Article id={'projects'} title={'Projects'} key={filter}>
				<FilterBar
					value={filter}
					options={[
						{ value: 'year', label: t.year },
						{ value: 'artistName', label: t.artistName },
					]}
				/>
				<CardContainer>
					{projectsByType.map(({ projects, typeTitle }, i) => {
						return (
							<React.Fragment key={i}>
								{projects.map(({ title, subtitle, image, slug }, idx) => (
									<Card key={idx}>
										<Thumbnail
											typeTitle={idx === 0 ? typeTitle : null}
											typeFont={idx === 0 ? randomFonts[i] : null}
											title={title}
											subtitle={subtitle}
											image={image as ImageFileField}
											slug={getPathname({
												locale,
												href: { pathname: `/projects/[project]`, params: { project: slug } },
											})}
										/>
									</Card>
								))}
							</React.Fragment>
						);
					})}
				</CardContainer>
			</Article>
			<DraftMode url={draftUrl} path={path} />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	const { Menu } = await getMessages({ locale });
	return await buildMetadata({
		title: Menu.project,
		locale,
		pathname: getPathname({ locale, href: { pathname: '/projects' } }),
	});
}
