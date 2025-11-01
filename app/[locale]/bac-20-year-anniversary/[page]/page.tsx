import s from './[page].module.scss';
import cn from 'classnames';
import { AnniversaryPageDocument, AllAnniversaryPagesDocument } from '@/graphql';
import { Article } from '@/components';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPathname, Link, locales } from '@/i18n/routing';
import { apiQuery } from 'next-dato-utils/api';
import { Pagination } from './Pagination';
import { buildMetadata } from '@/app/[locale]/layout';
import { Metadata } from 'next';
import { render as structuredToText } from 'datocms-structured-text-to-plain-text';
import { DraftMode } from 'next-dato-utils/components';

export default async function AnniversaryPage({ params }) {
	const { locale, page: slug } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { anniversaryPage, draftUrl } = await apiQuery(AnniversaryPageDocument, { variables: { locale, slug } });
	const { allAnniversaryPages } = await apiQuery(AllAnniversaryPagesDocument, { all: true, variables: { locale } });

	if (!anniversaryPage) return notFound();

	const t = (await getMessages({ locale })).Anniversary;
	const path = getPathname({ locale, href: { pathname: '/bac-20-year-anniversary/[page]', params: { page: slug } } });

	const {
		id,
		title,
		subtitle,
		introHeadline,
		intro,
		content,
		image,
		gallery,
		video,
		videoImage,
		cv,
		metaInfo,
		_seoMetaTags,
		color,
	} = anniversaryPage;

	return (
		<>
			<Article
				id={id}
				subtitle={`${title}, ${introHeadline}`}
				title={subtitle}
				intro={intro}
				image={image as ImageFileField}
				video={video}
				videoImage={videoImage as ImageFileField}
				gallery={gallery as FileField[]}
				content={content}
				metaInfo={metaInfo as MetaInfoRecord[]}
				cv={cv as CvRecord[]}
				seo={_seoMetaTags}
			/>
			<Pagination pages={allAnniversaryPages} color={color as ColorField} />
			<DraftMode url={draftUrl} path={path} />
		</>
	);
}

export async function generateStaticParams({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();
	const { allAnniversaryPages } = await apiQuery(AllAnniversaryPagesDocument, { all: true, variables: { locale } });
	return allAnniversaryPages.filter(({ slug }) => slug).map(({ slug }) => ({ page: slug }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale, page: slug } = await params;
	const { anniversaryPage } = await apiQuery(AnniversaryPageDocument, { variables: { locale, slug } });
	return await buildMetadata({
		title: anniversaryPage.title,
		description: structuredToText(anniversaryPage.content as any),
		image: anniversaryPage.image as ImageFileField,
		locale,
		pathname: getPathname({ locale, href: { pathname: '/bac-20-year-anniversary/[page]', params: { page: slug } } }),
	});
}
