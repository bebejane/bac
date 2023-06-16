import s from "./[about].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AboutDocument, AllAboutsDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { apiQuery } from "dato-nextjs-utils/api";
import { Article } from "/components";
import { apiQueryAll } from "dato-nextjs-utils/api";

export type Props = {
	about: AboutRecord
}

export async function getStaticPaths() {
	const { abouts } = await apiQueryAll(AllAboutsDocument)
	const paths = abouts.filter(el => el.slug).map(({ slug }) => ({ params: { about: slug }, locale: 'sv' }))
	paths.forEach(el => paths.push({ ...el, locale: 'en' }))

	return {
		paths,
		fallback: 'blocking'
	}
}

export default function About({ about: { id, title, content }, about }: Props) {

	return (
		<Article
			id={id}
			title={title}
			content={content}
		/>
	);
}


export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	const slug = context.params.about;
	const { about } = await apiQuery(AboutDocument, { variables: { slug, locale: context.locale }, preview: context.preview })

	if (!about)
		return { notFound: true }

	return {
		props: {
			...props,
			about,
			page: {
				section: 'about',
				slugs: pageSlugs('about', about._allSlugLocales),
			} as PageProps
		},
		revalidate
	}
})