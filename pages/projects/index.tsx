import s from "./[project].module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AllProjectsDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { Thumbnail, CardContainer, Card, Article, FilterBar } from "/components";
import { useTranslations } from "next-intl";
import { sortSwedish } from 'dato-nextjs-utils/utils';

import React from "react";

export type Props = {
	projects: ProjectRecord[]
}

export type ProjectsByType = {
	projects: ProjectRecord[]
	typeTitle: string
}[]

const randomLogoFonts = (count: number) => {
	const fonts = ['Logo1', 'Logo2', 'Logo3', 'Logo4']
	const items = []

	for (let i = 0; i < count; i++) {
		const f = fonts[Math.floor(Math.random() * fonts.length)]
		if (items.slice(-1)[0] === f) {
			i--
			continue
		}
		else
			items.push(f)
	}
	return items
}

export default function Projects({ projects }: Props) {

	const t = useTranslations()

	const [filter, setFilter] = React.useState<'year' | 'artistName'>('year')

	const projectsByYear = projects.reduce((acc, project) => {
		const year = new Date(project._createdAt).getFullYear().toString();
		const yearProject = acc.find((el) => el.typeTitle === year);
		if (yearProject)
			yearProject.projects.push(project);
		else
			acc.push({ typeTitle: year, projects: [project] });
		return acc;
	}, [] as ProjectsByType).sort((a, b) => a.typeTitle > b.typeTitle ? -1 : 1);

	const projectsByArtistName = sortSwedish(projects.reduce((acc, project) => {
		const letter = project.subtitle[0]?.toUpperCase();
		const letterProject = acc.find((el) => el.typeTitle === letter);

		if (letterProject)
			letterProject.projects.push(project);
		else
			acc.push({ typeTitle: letter, projects: [project] });
		return acc;
	}, [] as ProjectsByType), 'typeTitle') as ProjectsByType

	const projectsByType = filter === 'year' ? projectsByYear : projectsByArtistName;
	const logoFonts = randomLogoFonts(projectsByType.reduce((acc, { projects }) => acc + projects.length, 0))

	return (
		<Article
			id={'projects'}
			title={'Projects'}
		>
			<FilterBar
				options={[{ id: 'year', label: t('FilterBar.year') }, { id: 'artistName', label: t('FilterBar.artistName') }]}
				onChange={(value) => setFilter(value as 'year' | 'artistName')}
			/>
			<CardContainer key={filter}>
				{projectsByType.map(({ projects, typeTitle }, i) => {
					return (
						<React.Fragment key={i}>
							{projects.map(({ title, subtitle, image, slug }, idx) =>
								<Card key={idx}>
									<Thumbnail
										typeTitle={idx === 0 ? typeTitle : null}
										typeFont={logoFonts.splice(0, 1)[0]}
										title={title}
										subtitle={subtitle}
										image={image}
										slug={`/projects/${slug}`}
									/>
								</Card >
							)}
						</React.Fragment>
					)
				})}
			</CardContainer>
		</Article>
	);
}


export const getStaticProps = withGlobalProps({ queries: [AllProjectsDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			projects: props.projects.filter((p: ProjectRecord) => p.slug),
			page: {
				section: 'project',
				slugs: pageSlugs('project'),
			} as PageProps
		},
		revalidate
	}
})
