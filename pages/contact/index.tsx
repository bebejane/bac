import s from "./index.module.scss";
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
			medium={true}
		>
			<div className="structured">
				<p>
					{mailingAddress}
				</p>
				<ul className={s.people}>
					{people.map(({ firstName, lastName, role, email, phone }, idx) =>
						<li key={idx}>
							<strong>
								{firstName} {lastName}</strong><br />
							{role}<br />
							{phone && <><a href={`tel://${phone}`}>{phone}</a><br /></>}
							{email && <><a href={`mailto:${email}`}>{email}</a></>}
						</li>
					)}
				</ul>
			</div>
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