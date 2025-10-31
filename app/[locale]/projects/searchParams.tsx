import { parseAsString, createLoader } from 'nuqs/server';
export const filterSearchParams = {
	filter: parseAsString.withDefault('year'),
};
export const loadSearchParams = createLoader(filterSearchParams);
