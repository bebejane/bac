import s from "./[archive].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { ArchiveDocument, AllArchivesDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { apiQuery } from "dato-nextjs-utils/api";
import { Article, StructuredContent } from "/components";
import { apiQueryAll } from "dato-nextjs-utils/api";

export type Props = {
	archive: ArchiveRecord
}

export async function getStaticPaths() {
	const { archives } = await apiQueryAll(AllArchivesDocument)
	const paths = archives.map(({ slug }) => ({ params: { archive: slug }, locale: 'sv' }))
	paths.forEach(el => paths.push({ ...el, locale: 'en' }))

	return {
		paths,
		fallback: 'blocking'
	}
}

export default function Archive({ archive: { id, title, content }, archive }: Props) {

	return (
		<Article
			id={id}
			title={title}
			content={content}
		/>
	);
}


export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	const slug = context.params.archive;
	const { archive } = await apiQuery(ArchiveDocument, { variables: { slug, locale: context.locale }, preview: context.preview })

	if (!archive)
		return { notFound: true }

	return {
		props: {
			...props,
			archive,
			page: {
				section: 'archive',
				slugs: pageSlugs('archive', archive._allSlugLocales),
			} as PageProps
		},
		revalidate
	}
})