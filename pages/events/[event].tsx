import s from "./[event].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { EventDocument, AllEventsDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
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

export default function Event({ event: { id, title, subtitle, image, gallery, metaInfo, cv, content }, event }: Props) {

	return (
		<Article
			id={id}
			title={subtitle}
			subtitle={title}
			image={image}
			gallery={gallery}
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
			page: {
				section: 'event',
				slugs: pageSlugs('event', event._allSlugLocales),
			} as PageProps
		},
		revalidate
	}
})