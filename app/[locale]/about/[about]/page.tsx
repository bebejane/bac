import { apiQuery } from 'next-dato-utils/api';
import { AboutDocument, AllAboutsDocument } from '@/graphql';
import { Article } from '@/components';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export default async function AboutPage({ params }) {
	const { locale, about: slug } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { about } = await apiQuery(AboutDocument, { variables: { locale, slug } });

	if (!about) return notFound();

	const { id, title, content, image, _seoMetaTags } = about;

	return (
		<Article id={id} title={title} image={image as ImageFileField} medium={true} content={content} seo={_seoMetaTags} />
	);
}

export async function generateStaticParams({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();
	const { allAbouts } = await apiQuery(AllAboutsDocument, { all: true, variables: { locale } });
	return allAbouts.map((about) => ({ about: about.slug }));
}
