import s from './page.module.scss';
import cn from 'classnames';
import { AnniversaryDocument, AllAnniversaryPagesDocument } from '@/graphql';
import { Article, Content } from '@/components';
import { Image } from 'react-datocms';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPathname, Link, locales } from '@/i18n/routing';
import { apiQuery } from 'next-dato-utils/api';
import { PaletteAnimation } from '@/app/[locale]/bac-20-year-anniversary/PaletteAnimation';
import { buildMetadata } from '@/app/[locale]/layout';
import { DraftMode } from 'next-dato-utils/components';
import { render as structuredToText } from 'datocms-structured-text-to-plain-text';
import { Metadata } from 'next';

export default async function Anniversary({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { anniversary, draftUrl } = await apiQuery(AnniversaryDocument, { variables: { locale } });
	const { allAnniversaryPages } = await apiQuery(AllAnniversaryPagesDocument, { all: true, variables: { locale } });

	if (!anniversary) return notFound();

	const t = (await getMessages({ locale })).Anniversary;
	const { id, title, intro, content } = anniversary;
	const path = getPathname({ locale, href: { pathname: '/bac-20-year-anniversary' } });
	return (
		<>
			<div className={s.logo}>
				<img src='/images/anniversary-logo.svg' />
			</div>
			<Article id={id}>
				<div className={s.introWrap}>
					<h1>{title}</h1>
					<div className={s.intro}>
						<Content id={id} content={intro} />
					</div>
				</div>
				<ul className={s.pages}>
					{allAnniversaryPages.map(({ title, introHeadline, image, slug }, idx) => (
						<li key={idx}>
							<Link href={{ pathname: `/bac-20-year-anniversary/[page]`, params: { page: slug } }}>
								<figcaption>
									<h2>{t.archiveVisit}</h2>
									<div>
										<h3>{title}</h3>
										<p className='mid'>{introHeadline}</p>
									</div>
								</figcaption>

								<figure>
									{image?.responsiveImage && (
										<Image data={image.responsiveImage} className={s.image} imgClassName={s.picture} />
									)}
								</figure>
							</Link>
						</li>
					))}
				</ul>
				<section className={cn('mid', s.text)}>
					<Content id={id} content={content} />
				</section>
			</Article>
			<PaletteAnimation />
			<DraftMode url={draftUrl} path={path} />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	const { anniversary } = await apiQuery(AnniversaryDocument, { variables: { locale } });

	return await buildMetadata({
		title: anniversary.title,
		description: structuredToText(anniversary.intro as any),
		locale,
		pathname: getPathname({ locale, href: { pathname: '/bac-20-year-anniversary' } }),
	});
}
