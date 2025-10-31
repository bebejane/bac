import '@/styles/index.scss';
import Link from 'next/link';
import s from './not-found.module.scss';

export default function NotFound() {
	return (
		<html>
			<body className={s.body}>
				<div className={s.container}>
					<h1>404 - Not Found</h1>
					<p>Could not find requested resource</p>
					<Link href='/'>Return Home</Link>
				</div>
			</body>
		</html>
	);
}
