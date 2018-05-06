import { VideoState, Enums } from 'atem-connection'

export namespace Defaults {
	export namespace Video {
		export const defaultInput = 0 // black
		export const defaultRate = 25 // 1 second

		export const DownStreamKeyer: VideoState.DownstreamKeyer = {
			onAir: false,
			inTransition: false,
			isAuto: false,
			remainingFrames: defaultRate
		}

		export const DipTransitionSettings: VideoState.DipTransitionSettings = {
			rate: defaultRate,
			input: defaultInput
		}

		export const DVETransitionSettings: VideoState.DVETransitionSettings = {
			rate: defaultRate,
			logoRate: defaultRate,
			style: Enums.DVEEffect.PushLeft,
			fillSource: defaultInput,
			keySource: defaultInput,

			enableKey: false,
			preMultiplied: false,
			clip: 0,
			gain: 0,
			invertKey: false,
			reverse: false,
			flipFlop: false
		}

		export const MixTransitionSettings: VideoState.MixTransitionSettings = {
			rate: defaultRate
		}

		export const StingerTransitionSettings: VideoState.StingerTransitionSettings = {
			source: defaultInput,
			preMultipliedKey: false,

			clip: 0,
			gain: 0, // 0...1000
			invert: false,

			preroll: 0,
			clipDuration: defaultRate,
			triggerPoint: Math.ceil(defaultRate / 2),
			mixRate: 1
		}

		export const WipeTransitionSettings: VideoState.WipeTransitionSettings = {
			rate: defaultRate,
			pattern: 1,
			borderWidth: 0,
			borderInput: defaultInput,
			symmetry: 0,
			borderSoftness: 0,
			xPosition: 0,
			yPosition: 0,
			reverseDirection: false,
			flipFlop: false
		}

		export const TransitionProperties: Partial<VideoState.TransitionProperties> = {
			style: Enums.TransitionStyle.MIX,
			selection: 1
		}

		export const TransitionSettings: VideoState.TransitionSettings = {
			dip: DipTransitionSettings,
			DVE: DVETransitionSettings,
			mix: MixTransitionSettings,
			stinger: StingerTransitionSettings,
			wipe: WipeTransitionSettings
		}

		export const MixEffect: Partial<VideoState.MixEffect> = {
			programInput: defaultInput,
			previewInput: defaultInput,
			inTransition: false,
			transitionPreview: false,
			transitionPosition: 0,
			fadeToBlack: false,
			transitionProperties: TransitionProperties as VideoState.TransitionProperties,
			transitionSettings: TransitionSettings
		}

		export const SuperSourceBox: VideoState.SuperSourceBox = {
			enabled: false,
			source: defaultInput,
			x: 0,
			y: 0,
			size: 1,
			cropped: false,
			cropTop: 0,
			cropBottom: 0,
			cropLeft: 0,
			cropRight: 0
		}
	}
}
