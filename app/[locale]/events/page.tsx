import React from 'react';
import { AllEventsDocument } from '@/graphql';
import { randomLogoFonts } from '@/lib/utils';
import { Thumbnail, CardContainer, Card, Article } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { getPathname, locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';

export type EventsByYear = {
	events: AllEventsQuery['allEvents'][0][];
	year: number;
}[];

export default async function EventsPage({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { allEvents } = await apiQuery(AllEventsDocument, { variables: { locale } });

	const randomFonts = randomLogoFonts(allEvents.length);
	const eventsByYear = allEvents
		.filter((p) => p.slug)
		.reduce((acc, event) => {
			const year = new Date(event._createdAt).getFullYear();
			const yearEvent = acc.find((el) => el.year === year);
			if (yearEvent) yearEvent.events.push(event);
			else acc.push({ year, events: [event] });

			return acc;
		}, [] as EventsByYear)
		.sort((a, b) => (a.year > b.year ? -1 : 1));

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
			<DraftMode path={`/events`} />
		</>
	);
}
