import s from "./[page].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AnniversaryPageDocument, AllAnniversaryPagesDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { apiQuery } from "dato-nextjs-utils/api";
import { Article, Link } from "/components";
import { useRouter } from "next/router";
import { useEffect } from "react";

export type Props = {
	anniversaryPage: AnniversaryPageRecord
	anniversaryPages: AnniversaryPageRecord[]
}

export default function AnniversaryPage({ anniversaryPage: { id, title, subtitle, intro, image, gallery, video, videoCaption, content, cv, metaInfo, color }, anniversaryPage, anniversaryPages }: Props) {

	useEffect(() => {
		if (!color?.hex) return

		document.body.style.setProperty('--background-fade-color', color.hex)
		return () => document.body.style.setProperty('--background-fade-color', 'var(--white)')
	}, [color])

	return (
		<>
			<Article
				id={id}
				subtitle={title}
				title={subtitle}
				intro={intro}
				image={image}
				video={video}
				gallery={gallery}
				content={content}
				metaInfo={metaInfo}
				cv={cv}
			>
			</Article>
			<AnniversaryPagination pages={anniversaryPages} />
		</>
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
		<nav className={cn(s.pagination, 'background-palette-animation')}>
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

export async function getStaticPaths() {
	const { anniversaryPages } = await apiQuery(AllAnniversaryPagesDocument, { variables: { locale: 'en' } })
	const paths = anniversaryPages.map(({ slug }) => ({ params: { page: slug }, locale: 'sv' }))
	paths.forEach(el => paths.push({ ...el, locale: 'en' }))

	return {
		paths,
		fallback: 'blocking'
	}
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