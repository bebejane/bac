import s from "./[page].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AnniversaryPageDocument, AllAnniversaryPagesDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { apiQuery } from "dato-nextjs-utils/api";
import { Article, StructuredContent } from "/components";
import { apiQueryAll } from "dato-nextjs-utils/api";

export type Props = {
	anniversaryPage: AnniversaryPageRecord
}

export async function getStaticPaths() {
	const { anniversaryPages } = await apiQuery(AllAnniversaryPagesDocument, { variables: { locale: 'en' } })
	const paths = anniversaryPages.map(({ slug }) => ({ params: { page: slug }, locale: 'sv' }))
	paths.forEach(el => paths.push({ ...el, locale: 'en' }))

	return {
		paths,
		fallback: 'blocking'
	}
}

export default function AnniversaryPage({ anniversaryPage: { id, title, image, gallery, content }, anniversaryPage }: Props) {

	return (
		<Article
			id={id}
			title={title}
			image={image}
			gallery={gallery}
			content={content}
		/>
	);
}


export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	const slug = context.params.page;
	const { anniversaryPage } = await apiQuery(AnniversaryPageDocument, { variables: { slug, locale: context.locale }, preview: context.preview })

	if (!anniversaryPage)
		return { notFound: true }

	return {
		props: {
			...props,
			anniversaryPage,
			page: {
				section: 'anniversary',
				slugs: pageSlugs('anniversary', anniversaryPage._allSlugLocales),
			} as PageProps
		},
		revalidate
	}
})