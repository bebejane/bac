import 'dotenv/config';
import { buildClient } from '@datocms/cma-client';

const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN,
	environment: 'main',
});
