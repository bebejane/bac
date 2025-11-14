import { apiQuery } from 'next-dato-utils/api';
import { AboutDocument, AllAboutsDocument } from '@/graphql';
import { Article } from '@/components';
import { getPathname, locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/[locale]/layout';

export default async function AboutPage({ params }) {
	const { locale, about: slug } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { about, draftUrl } = await apiQuery(AboutDocument, { variables: { locale, slug } });

	if (!about) return notFound();

	const { id, title, content, image, _seoMetaTags } = about;
	const path = getPathname({ locale, href: { pathname: '/about/[about]', params: { about: slug } } });

	return (
		<>
			<Article
				id={id}
				title={title}
				image={image as ImageFileField}
				medium={true}
				content={content}
				seo={_seoMetaTags}
			/>
			<DraftMode url={draftUrl} path={path} />
		</>
	);
}

export async function generateStaticParams({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();
	const { allAbouts } = await apiQuery(AllAboutsDocument, { all: true, variables: { locale } });
	return allAbouts.map((about) => ({ about: about.slug }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale, about: slug } = await params;
	const { about } = await apiQuery(AboutDocument, {
		variables: {
			locale,
			slug,
		},
	});

	if (!about) return notFound();

	return await buildMetadata({
		title: about.title,
		locale,
		image: about.image as ImageFileField,
		pathname: getPathname({ locale, href: { pathname: '/about/[about]', params: { about: slug } } }),
	});
}
