import { EventDocument, AllEventsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { Article } from '@/components';
import { getPathname, locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/app/[locale]/layout';
import { render as structuredToText } from 'datocms-structured-text-to-plain-text';
import { Metadata } from 'next';

export default async function EventPage({ params }) {
	const { locale, event: slug } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { event } = await apiQuery(EventDocument, { variables: { locale, slug } });

	if (!event) return notFound();

	const {
		id,
		title,
		subtitle,
		image,
		introHeadline,
		video,
		videoImage,
		gallery,
		metaInfo,
		cv,
		intro,
		content,
		_createdAt,
		_seoMetaTags,
	} = event;

	return (
		<Article
			id={id}
			title={`${subtitle || title}, ${new Date(_createdAt).getFullYear()}`}
			subtitle={introHeadline}
			image={image as ImageFileField}
			gallery={gallery as FileField[]}
			video={video}
			videoImage={videoImage as ImageFileField}
			intro={intro}
			content={content}
			metaInfo={metaInfo as MetaInfoRecord[]}
			cv={cv as CvRecord[]}
			seo={_seoMetaTags}
			backLink={'/events'}
		/>
	);
}

export async function generateStaticParams({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();
	const { allEvents } = await apiQuery(AllEventsDocument, { all: true, variables: { locale } });
	return allEvents.filter(({ slug }) => slug).map(({ slug }) => ({ event: slug }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale, event: slug } = await params;
	const { event } = await apiQuery(EventDocument, { variables: { locale, slug } });
	return await buildMetadata({
		title: event.title,
		description: structuredToText(event.intro as any),
		image: event.image as ImageFileField,
		locale,
		pathname: getPathname({ locale, href: { pathname: '/events/[event]', params: { event: slug } } }),
	});
}
