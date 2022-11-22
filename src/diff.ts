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
	}
}

export type DiffAuxiliaries = number[] | 'all'
export type DiffColorGenerators = number[] | 'all'

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
