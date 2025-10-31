import { ArchiveDocument, AllArchivesDocument } from '@/graphql';
import { Article } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { getPathname, locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/[locale]/layout';
import { render as structuredToText } from 'datocms-structured-text-to-plain-text';

export type Props = {
	archive: ArchiveRecord;
};

export default async function ArchivePage({ params }) {
	const { locale, archive: slug } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { archive } = await apiQuery(ArchiveDocument, { variables: { locale, slug } });

	if (!archive) return notFound();

	const { id, title, content, _createdAt } = archive;
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

export async function generateStaticParams({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();
	const { allArchives } = await apiQuery(AllArchivesDocument, { all: true, variables: { locale } });
	return allArchives.map(({ slug }) => ({ archive: slug }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale, archive: slug } = await params;
	const { archive } = await apiQuery(ArchiveDocument, {
		variables: {
			locale,
			slug,
		},
	});
	return await buildMetadata({
		title: archive.title,
		description: structuredToText(archive.content as any),
		locale,
		pathname: getPathname({ locale, href: { pathname: '/archive/[archive]', params: { archive: slug } } }),
	});
}
