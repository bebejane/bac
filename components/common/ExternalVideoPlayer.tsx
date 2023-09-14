import s from "./ExternalVideoPlayer.module.scss"
import cn from 'classnames'
import { useEffect, useRef, useState } from "react";
import Youtube from 'react-youtube'
import Vimeo from '@u-wave/react-vimeo'
import { useWindowSize } from "rooks";
import { Image } from 'react-datocms'
import { Modal } from '/components'

export default function ExternalVideoPlayer({ data, image }) {

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
		</div>
	)
}