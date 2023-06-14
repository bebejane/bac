import s from "./[archive].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { ArchiveDocument, AllArchivesDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { apiQuery } from "dato-nextjs-utils/api";
import { StructuredContent } from "/components";
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

export default function Archive({ archive: { title, content }, archive }: Props) {

	return (
		<section className={s.container}>
			<h1>{title}</h1>
			<StructuredContent
				id={archive.id}
				record={archive}
				content={content}
			/>
		</section>
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
				slugs: pageSlugs('archive'),
			} as PageProps
		},
		revalidate
	}
})