import type { PageLoad } from './$types';

export const ssr = true;

export const load: PageLoad = ({ parent }) => {
	return parent().then((data) => ({
		...data,
		seo: {
			...data.seo,
			title: 'Favicon Concepts - Ibex Tools',
			description:
				'A comprehensive gallery of 31 favicon concept designs in 512×512 format, featuring AI-themed icons, tech patterns, and simplified design elements for the Ibex Tools application.'
		}
	}));
};
