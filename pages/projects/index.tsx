import s from "./[project].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllProjectsDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { Thumbnail, CardContainer, Card } from "/components";
import { recordToSlug } from "/lib/utils";

export type Props = {
	projects: ProjectRecord[]
}


export default function Projects({ projects }: Props) {

	return (
		<section className={s.container}>
			<CardContainer>
				{projects.map(({ title, subtitle, image, slug }, r, idx) =>
					<Card>
						<Thumbnail title={title} subtitle={subtitle} image={image} slug={`/projects/${slug}`} />
					</Card>
				)}
			</CardContainer>
		</section>
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