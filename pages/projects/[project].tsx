import s from "./[project].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { ProjectDocument, AllProjectsDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { apiQuery } from "dato-nextjs-utils/api";
import { StructuredContent } from "/components";
import { apiQueryAll } from "dato-nextjs-utils/api";

export type Props = {
	project: ProjectRecord
}

export async function getStaticPaths() {
	const { projects } = await apiQueryAll(AllProjectsDocument)
	const paths = projects.map(({ slug }) => ({ params: { project: slug }, locale: 'en' }))
	paths.forEach(el => paths.push({ ...el, locale: 'sv' }))

	return {
		paths: paths.filter(el => el.params.project),
		fallback: 'blocking'
	}
}

export default function Project({ project: { title, content }, project }: Props) {

	return (
		<section className={s.container}>
			<h1>{title}</h1>
			<StructuredContent
				id={project.id}
				record={project}
				content={content}
			/>
		</section>
	);
}


export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	const slug = context.params.project;
	const { project } = await apiQuery(ProjectDocument, { variables: { slug, locale: context.locale }, preview: context.preview })

	if (!project)
		return { notFound: true }

	return {
		props: {
			...props,
			project,
			page: {
				section: 'project',
				slugs: pageSlugs('project'),
			} as PageProps
		},
		revalidate
	}
})