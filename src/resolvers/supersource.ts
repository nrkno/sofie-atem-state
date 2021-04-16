import { Commands as AtemCommands, VideoState, Enums } from 'atem-connection'
import { State as StateObject } from '..'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util'
import * as Defaults from '../defaults'
import { PartialDeep } from 'type-fest'

type SuperSourceCombinedProperties = VideoState.SuperSource.SuperSourceProperties &
	VideoState.SuperSource.SuperSourceBorder

export function resolveSuperSourceState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>,
	version: Enums.ProtocolVersion
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (version < Enums.ProtocolVersion.V8_0) {
		commands.push(...resolveSuperSourceBoxState(oldState, newState, version))
		commands.push(...resolveSuperSourcePropertiesState(oldState, newState))
	} else {
		commands.push(...resolveSuperSourceBoxState(oldState, newState, version))
		commands.push(...resolveSuperSourcePropertiesV8State(oldState, newState))
		commands.push(...resolveSuperSourceBorderV8State(oldState, newState))
	}

	return commands
}

export function resolveSuperSourceBoxState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>,
	version: Enums.ProtocolVersion
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const ssrc of getAllKeysNumber(oldState.video?.superSources, newState.video?.superSources).sort()) {
		if (version < Enums.ProtocolVersion.V8_0 && ssrc !== 0) {
			// 8.0 added support for multiple ssrc. So only run for the first
			continue
		}

		const newSSrc = newState.video?.superSources?.[ssrc]
		const oldSSrc = oldState.video?.superSources?.[ssrc]
		for (const index of getAllKeysNumber(oldSSrc?.boxes, newSSrc?.boxes)) {
			const oldBox = fillDefaults(Defaults.Video.SuperSourceBox, oldSSrc?.boxes?.[index])
			const newBox = fillDefaults(Defaults.Video.SuperSourceBox, newSSrc?.boxes?.[index])

			const props = diffObject(oldBox, newBox)
			const command = new AtemCommands.SuperSourceBoxParametersCommand(ssrc, Number(index))
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}
	}

	return commands
}

export function resolveSuperSourcePropertiesState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!newState.video?.superSources?.[0] && !oldState.video?.superSources?.[0]) return commands
	const ssrcDefaults = { properties: Defaults.Video.SuperSourceProperties, border: Defaults.Video.SuperSourceBorder }
	const newSSrc = fillDefaults(ssrcDefaults, newState.video?.superSources?.[0])
	const oldSSrc = fillDefaults(ssrcDefaults, oldState.video?.superSources?.[0])

	const newSsProperties: Partial<SuperSourceCombinedProperties> = {
		...newSSrc.properties,
		...newSSrc.border,
	}
	const oldSsProperties: Partial<SuperSourceCombinedProperties> = {
		...oldSSrc.properties,
		...oldSSrc.border,
	}

	const props = diffObject(oldSsProperties, newSsProperties)
	const command = new AtemCommands.SuperSourcePropertiesCommand()
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}

export function resolveSuperSourcePropertiesV8State(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const ssrc of getAllKeysNumber(oldState.video?.superSources, newState.video?.superSources).sort()) {
		const newSSrcProps = fillDefaults(
			Defaults.Video.SuperSourceProperties,
			newState.video?.superSources?.[ssrc]?.properties
		)
		const oldSSrcProps = fillDefaults(
			Defaults.Video.SuperSourceProperties,
			oldState.video?.superSources?.[ssrc]?.properties
		)

		const props = diffObject(oldSSrcProps, newSSrcProps)
		const command = new AtemCommands.SuperSourcePropertiesV8Command(ssrc)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}

export function resolveSuperSourceBorderV8State(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const ssrc of getAllKeysNumber(oldState.video?.superSources, newState.video?.superSources).sort()) {
		const newSSrcBorder = fillDefaults(Defaults.Video.SuperSourceBorder, newState.video?.superSources?.[ssrc]?.border)
		const oldSSrcBorder = fillDefaults(Defaults.Video.SuperSourceBorder, oldState.video?.superSources?.[ssrc]?.border)

		const props = diffObject(oldSSrcBorder, newSSrcBorder)
		const command = new AtemCommands.SuperSourceBorderCommand(ssrc)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
