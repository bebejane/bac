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
		<div className={s.container}>
			<CardContainer>
				{projects.map(({ title, image, slug }, r, idx) =>
					<Card>
						<Thumbnail title={title} image={image} slug={`/projects/${slug}`} />
					</Card>
				)}
			</CardContainer>
		</div>
	);
}


export const getStaticProps = withGlobalProps({ queries: [AllProjectsDocument] }, async ({ props, revalidate, context }: any) => {


	return {
		props: {
			...props,
			page: {
				section: 'project',
				slugs: pageSlugs('project'),
			} as PageProps
		},
		revalidate
	}
})