import s from "./[event].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { ContactDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { DatoMarkdown as Markdown } from "dato-nextjs-utils/components";
import { Article } from "/components";
export type Props = {
	contact: ContactRecord
}

export type ContactsByYear = {
	year: number
	contacts: ContactRecord[]
}[]

export default function Contact({ contact: { id, mailingAddress, email, instagram, people } }: Props) {


	return (
		<Article
			id={'contact'}
			title={'Contact'}
		>
			<p>
				{mailingAddress}
			</p>
			<ul>
				{people.map(({ firstName, lastName, role, email, phone }, idx) =>
					<li key={idx}>
						{role}<br />
						{firstName} {lastName}<br />
						{phone && <><a href={`tel://${phone}`}>{phone}</a><br /></>}
						{email && <><a href={`mailto:${email}`}>{email}</a></>}
					</li>
				)}
			</ul>
		</Article>
	);
}


export const getStaticProps = withGlobalProps({ queries: [ContactDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: {
				section: 'contact',
				slugs: pageSlugs('contact'),
			} as PageProps
		},
		revalidate
	}
})