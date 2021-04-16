import { AudioState } from 'atem-connection'

export const Channel: AudioState.ClassicAudioChannel = {
	sourceType: 0,
	portType: 1,
	mixOption: 0,
	gain: 0,
	balance: 0,
	supportsRcaToXlrEnabled: false,
	rcaToXlrEnabled: false,
}
export const Master: AudioState.ClassicAudioMasterChannel = {
	gain: 0,
	balance: 0,
	followFadeToBlack: false,
}
