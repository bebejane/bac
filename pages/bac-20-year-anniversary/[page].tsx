import s from "./[page].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AnniversaryPageDocument, AllAnniversaryPagesDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { apiQuery } from "dato-nextjs-utils/api";
import { Article, StructuredContent, Link } from "/components";
import { apiQueryAll } from "dato-nextjs-utils/api";
import { useRouter } from "next/router";

export type Props = {
	anniversaryPage: AnniversaryPageRecord
	anniversaryPages: AnniversaryPageRecord[]
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

export default function AnniversaryPage({ anniversaryPage: { id, title, image, gallery, content }, anniversaryPage, anniversaryPages }: Props) {

	return (
		<Article
			id={id}
			title={title}
			image={image}
			gallery={gallery}
			content={content}
		>
			<AnniversaryPagination pages={anniversaryPages} />
		</Article>
	);
}

export const AnniversaryPagination = ({ pages }: { pages: AnniversaryPageRecord[] }) => {

	const { asPath } = useRouter()
	const currentSlug = asPath.split('/').at(-1)
	const prevIndex = pages.findIndex(({ slug }) => slug === currentSlug) - 1
	const nextIndex = pages.findIndex(({ slug }) => slug === currentSlug) + 1
	const prev = pages[prevIndex] ?? pages[pages.length - 1]
	const next = pages[nextIndex] ?? pages[0]

	return (
		<nav className={s.pagination}>
			<Link href={`/bac-20-year-anniversary/${prev.slug}`}>
				Föregående
			</Link>
			<Link href={`/bac-20-year-anniversary`} className={s.logo}>
				<img src="/images/anniversary-logo-20.svg" alt="BAC Logo" />
				<span>Översikt</span>
			</Link>
			<Link href={`/bac-20-year-anniversary/${next.slug}`}>
				Nästa
			</Link>
		</nav>
	)
}


export const getStaticProps = withGlobalProps({ queries: [AllAnniversaryPagesDocument] }, async ({ props, revalidate, context }: any) => {

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