export function DiffAllObject(): Required<SectionsToDiff> {
	// TODO - use a DeepRequired to ensure we don't miss anything
	return {
		auxiliaries: 'all',
		multiviewer: {
			properties: true,
			windows: 'all',
		},
	}
}

export interface SectionsToDiff {
	auxiliaries?: DiffAuxiliaries
	multiviewer?: DiffMultiViewer | DiffMultiViewer[]
	//
}

export type DiffAuxiliaries = number[] | 'all'

export type DiffMultiViewerWindows = number[] | 'all'
export interface DiffMultiViewer {
	properties?: boolean
	windows?: DiffMultiViewerWindows
}
