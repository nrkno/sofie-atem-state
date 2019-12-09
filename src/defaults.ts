import { VideoState, Enums } from 'atem-connection'
import * as USK from 'atem-connection/dist/state/video/upstreamKeyers'
import * as DSK from 'atem-connection/dist/state/video/downstreamKeyers'
import { AudioChannel, AudioMasterChannel } from 'atem-connection/dist/state/audio'

export namespace Defaults {
	export namespace Video {
		export const defaultInput = 0 // black
		export const defaultRate = 25 // 1 second

		// export const MacroPlayer: MacroPlayerState = {
		// 	macroIndex: 0,
		// 	isRunning: false,
		// 	isWaiting: false,
		// 	loop: false
		// }

		export const DownstreamerKeyerSources: Readonly<DSK.DownstreamKeyerSources> = {
			fillSource: defaultInput,
			cutSource: defaultInput
		}

		export const DownstreamerKeyerProperties: Readonly<DSK.DownstreamKeyerProperties> = {
			preMultiply: false,
			clip: 0,
			gain: 0,
			invert: false,
			tie: false,
			rate: 25,
			mask: {
				enabled: false,
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			}
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
			symmetry: 5000,
			borderSoftness: 0,
			xPosition: 5000,
			yPosition: 5000,
			reverseDirection: false,
			flipFlop: false
		}

		// export const TransitionProperties: Omit<VideoState.TransitionProperties, 'nextStyle' | 'nextSelection'> = {
		// 	style: Enums.TransitionStyle.MIX,
		// 	selection: 1
		// }

		export const UpstreamKeyerPatternSettings: USK.UpstreamKeyerPatternSettings = {
			style: Enums.Pattern.LeftToRightBar,
			size: 0,
			symmetry: 5000,
			softness: 0,
			positionX: 500,
			positionY: 500,
			invert: false
		}
		export const UpstreamKeyerLumaSettings: USK.UpstreamKeyerLumaSettings = {
			preMultiplied: false,
			clip: 0,
			gain: 0,
			invert: false
		}
		export const UpstreamKeyerChromaSettings: USK.UpstreamKeyerChromaSettings = {
			hue: 0,
			gain: 0,
			ySuppress: 0,
			lift: 0,
			narrow: false
		}
		export const UpstreamKeyerDVESettings: USK.UpstreamKeyerDVESettings = {
			borderEnabled: false,
			shadowEnabled: false,
			borderBevel: Enums.BorderBevel.None,
			rate: 1,

			sizeX: 0,
			sizeY: 0,
			positionX: 0,
			positionY: 0,
			rotation: 0,
			borderOuterWidth: 0,
			borderInnerWidth: 0,
			borderOuterSoftness: 0,
			borderInnerSoftness: 0,
			borderBevelSoftness: 0,
			borderBevelPosition: 0,
			borderOpacity: 0,
			borderHue: 0,
			borderSaturation: 0,
			borderLuma: 0,
			lightSourceDirection: 0,
			lightSourceAltitude: 0,

			maskEnabled: false,
			maskTop: 0,
			maskBottom: 0,
			maskLeft: 0,
			maskRight: 0
		}

		export function flyKeyframe (id: number): USK.UpstreamKeyerFlyKeyframe {
			return {
				keyFrameId: id,

				sizeX: 0,
				sizeY: 0,
				positionX: 0,
				positionY: 0,
				rotation: 0,
				borderOuterWidth: 0,
				borderInnerWidth: 0,
				borderOuterSoftness: 0,
				borderInnerSoftness: 0,
				borderBevelSoftness: 0,
				borderBevelPosition: 0,
				borderOpacity: 0,
				borderHue: 0,
				borderSaturation: 0,
				borderLuma: 0,
				lightSourceDirection: 0,
				lightSourceAltitude: 0,

				// maskEnabled: false,
				maskTop: 0,
				maskBottom: 0,
				maskLeft: 0,
				maskRight: 0
			}
		}

		export const SuperSourceBox: VideoState.SuperSourceBox = {
			enabled: false,
			source: defaultInput,
			x: 0,
			y: 0,
			size: 1000,
			cropped: false,
			cropTop: 0,
			cropBottom: 0,
			cropLeft: 0,
			cropRight: 0
		}

		export const SuperSourceProperties: VideoState.SuperSourceProperties = {
			artFillSource: defaultInput,
			artCutSource: defaultInput,
			artOption: Enums.SuperSourceArtOption.Background,
			artPreMultiplied: false,
			artClip: 0,
			artGain: 0,
			artInvertKey: false
		}

		export const SuperSourceBorder: VideoState.SuperSourceBorder = {
			borderEnabled: false,
			borderBevel: Enums.BorderBevel.None,
			borderOuterWidth: 0,
			borderInnerWidth: 0,
			borderOuterSoftness: 0,
			borderInnerSoftness: 0,
			borderBevelSoftness: 0,
			borderBevelPosition: 0,
			borderHue: 0,
			borderSaturation: 0,
			borderLuma: 0,
			borderLightSourceDirection: 0,
			borderLightSourceAltitude: 0
		}
	}

	export namespace Audio {
		export const Channel: AudioChannel = {
			sourceType: 0,
			portType: 1,
			mixOption: 0,
			gain: 0,
			balance: 0
		}
		export const Master: AudioMasterChannel = {
			gain: 0,
			balance: 0,
			followFadeToBlack: false
		}
	}
}
