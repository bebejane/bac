import s from './StartVideo.module.scss';
import React from 'react';
import { DatoLink, Content } from '@/components';
import { useTranslations } from 'next-intl';
import { sectionToSlug } from '@/lib/utils';
import Link from 'next/link';

export type Props = { data: StartVideoRecord };

export default function StartVideo({ data: { id, title, section, text, link }, data }: Props) {
	const t = useTranslations('Home');

	return (
		<section className={s.video}>
			<div className={s.left}>
				<DatoLink link={link} className={s.videoWrap}>
					<video
						src={data.video?.video['mp4high']}
						playsInline
						loop={true}
						autoPlay={true}
						muted={true}
						disablePictureInPicture={true}
					/>
				</DatoLink>
			</div>
			<div className={s.right}>
				<Link href={sectionToSlug(section)}>
					<h2 className={s.section}>
						{
							//@ts-ignore
							t(section.toLowerCase())
						}
					</h2>
				</Link>

				<div className={s.content}>
					<DatoLink link={link} className={s.title}>
						<h1>{title}</h1>
						<div className={s.text}>
							<Content id={id} content={text} />
						</div>
						<div className={s.readmore}>
							<strong className='nav'>
								<span>›</span> {t('readMore')}
							</strong>
						</div>
					</DatoLink>
				</div>
			</div>
		</section>
	);
}
