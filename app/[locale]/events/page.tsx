import React from 'react';
import { AllEventsDocument } from '@/graphql';
import { randomLogoFonts } from '@/lib/utils';
import { Thumbnail, CardContainer, Card, Article } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { getPathname, locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { buildMetadata } from '@/app/[locale]/layout';

type EventsByYear = {
	events: AllEventsQuery['allEvents'][0][];
	year: number;
}[];

export default async function EventsPage({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const res = await apiQuery(AllEventsDocument, { all: true, variables: { locale } });
	const allEvents = res?.allEvents.filter(({ slug }) => slug);
	const draftUrl = res?.draftUrl;

	const randomFonts = randomLogoFonts(allEvents.length);
	const eventsByYear = allEvents
		.reduce((acc, event) => {
			const year = new Date(event._createdAt).getFullYear();
			const yearEvent = acc.find((el) => el.year === year);
			if (yearEvent) yearEvent.events.push(event);
			else acc.push({ year, events: [event] });

			return acc;
		}, [] as EventsByYear)
		.sort((a, b) => (a.year > b.year ? -1 : 1));

	const path = getPathname({ locale, href: { pathname: '/events' } });

	return (
		<>
			<Article id={'events'} title={'Events'}>
				<CardContainer>
					{eventsByYear.map(({ events, year }, i) => {
						return (
							<React.Fragment key={i}>
								{events.map(({ title, subtitle, image, slug }, idx) => (
									<Card key={idx}>
										<Thumbnail
											typeTitle={idx === 0 ? year.toString() : null}
											typeFont={idx === 0 ? randomFonts[i] : null}
											title={title}
											subtitle={subtitle}
											image={image as ImageFileField}
											slug={getPathname({ locale, href: { pathname: `/events/[event]`, params: { event: slug } } })}
										/>
									</Card>
								))}
							</React.Fragment>
						);
					})}
				</CardContainer>
			</Article>
			<DraftMode url={draftUrl} path={path} />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	const { Menu } = await getMessages({ locale });
	return await buildMetadata({
		title: Menu.event,
		locale,
		pathname: getPathname({ locale, href: { pathname: '/events' } }),
	});
}
