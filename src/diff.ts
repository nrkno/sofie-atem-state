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
