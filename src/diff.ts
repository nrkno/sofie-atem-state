export function DiffAllObject(): Required<SectionsToDiff> {
	// TODO - use a DeepRequired to ensure we don't miss anything
	return {
		colorGenerators: 'all',
		macros: {
			player: {
				player: true,
			},
		},
		media: {
			players: {
				source: true,
				status: true,
			},
		},
		settings: {
			multiviewer: {
				properties: true,
				windows: 'all',
			},
		},
		video: {
			auxiliaries: 'all',
			downstreamKeyers: {
				sources: true,
				onAir: true,
				properties: true,
				mask: true,
			},
			superSources: {
				boxes: 'all',
				border: true,
				properties: true,
			},
		},
		audio: {
			classic: {
				channels: 'all',

				masterOutput: true,
				monitorOutput: true,
				headphonesOutput: true,

				crossfade: true,
			},
			fairlight: {
				inputs: {
					default: {
						properties: true,
						sources: {
							default: {
								properties: true,
								equalizer: true,
								dynamics: true,
							},
						},
					},
				},

				masterOutput: {
					properties: true,
					equalizer: true,
					dynamics: true,
				},
				monitorOutput: true,

				crossfade: true,
			},
		},
	}
}

export interface SectionsToDiff {
	colorGenerators?: DiffColorGenerators
	settings?: {
		multiviewer?: DiffMultiViewer | DiffMultiViewer[]
	}
	macros?: {
		player?: DiffMacroPlayer
	}
	media?: {
		players?: DiffMediaPlayer | DiffMediaPlayer[]
	}
	video?: {
		auxiliaries?: DiffAuxiliaries
		downstreamKeyers?: DiffDownstreamKeyer | DiffDownstreamKeyer[]
		superSources?: DiffSuperSource | DiffSuperSource[]
	}
	audio?: {
		classic?: DiffClassicAudio
		fairlight?: DiffFairlightAudio
	}
}

export type DiffAuxiliaries = number[] | 'all'
export type DiffColorGenerators = number[] | 'all'

export interface DiffSuperSource {
	boxes?: DiffSuperSourceBoxes

	border?: boolean
	properties?: boolean
}
export type DiffSuperSourceBoxes = number[] | 'all'

export interface DiffDownstreamKeyer {
	sources?: boolean
	onAir?: boolean
	properties?: boolean
	mask?: boolean
}

export interface DiffMediaPlayer {
	source?: boolean
	status?: boolean
}

export interface DiffMacroPlayer {
	player?: boolean
}

export type DiffMultiViewerWindows = number[] | 'all'
export interface DiffMultiViewer {
	properties?: boolean
	windows?: DiffMultiViewerWindows
}

export interface DiffClassicAudio {
	channels?: number[] | 'all'

	masterOutput?: boolean
	monitorOutput?: boolean
	headphonesOutput?: boolean

	crossfade?: boolean
}

export interface DiffFairlightAudio {
	inputs?: Record<number | 'default', DiffFairlightAudioInput | undefined>

	masterOutput?: DiffFairlightAudioMaster
	monitorOutput?: boolean

	crossfade?: boolean
}

export interface DiffFairlightAudioInput {
	properties?: boolean

	sources?: Record<number | 'default', DiffFairlightAudioInputSource | undefined>
}

export interface DiffFairlightAudioInputSource {
	properties?: boolean
	equalizer?: boolean
	dynamics?: boolean
}

export interface DiffFairlightAudioMaster {
	properties?: boolean
	equalizer?: boolean
	dynamics?: boolean
}
