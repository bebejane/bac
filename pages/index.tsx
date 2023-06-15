import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { StartDocument } from "/graphql";
import { Article, Block, Link } from "/components";
import { pageSlugs } from "/lib/i18n";

export type Props = {
	start: StartRecord
}

export default function Home({ start }: Props) {

	return (
		<Article id={'home'}>
			{start?.content?.map((block, idx) =>
				<section key={idx}>
					<Block
						data={block}
						record={start}
					/>
				</section>
			)}
			start content
		</Article>
	);
}

export const getStaticProps = withGlobalProps({ queries: [StartDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: {
				section: 'home',
				slugs: pageSlugs('home'),
			} as PageProps
		},
		revalidate
	}
})