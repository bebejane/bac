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
	console.log(events)
	return (
		<div className={s.container}>
			<CardContainer>
				{events.map(({ title, image, slug }, r, idx) =>
					<Card>
						<Thumbnail title={title} image={image} slug={`/events/${slug}`} />
					</Card>
				)}
			</CardContainer>
		</div>
	);
}


export const getStaticProps = withGlobalProps({ queries: [AllEventsDocument] }, async ({ props, revalidate, context }: any) => {


	return {
		props: {
			...props,
			page: {
				section: 'event',
				slugs: pageSlugs('event'),
			} as PageProps
		},
		revalidate
	}
})