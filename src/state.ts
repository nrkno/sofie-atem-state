import { AtemState, VideoState } from 'atem-connection'
import * as Enums from './enums'

export interface AtemVideoState extends Omit<VideoState.AtemVideoState, 'mixEffects'> {
	mixEffects: Array<MixEffect | undefined>
}

export type MixEffect = VideoState.MixEffect | ExtendedMixEffect

export interface ExtendedMixEffect extends Omit<VideoState.MixEffect, 'programInput' | 'previewInput'> {
	input: number
	transition: Enums.TransitionStyle
}

export interface State extends Omit<AtemState, 'video'> {
	video: AtemVideoState
}
