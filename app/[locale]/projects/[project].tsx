import withGlobalProps from '@/lib/withGlobalProps';
import { ProjectDocument, AllProjectsDocument } from '@/graphql';
import { pageProps } from '@/lib/i18n';
import { apiQuery, apiQueryAll } from 'dato-next-utils/api';
import { Article } from '@/components';

export type Props = {
	project: ProjectRecord;
};

export async function getStaticPaths() {
	const { projects } = await apiQueryAll(AllProjectsDocument);
	const paths = projects.map(({ slug }) => ({ params: { project: slug }, locale: 'en' }));
	paths.forEach((el) => paths.push({ ...el, locale: 'sv' }));

	return {
		paths: paths.filter((el) => el.params.project),
		fallback: 'blocking',
	};
}

export default function Project({
	project: {
		title,
		subtitle,
		introHeadline,
		content,
		image,
		gallery,
		video,
		videoImage,
		intro,
		_createdAt,
		_seoMetaTags,
	},
	project,
}: Props) {
	return (
		<Article
			id={project.id}
			title={`${subtitle || title}, ${new Date(_createdAt).getFullYear()}`}
			subtitle={introHeadline}
			image={image}
			gallery={gallery}
			video={video}
			videoImage={videoImage}
			intro={intro}
			content={content}
			metaInfo={project.metaInfo}
			cv={project.cv}
			seo={_seoMetaTags}
			backLink={'/projects'}
		/>
	);
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {
	const slug = context.params.project;
	const { project } = await apiQuery(ProjectDocument, {
		variables: { slug, locale: context.locale },
		preview: context.preview,
	});

	if (!project) return { notFound: true, revalidate };

	return {
		props: {
			...props,
			project,
			page: pageProps('project', project._allSlugLocales),
		},
		revalidate,
	};
});
