import s from "./[project].module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AllProjectsDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { Thumbnail, CardContainer, Card, Article } from "/components";

export type Props = {
	projects: ProjectRecord[]
}

export type ProjectsByYear = {
	projects: ProjectRecord[]
	year: number
}[]

export default function Projects({ projects }: Props) {

	const projectsByYear = projects.reduce((acc, project) => {
		const year = new Date(project._createdAt).getFullYear();
		const yearProject = acc.find((el) => el.year === year);
		if (yearProject)
			yearProject.projects.push(project);
		else
			acc.push({ year, projects: [project] });
		return acc;
	}, [] as ProjectsByYear).sort((a, b) => a.year > b.year ? -1 : 1);


	return (
		<Article
			id={'projects'}
			title={'Projects'}
		>

			<CardContainer>
				{projectsByYear.map(({ projects, year }, i) => {
					return (
						<>
							{projects.map(({ title, subtitle, image, slug, _createdAt }, idx) =>
								<Card key={idx}>
									<Thumbnail
										year={idx === 0 ? year : null}
										title={title}
										subtitle={subtitle}
										image={image}
										slug={`/projects/${slug}`}
									/>
								</Card >
							)}
						</>
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