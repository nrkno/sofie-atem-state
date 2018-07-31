import { VideoState, Enums } from 'atem-connection'
import * as USK from 'atem-connection/dist/state/video/upstreamKeyers'
import * as DSK from 'atem-connection/dist/state/video/downstreamKeyers'

export namespace Defaults {
	export namespace Video {
		export const defaultInput = 0 // black
		export const defaultRate = 25 // 1 second

		export const DownStreamKeyer: DSK.DownstreamKeyer = {
			onAir: false,
			inTransition: false,
			isAuto: false,
			remainingFrames: defaultRate,
			sources: {
				fillSource: defaultInput,
				cutSource: defaultInput
			},
			properties: {
				tie: false,
				rate: defaultRate,
				preMultiply: false,
				clip: 0,
				gain: 0,
				invert: false,
				mask: {
					enabled: false,
					top: 0,
					bottom: 0,
					left: 0,
					right: 0
				}
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
			transitionSettings: TransitionSettings,
			upstreamKeyers: []
		}

		export function UpstreamKeyer (id: number): USK.UpstreamKeyer {
			return {
				upstreamKeyerId: id,
				mixEffectKeyType: Enums.MixEffectKeyType.Luma,
				flyEnabled: false,
				fillSource: 0,
				cutSource: 0,
				maskEnabled: false,
				maskTop: 0,
				maskBottom: 0,
				maskLeft: 0,
				maskRight: 0,
				onAir: false,

				dveSettings: {
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
				},

				chromaSettings: {
					hue: 0,
					gain: 0,
					ySuppress: 0,
					lift: 0,
					narrow: false
				},

				lumaSettings: {
					preMultiplied: false,
					clip: 0,
					gain: 0,
					invert: false
				},

				patternSettings: {
					style: Enums.Pattern.LeftToRightBar,
					size: 0,
					symmetry: 5000,
					softness: 0,
					positionX: 500,
					positionY: 500,
					invert: false
				},

				flyKeyframes: [
					flyKeyframe(0),
					flyKeyframe(1)
				],

				flyProperties: {
					isASet: false,
					isBSet: false,
					isAtKeyFrame: Enums.IsAtKeyFrame.None,
					runToInfiniteIndex: 0
				}
			}
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

				maskEnabled: false,
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
	}
}
