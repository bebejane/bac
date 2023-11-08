import withGlobalProps from "/lib/withGlobalProps";
import { ArchiveDocument, AllArchivesDocument } from "/graphql";
import { pageProps } from "/lib/i18n";
import { apiQuery } from "dato-nextjs-utils/api";
import { Article } from "/components";
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

export default function Archive({ archive: { id, title, content, _createdAt }, archive }: Props) {

	return (
		<Article
			id={id}
			title={`${title}, ${new Date(_createdAt).getFullYear()}`}
			medium={true}
			noImages={true}
			content={content}
			backLink={'/archive'}
		/>
	);
}


export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	const slug = context.params.archive;
	const { archive } = await apiQuery(ArchiveDocument, { variables: { slug, locale: context.locale }, preview: context.preview })

	if (!archive)
		return { notFound: true, revalidate }

	return {
		props: {
			...props,
			archive,
			page: pageProps('archive', archive._allSlugLocales)
		},
		revalidate
	}
})