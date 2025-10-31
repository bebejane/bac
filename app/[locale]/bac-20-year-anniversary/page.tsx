import s from './page.module.scss';
import cn from 'classnames';
import { AnniversaryDocument, AllAnniversaryPagesDocument } from '@/graphql';
import { Article, StructuredContent } from '@/components';
import { Image } from 'react-datocms';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link, locales } from '@/i18n/routing';
import { apiQuery } from 'next-dato-utils/api';
import { PaletteAnimation } from '@/app/[locale]/bac-20-year-anniversary/PaletteAnimation';

export type Props = {
	anniversary: AnniversaryRecord;
	anniversaryPages: AnniversaryPageRecord[];
};

export default async function Anniversary({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { anniversary } = await apiQuery(AnniversaryDocument, { variables: { locale } });
	const { allAnniversaryPages } = await apiQuery(AllAnniversaryPagesDocument, { all: true, variables: { locale } });

	if (!anniversary) return notFound();

	const t = (await getMessages({ locale })).Anniversary;
	const { id, title, intro, content } = anniversary;

	return (
		<>
			<div className={s.logo}>
				<img src='/images/anniversary-logo.svg' />
			</div>
			<Article id={id}>
				<div className={s.introWrap}>
					<h1>{title}</h1>
					<div className={s.intro}>
						<StructuredContent id={id} record={anniversary} content={intro} />
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
					<StructuredContent id={id} record={anniversary} content={content} />
				</section>
			</Article>
			<PaletteAnimation />
		</>
	);
}
