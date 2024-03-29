import s from './InternalVideoPlayer.module.scss'
import cn from 'classnames'

export type VideoPlayerProps = { data: FileField, className?: string }

export default function InternalVideoPlayer({ data, className }: VideoPlayerProps) {

	return (
		<video
			className={cn(s.video, className)}
			src={data.video[`mp4high`]}
			muted={false}
			autoPlay={false}
			controls
			poster={data.video?.thumbnailUrl}
		/>
	)
}