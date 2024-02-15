import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { ContactDocument } from "/graphql";
import { pageProps } from "/lib/i18n";
import { Article, NewsletterForm } from "/components";

export type Props = {
	contact: ContactRecord
}

export type ContactsByYear = {
	year: number
	contacts: ContactRecord[]
}[]

export default function Contact({ contact: { id, image, mailingAddress, email, instagram, people } }: Props) {


	return (
		<Article
			id={'contact'}
			title={'Contact'}
			medium={true}
			image={image}
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
			<NewsletterForm />
		</Article>
	);
}


export const getStaticProps = withGlobalProps({ queries: [ContactDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: pageProps('contact')
		},
		revalidate
	}
})