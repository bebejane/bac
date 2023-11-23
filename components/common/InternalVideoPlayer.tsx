import { useState } from 'react'
import s from './InternalVideoPlayer.module.scss'
import cn from 'classnames'

export type VideoPlayerProps = { data: FileField, className?: string }

export default function InternalVideoPlayer({ data, className }: VideoPlayerProps) {

	return (
		<video
			className={cn(s.video, className)}
			src={data.video[`mp4high`]}
			muted={true}
			autoPlay={true}
			controls
			poster={data.video?.thumbnailUrl}
		/>
	)
}