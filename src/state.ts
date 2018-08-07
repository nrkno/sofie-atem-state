import { AtemState, VideoState } from 'atem-connection'
import { Enums } from './enums'

export class AtemVideoState extends VideoState.AtemVideoState {
	ME: { [index: string]: MixEffect } = {}
}

export interface MixEffect extends VideoState.MixEffect {
	input?: number
	transition?: Enums.TransitionStyle
}

export class State extends AtemState {
	video = new AtemVideoState()
}
