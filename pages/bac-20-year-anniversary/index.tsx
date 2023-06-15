import s from "./[event].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AnniversaryDocument, AllAnniversaryPagesDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { DatoMarkdown as Markdown } from "dato-nextjs-utils/components";
import { Article, Link } from "/components";

export type Props = {
	anniversary: AnniversaryRecord
	anniversaryPages: AnniversaryPageRecord[]

}


export default function Anniversary({ anniversary, anniversaryPages }: Props) {

	return (
		<Article
			id={'anniversary'}
			title={'Anniversary'}
		>
			<ul>
				{anniversaryPages.map(({ title, slug }, idx) =>
					<li key={idx}>
						<Link href={`/bac-20-year-anniversary/${slug}`}>
							{title}
						</Link>
					</li>
				)}
			</ul>
		</Article>
	);
}


export const getStaticProps = withGlobalProps({ queries: [AnniversaryDocument, AllAnniversaryPagesDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: {
				section: 'anniversary',
				slugs: pageSlugs('anniversary'),
			} as PageProps
		},
		revalidate
	}
})