import {
	Commands as AtemCommands, VideoState, Enums, AtemStateUtil, AtemState
} from 'atem-connection'
import { State as StateObject } from '..'
import { diffObject, getAllKeysNumber } from '../util'
import { Defaults } from '../defaults'

type SuperSourceCombinedProperties = VideoState.SuperSource.SuperSourceProperties & VideoState.SuperSource.SuperSourceBorder

export function resolveSuperSourceState (oldState: StateObject, newState: StateObject, version: Enums.ProtocolVersion): Array<AtemCommands.ISerializableCommand> {
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

export function resolveSuperSourceBoxState (oldState: StateObject, newState: StateObject, version: Enums.ProtocolVersion): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const ssrc of getAllKeysNumber(oldState.video.superSources, newState.video.superSources).sort()) {
		if (version < Enums.ProtocolVersion.V8_0 && ssrc !== 0) {
			// 8.0 added support for multiple ssrc. So only run for the first
			continue
		}

		const newSSrc = AtemStateUtil.getSuperSource(newState as AtemState, ssrc, true)
		const oldSSrc = AtemStateUtil.getSuperSource(oldState as AtemState, ssrc, true)
		for (const index in newSSrc.boxes) {
			const props = diffObject(oldSSrc.boxes[index] || Defaults.Video.SuperSourceBox, newSSrc.boxes[index] || Defaults.Video.SuperSourceBox)
			const command = new AtemCommands.SuperSourceBoxParametersCommand(ssrc, Number(index))
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}
	}

	return commands
}

export function resolveSuperSourcePropertiesState (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!newState.video.superSources[0] && !oldState.video.superSources[0]) return commands
	const newSSrc = AtemStateUtil.getSuperSource(newState as AtemState, 0, true)
	const oldSSrc = AtemStateUtil.getSuperSource(oldState as AtemState, 0, true)

	const newSsProperties: Partial<SuperSourceCombinedProperties> = {
		...newSSrc.properties,
		...newSSrc.border
	}
	const oldSsProperties: Partial<SuperSourceCombinedProperties> = {
		...oldSSrc.properties,
		...oldSSrc.border
	}

	const props = diffObject(oldSsProperties, newSsProperties)
	const command = new AtemCommands.SuperSourcePropertiesCommand()
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}

export function resolveSuperSourcePropertiesV8State (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const ssrc of getAllKeysNumber(oldState.video.superSources, newState.video.superSources).sort()) {
		const newSSrc = AtemStateUtil.getSuperSource(newState as AtemState, ssrc, true)
		const oldSSrc = AtemStateUtil.getSuperSource(oldState as AtemState, ssrc, true)

		const props = diffObject(oldSSrc.properties || Defaults.Video.SuperSourceProperties, newSSrc.properties || Defaults.Video.SuperSourceProperties)
		const command = new AtemCommands.SuperSourcePropertiesV8Command(ssrc)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}

export function resolveSuperSourceBorderV8State (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const ssrc of getAllKeysNumber(oldState.video.superSources, newState.video.superSources).sort()) {
		const newSSrc = AtemStateUtil.getSuperSource(newState as AtemState, ssrc, true)
		const oldSSrc = AtemStateUtil.getSuperSource(oldState as AtemState, ssrc, true)

		const props = diffObject(oldSSrc.border || Defaults.Video.SuperSourceBorder, newSSrc.border || Defaults.Video.SuperSourceBorder)
		const command = new AtemCommands.SuperSourceBorderCommand(ssrc)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
