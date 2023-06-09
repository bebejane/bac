import s from "./[event].module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AllEventsDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { Thumbnail, CardContainer, Card, Article } from "/components";
import React from "react";

export type Props = {
	events: EventRecord[]
}

export type EventsByYear = {
	events: EventRecord[]
	year: number
}[]

export default function Events({ events }: Props) {

	const eventsByYear = events.reduce((acc, event) => {
		const year = new Date(event._createdAt).getFullYear();
		const yearEvent = acc.find((el) => el.year === year);
		if (yearEvent)
			yearEvent.events.push(event);
		else
			acc.push({ year, events: [event] });

		return acc;
	}, [] as EventsByYear).sort((a, b) => a.year > b.year ? -1 : 1);


	return (

		<Article
			id={'events'}
			title={'Events'}
		>
			<CardContainer>
				{eventsByYear.map(({ events, year }, i) => {
					return (
						<React.Fragment key={i}>
							{events.map(({ title, subtitle, image, slug, _createdAt }, idx) =>
								<Card key={idx}>
									<Thumbnail
										typeTitle={idx === 0 ? year.toString() : null}
										title={title}
										subtitle={subtitle}
										image={image}
										slug={`/events/${slug}`}
									/>
								</Card>
							)}
						</React.Fragment>
					)
				})}
			</CardContainer>
		</Article>

	);
}


export const getStaticProps = withGlobalProps({ queries: [AllEventsDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			events: props.events.filter((p: EventRecord) => p.slug),
			page: {
				section: 'event',
				slugs: pageSlugs('event'),
			} as PageProps
		},
		revalidate
	}
})