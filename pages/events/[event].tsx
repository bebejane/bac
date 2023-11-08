import s from "./[event].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { EventDocument, AllEventsDocument } from "/graphql";
import { pageProps } from "/lib/i18n";
import { apiQuery } from "dato-nextjs-utils/api";
import { Article } from "/components";
import { apiQueryAll } from "dato-nextjs-utils/api";

export type Props = {
	event: EventRecord
}

export async function getStaticPaths() {
	const { events } = await apiQueryAll(AllEventsDocument)
	const paths = events.map(({ slug }) => ({ params: { event: slug }, locale: 'en' }))
	paths.forEach(el => paths.push({ ...el, locale: 'sv' }))

	return {
		paths: paths.filter(el => el.params.event),
		fallback: 'blocking'
	}
}

export default function Event({ event: { id, title, subtitle, image, introHeadline, video, videoImage, gallery, metaInfo, cv, intro, content, _createdAt }, event }: Props) {

	return (
		<Article
			id={id}
			title={`${subtitle || title}, ${new Date(_createdAt).getFullYear()}`}
			subtitle={introHeadline}
			image={image}
			gallery={gallery}
			video={video}
			videoImage={videoImage}
			intro={intro}
			content={content}
			metaInfo={metaInfo}
			cv={cv}
			backLink={'/events'}
		/>
	);
}


export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	const slug = context.params.event;
	const { event } = await apiQuery(EventDocument, { variables: { slug, locale: context.locale }, preview: context.preview })

	if (!event)
		return { notFound: true }

	return {
		props: {
			...props,
			event,
			page: pageProps('event', event._allSlugLocales)
		},
		revalidate
	}
})