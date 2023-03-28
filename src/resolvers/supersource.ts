import { Commands as AtemCommands, VideoState, Enums } from 'atem-connection'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util'
import * as Defaults from '../defaults'
import { PartialDeep } from 'type-fest'
import { DiffSuperSource, DiffSuperSourceBoxes } from '../diff'

type SuperSourceCombinedProperties = VideoState.SuperSource.SuperSourceProperties &
	VideoState.SuperSource.SuperSourceBorder

export function resolveSuperSourceState(
	oldSuperSources: Array<PartialDeep<VideoState.SuperSource.SuperSource> | undefined> | undefined,
	newSuperSources: Array<PartialDeep<VideoState.SuperSource.SuperSource> | undefined> | undefined,
	version: Enums.ProtocolVersion,
	diffOptions: DiffSuperSource | DiffSuperSource[]
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const keys = getAllKeysNumber(oldSuperSources, newSuperSources).sort()

	if (version < Enums.ProtocolVersion.V8_0) {
		for (const index of keys) {
			if (index !== 0) {
				// 8.0 added support for multiple ssrc. So only run for the first
				continue
			}

			const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[index] : diffOptions

			const newSSrc = newSuperSources?.[index]
			const oldSSrc = oldSuperSources?.[index]

			if (thisDiffOptions.boxes) {
				commands.push(...resolveSuperSourceBoxesState(index, oldSSrc?.boxes, newSSrc?.boxes, thisDiffOptions.boxes))
			}

			commands.push(...resolveSuperSourcePropertiesState(oldSSrc, newSSrc, thisDiffOptions))
		}
	} else {
		for (const index of keys) {
			const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[index] : diffOptions

			const newSSrc = newSuperSources?.[index]
			const oldSSrc = oldSuperSources?.[index]

			if (thisDiffOptions.boxes) {
				commands.push(...resolveSuperSourceBoxesState(index, oldSSrc?.boxes, newSSrc?.boxes, thisDiffOptions.boxes))
			}
			if (thisDiffOptions.properties) {
				commands.push(...resolveSuperSourcePropertiesV8State(index, oldSSrc?.properties, newSSrc?.properties))
			}
			if (thisDiffOptions.border) {
				commands.push(...resolveSuperSourceBorderV8State(index, oldSSrc?.border, newSSrc?.border))
			}
		}
	}

	return commands
}

export function resolveSuperSourceBoxesState(
	ssrcId: number,
	oldBoxes: Array<PartialDeep<VideoState.SuperSource.SuperSourceBox> | undefined> | undefined,
	newBoxes: Array<PartialDeep<VideoState.SuperSource.SuperSourceBox> | undefined> | undefined,
	diffOptions: DiffSuperSourceBoxes
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldBoxes, newBoxes)) {
		if (diffOptions === 'all' || diffOptions.includes(index)) {
			const oldBox = fillDefaults(Defaults.Video.SuperSourceBox, oldBoxes?.[index])
			const newBox = fillDefaults(Defaults.Video.SuperSourceBox, newBoxes?.[index])

			const props = diffObject(oldBox, newBox)
			const command = new AtemCommands.SuperSourceBoxParametersCommand(ssrcId, Number(index))
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}
	}

	return commands
}

export function resolveSuperSourcePropertiesState(
	oldState: PartialDeep<VideoState.SuperSource.SuperSource> | undefined,
	newState: PartialDeep<VideoState.SuperSource.SuperSource> | undefined,
	diffOptions: DiffSuperSource
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!newState && !oldState) return commands
	if (!diffOptions.border && !diffOptions.properties) return commands

	const ssrcDefaults = { properties: Defaults.Video.SuperSourceProperties, border: Defaults.Video.SuperSourceBorder }
	const newSSrc = fillDefaults(ssrcDefaults, newState)
	const oldSSrc = fillDefaults(ssrcDefaults, oldState)

	const newProperties: Partial<SuperSourceCombinedProperties> = {}
	const oldProperties: Partial<SuperSourceCombinedProperties> = {}

	if (diffOptions.properties) {
		Object.assign(newProperties, newSSrc.properties)
		Object.assign(oldProperties, oldSSrc.properties)
	}
	if (diffOptions.border) {
		Object.assign(newProperties, newSSrc.border)
		Object.assign(oldProperties, oldSSrc.border)
	}

	const props = diffObject(oldProperties, newProperties)
	const command = new AtemCommands.SuperSourcePropertiesCommand()
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}

export function resolveSuperSourcePropertiesV8State(
	ssrcId: number,
	oldProperties: PartialDeep<VideoState.SuperSource.SuperSourceProperties> | undefined,
	newProperties: PartialDeep<VideoState.SuperSource.SuperSourceProperties> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const newSSrcProps = fillDefaults(Defaults.Video.SuperSourceProperties, newProperties)
	const oldSSrcProps = fillDefaults(Defaults.Video.SuperSourceProperties, oldProperties)

	const props = diffObject(oldSSrcProps, newSSrcProps)
	const command = new AtemCommands.SuperSourcePropertiesV8Command(ssrcId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}

export function resolveSuperSourceBorderV8State(
	ssrcId: number,
	oldBorder: PartialDeep<VideoState.SuperSource.SuperSourceBorder> | undefined,
	newBorder: PartialDeep<VideoState.SuperSource.SuperSourceBorder> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const newSSrcBorder = fillDefaults(Defaults.Video.SuperSourceBorder, newBorder)
	const oldSSrcBorder = fillDefaults(Defaults.Video.SuperSourceBorder, oldBorder)

	const props = diffObject(oldSSrcBorder, newSSrcBorder)
	const command = new AtemCommands.SuperSourceBorderCommand(ssrcId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
