import { ArchiveDocument, AllArchivesDocument } from '@/graphql';
import { Article } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';

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
