import '@/styles/index.scss';
import s from './layout.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { ContactDocument, GlobalDocument } from '@/graphql';
import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { Footer, Logo, Menu } from '@/components';
import { buildMenu } from '@/lib/menu';
import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export default async function RootLayout({ children, params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	setRequestLocale(locale);

	const { contact } = await apiQuery(ContactDocument);
	const menu = await buildMenu(locale);

	return (
		<>
			<html lang={locale === 'sv' ? 'se-SE' : 'en-US'}>
				<body id='root'>
					<NextIntlClientProvider locale={locale}>
						<div className={s.topline} />
						<Logo />
						<Menu items={menu} />
						<div className={s.layout}>{children}</div>
						<Footer contact={contact} />
						<div className={s.bottomline} />
					</NextIntlClientProvider>
				</body>
			</html>
		</>
	);
}

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({ locale });
}

export type BuildMetadataProps = {
	title?: string | any;
	description?: string | null | undefined;
	pathname?: string;
	image?: FileField | ImageFileField;
	locale: SiteLocale;
};

export async function buildMetadata({
	title,
	description,
	pathname,
	image,
	locale,
}: BuildMetadataProps): Promise<Metadata> {
	const {
		site: { globalSeo, faviconMetaTags },
	} = await apiQuery(GlobalDocument, {
		variables: { locale },
		revalidate: 60 * 60,
	});

	const siteName = 'Baltic Art Center';
	const url = pathname ? `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}` : process.env.NEXT_PUBLIC_SITE_URL;

	description = !description
		? globalSeo?.fallbackSeo?.description
		: description.length > 160
			? `${description.substring(0, 157)}...`
			: description;

	image = image ?? (globalSeo?.fallbackSeo?.image as FileField);
	title = title ? `${siteName} — ${title}` : siteName;

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		icons: faviconMetaTags.map(({ attributes: { rel, sizes, type, href: url } }) => ({
			rel,
			url,
			sizes,
			type,
		})) as Icon[],
		title,
		alternates: {
			canonical: url,
		},
		description,
		openGraph: {
			title: {
				template: `${siteName} — %s`,
				default: siteName ?? '',
			},
			description,
			url,
			images: image
				? [
						{
							url: `${image?.url}?w=1200&h=630&fit=fill&q=80`,
							width: 800,
							height: 600,
							alt: title,
						},
						{
							url: `${image?.url}?w=1600&h=800&fit=fill&q=80`,
							width: 1600,
							height: 800,
							alt: title,
						},
						{
							url: `${image?.url}?w=790&h=627&fit=crop&q=80`,
							width: 790,
							height: 627,
							alt: title,
						},
					]
				: undefined,
			locale: locale === 'sv' ? 'sv_SE' : 'en_US',
			type: 'website',
		},
	};
}
