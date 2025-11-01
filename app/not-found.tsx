import '@/styles/index.scss';
import s from './not-found.module.scss';

export default function NotFound() {
	return (
		<html>
			<head>
				<title>404 - Not Found</title>
			</head>
			<body className={s.body}>
				<div className={s.container}>
					<h1>404 - Not Found</h1>
					<p>Could not find requested resource</p>
					<a href='/'>Return Home</a>
				</div>
			</body>
		</html>
	);
}
