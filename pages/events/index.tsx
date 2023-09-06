import s from "./[event].module.scss";
import React from "react";
import withGlobalProps from "/lib/withGlobalProps";
import { AllEventsDocument } from "/graphql";
import { useEffect } from "react";
import { pageProps } from "/lib/i18n";
import { randomLogoFonts } from "/lib/utils";
import { Thumbnail, CardContainer, Card, Article } from "/components";

export type Props = {
	events: EventRecord[]
	randomFonts: string[]
}

export type EventsByYear = {
	events: EventRecord[]
	year: number
}[]

export default function Events({ events, randomFonts }: Props) {

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
										typeFont={idx === 0 ? randomFonts[i] : null}
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
			randomFonts: randomLogoFonts(props.events.length),
			page: pageProps('event')
		},
		revalidate
	}
})