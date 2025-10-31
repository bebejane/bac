import { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default async function RootLayout({ children }) {
	return (
		<>
			<NuqsAdapter>{children}</NuqsAdapter>
		</>
	);
}
