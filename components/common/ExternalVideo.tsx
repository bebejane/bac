import s from "./ExternalVideo.module.scss"
import cn from 'classnames'
import { useEffect, useRef, useState } from "react";
import Youtube from 'react-youtube'
import Vimeo from '@u-wave/react-vimeo'
import { useWindowSize } from "rooks";
import { Image } from 'react-datocms'
import { Modal } from '/components'

export default function ExternalVideo({ data, image }) {

	const ref = useRef<HTMLDivElement | null>(null)
	const [height, setHeight] = useState(360);
	const [show, setShow] = useState(false);
	const { innerWidth, innerHeight } = useWindowSize()

	useEffect(() => {
		setTimeout(() => setHeight((ref.current?.clientWidth / 16) * 9), 100)
	}, [innerWidth, innerHeight, data, ref]) // Set to 16:9

	if (!data) return null

	const { provider, providerUid, title } = data
	const style = { height: `${height}px`, width: '100%' }

	return (
		<div className={s.video} ref={ref} >
			<Modal>
				<div className={cn(s.modal, show && s.show)}>
					{provider === 'youtube' ?
						<Youtube
							opts={{
								playerVars: {
									autoplay: false,
									controls: 0,
									rel: 0
								}
							}}
							videoId={providerUid}
							className={s.player}
							style={style}
						/>
						: provider === 'vimeo' ?
							<Vimeo video={providerUid} className={s.player} style={style} />
							:
							<div>{provider} not supported!</div>
					}
					<img src="/images/close.svg" className={s.close} onClick={() => setShow(false)} />
				</div>

			</Modal>

			{image &&
				<figure>
					<Image data={image.responsiveImage} className={s.image} pictureClassName={s.picture} />
					<img src="/images/play.svg" className={s.play} onClick={() => setShow(true)} />
				</figure>
			}
		</div>
	)
}