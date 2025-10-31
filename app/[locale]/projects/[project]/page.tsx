import { ProjectDocument, AllProjectsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { Article } from '@/components';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/routing';

export default async function ProjectPage({ params }) {
	const { locale, project: slug } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { project } = await apiQuery(ProjectDocument, { variables: { locale, slug } });

	if (!project) return notFound();

	const {
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
	} = project;

	return (
		<Article
			id={project.id}
			title={`${subtitle || title}, ${new Date(_createdAt).getFullYear()}`}
			subtitle={introHeadline}
			image={image as ImageFileField}
			gallery={gallery as FileField[]}
			video={video}
			videoImage={videoImage as ImageFileField}
			intro={intro}
			content={content}
			metaInfo={project.metaInfo as MetaInfoRecord[]}
			cv={project.cv as CvRecord[]}
			seo={_seoMetaTags}
			backLink={'/projects'}
		/>
	);
}

export async function generateStaticParams({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();
	const { allProjects } = await apiQuery(AllProjectsDocument, { all: true, variables: { locale } });
	return allProjects.filter(({ slug }) => slug).map(({ slug }) => ({ project: slug }));
}
