import { AtemState, VideoState } from 'atem-connection'
import { Enums } from './enums'

export interface AtemVideoState extends VideoState.AtemVideoState {
	mixEffects: Array<MixEffect | undefined>
}

export interface MixEffect extends VideoState.MixEffect {
	input?: number
	transition?: Enums.TransitionStyle
}

export interface State extends AtemState {
	video: AtemVideoState
}
