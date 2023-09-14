import s from "./VideoPlayer.module.scss"
import cn from 'classnames'
import { useEffect, useRef, useState } from "react";
import { Image } from 'react-datocms'
import { Modal, ExternalVideoPlayer, InternalVideoPlayer } from '/components'

export default function VideoPlayer({ data, image }) {

	const ref = useRef<HTMLDivElement | null>(null)
	const [show, setShow] = useState(false);
	const isInternalVideo = data?.video !== undefined

	if (!data) return null

	return (
		<div className={s.video} ref={ref} >
			<Modal>
				<div className={cn(s.modal, show && s.show)}>
					<img src="/images/close.svg" className={s.close} onClick={() => setShow(false)} />

					{isInternalVideo ?
						<InternalVideoPlayer data={data} />
						:
						<ExternalVideoPlayer data={data} image={image} />
					}
				</div>
			</Modal>

			<figure>
				{!isInternalVideo && image ?
					<Image
						data={image.responsiveImage}
						className={s.image}
						pictureClassName={s.picture}
						placeholderClassName={s.placeholder}
					/>
					: isInternalVideo ?
						<img src={data.video.thumbnailUrl} className={s.image} />
						: null
				}
				<img src="/images/play.svg" className={s.play} onClick={() => setShow(true)} />
			</figure>
		</div>
	)
}