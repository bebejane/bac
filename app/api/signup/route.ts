import { z } from 'zod';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const POST = async (req: Request) => {
	try {
		const { email, locale } = await req.json();

		if (!locale || (locale !== 'en' && locale !== 'sv')) throw new Error('Locale not valid!');

		try {
			z.string()
				.email({ message: 'Ogiltig e-post adress' })
				.parse(email as string);
		} catch (e) {
			throw new Error('E-mail address not valid!');
		}

		const apiEndpoint = 'https://api.createsend.com/api/v3.3';
		const signupEndpoint = `${apiEndpoint}/subscribers/${process.env[`CAMPAIGN_MONITOR_LIST_ID_${locale.toUpperCase()}`]}.json`;
		const basicAuth = btoa(`${process.env.CAMPAIGN_MONITOR_API_KEY}:`);

		console.log('subscribe', email, locale);

		const response = await fetch(signupEndpoint, {
			body: JSON.stringify({
				EmailAddress: email,
				Name: '',
				Resubscribe: false,
				RestartSubscriptionBasedAutoresponders: true,
				ConsentToTrack: 'Yes',
			}),
			method: 'POST',
			cache: 'no-store',
			headers: {
				'Authorization': `Basic ${basicAuth}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.Message);
		}

		const data = await response.json();

		return new Response(JSON.stringify({ success: true, data }), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ success: false, message: error.message }), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}
};
