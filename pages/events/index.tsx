import s from "./[event].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllEventsDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { Thumbnail, CardContainer, Card } from "/components";
import { recordToSlug } from "/lib/utils";

export type Props = {
	events: EventRecord[]
}

export default function Events({ events }: Props) {

	return (
		<section className={s.container}>
			<CardContainer>
				{events.map(({ title, subtitle, image, slug }, idx) =>
					<Card key={idx} >
						<Thumbnail title={title} subtitle={subtitle} image={image} slug={`/events/${slug}`} />
					</Card>
				)}
			</CardContainer>
		</section >
	);
}


export const getStaticProps = withGlobalProps({ queries: [AllEventsDocument] }, async ({ props, revalidate, context }: any) => {


	return {
		props: {
			...props,
			events: props.events.filter((e: EventRecord) => e.slug),
			page: {
				section: 'event',
				slugs: pageSlugs('event'),
			} as PageProps
		},
		revalidate
	}
})