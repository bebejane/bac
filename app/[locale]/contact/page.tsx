import s from './page.module.scss';
import { ContactDocument } from '@/graphql';
import { Article, NewsletterForm } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';

export default async function ContactPage({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	const { contact, draftUrl } = await apiQuery(ContactDocument, { variables: { locale } });

	return (
		<>
			<Article id={'contact'} title={'Contact'} medium={true} image={contact.image as ImageFileField}>
				<div className='structured'>
					<p>{contact.mailingAddress}</p>
					<ul className={s.people}>
						{contact.people.map(({ firstName, lastName, role, email, phone }, idx) => (
							<li key={idx}>
								<strong>
									{firstName} {lastName}
								</strong>
								<br />
								{role}
								<br />
								{phone && (
									<>
										<a href={`tel://${phone}`}>{phone}</a>
										<br />
									</>
								)}
								{email && (
									<>
										<a href={`mailto:${email}`}>{email}</a>
									</>
								)}
							</li>
						))}
					</ul>
				</div>
				<NewsletterForm />
			</Article>
			<DraftMode url={draftUrl} path={`/contact`} />
		</>
	);
}
