import { SettingsState, Commands as AtemCommands } from 'atem-connection'
import { DiffMultiViewer, DiffMultiViewerWindows } from '../../diff'
import { PartialDeep } from 'type-fest'
import * as Defaults from '../../defaults'
import { diffObject, fillDefaults, getAllKeysNumber } from '../../util'

export function resolveMultiviewerState(
	oldState: PartialDeep<SettingsState.MultiViewer>[],
	newState: PartialDeep<SettingsState.MultiViewer[]>,
	diffOptions: DiffMultiViewer | DiffMultiViewer[]
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState, newState)) {
		const newMv = newState?.[index]
		const oldMv = oldState?.[index]

		const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[index] : diffOptions
		if (thisDiffOptions) {
			if (thisDiffOptions.windows && thisDiffOptions.windows.length) {
				commands.push(...resolveMultiviewerWindowsState(index, oldMv?.windows, newMv?.windows, thisDiffOptions.windows))
			}

			const newProps = fillDefaults(Defaults.Multiviewer.Properties, newMv?.properties)
			const oldProps = fillDefaults(Defaults.Multiviewer.Properties, oldMv?.properties)

			if (thisDiffOptions.properties) {
				const props = diffObject<SettingsState.MultiViewerPropertiesState>(oldProps, newProps)
				const command = new AtemCommands.MultiViewerPropertiesCommand(index)
				if (command.updateProps(props)) {
					commands.push(command)
				}

				const oldVuOpacity = oldMv?.vuOpacity ?? Defaults.Multiviewer.VuOpacity
				const newVuOpacity = newMv?.vuOpacity ?? Defaults.Multiviewer.VuOpacity
				if (oldVuOpacity !== newVuOpacity) {
					commands.push(new AtemCommands.MultiViewerVuOpacityCommand(index, newVuOpacity))
				}
			}
		}
	}

	return commands
}

export function resolveMultiviewerWindowsState(
	index: number,
	oldState: PartialDeep<SettingsState.MultiViewerWindowState>[] | undefined,
	newState: PartialDeep<SettingsState.MultiViewerWindowState>[] | undefined,
	diffOptions: DiffMultiViewerWindows
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const window of getAllKeysNumber(oldState, newState)) {
		const oldWindow = oldState?.[window]
		const newWindow = newState?.[window]

		if (diffOptions === 'all' || diffOptions.includes(window)) {
			const oldSource = oldWindow?.source ?? Defaults.Video.defaultInput
			const newSource = newWindow?.source ?? Defaults.Video.defaultInput
			if (oldSource !== newSource) {
				commands.push(new AtemCommands.MultiViewerSourceCommand(index, window, newSource))
			}

			const oldSafeArea = oldWindow?.safeTitle ?? false
			const newSafeArea = newWindow?.safeTitle ?? false
			if (oldSafeArea !== newSafeArea) {
				commands.push(new AtemCommands.MultiViewerWindowSafeAreaCommand(index, window, newSafeArea))
			}

			const oldAudioMeter = oldWindow?.audioMeter ?? false
			const newAudioMeter = newWindow?.audioMeter ?? false
			if (oldAudioMeter !== newAudioMeter) {
				commands.push(new AtemCommands.MultiViewerWindowVuMeterCommand(index, window, newAudioMeter))
			}
		}
	}

	return commands
}
