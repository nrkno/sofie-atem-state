import {
	Commands as AtemCommands, VideoState, Enums
} from 'atem-connection'
import { State as StateObject } from '..'
import { diffObject, getAllKeysNumber } from '../util'

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

		const newSSrc = newState.video.getSuperSource(ssrc, true)
		const oldSSrc = oldState.video.getSuperSource(ssrc, true)
		for (const index in newSSrc.boxes) {
			const props = diffObject(oldSSrc.boxes[index], newSSrc.boxes[index])
			if (props) {
				const command = new AtemCommands.SuperSourceBoxParametersCommand(ssrc, Number(index))
				command.updateProps(props)
				commands.push(command)
			}
		}
	}

	return commands
}

export function resolveSuperSourcePropertiesState (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!newState.video.superSources[0] && !oldState.video.superSources[0]) return commands
	const newSSrc = newState.video.getSuperSource(0, true)
	const oldSSrc = oldState.video.getSuperSource(0, true)

	const newSsProperties: VideoState.SuperSourceProperties & VideoState.SuperSourceBorder = {
		...newSSrc.properties,
		...newSSrc.border
	}
	const oldSsProperties: VideoState.SuperSourceProperties & VideoState.SuperSourceBorder = {
		...oldSSrc.properties,
		...oldSSrc.border
	}

	const props = diffObject(oldSsProperties, newSsProperties)
	if (props) {
		const command = new AtemCommands.SuperSourcePropertiesCommand()
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}

export function resolveSuperSourcePropertiesV8State (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const ssrc of getAllKeysNumber(oldState.video.superSources, newState.video.superSources).sort()) {
		const newSSrc = newState.video.getSuperSource(ssrc, true)
		const oldSSrc = oldState.video.getSuperSource(ssrc, true)

		const props = diffObject(oldSSrc.properties, newSSrc.properties)
		if (props) {
			const command = new AtemCommands.SuperSourcePropertiesV8Command(ssrc)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}

export function resolveSuperSourceBorderV8State (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const ssrc of getAllKeysNumber(oldState.video.superSources, newState.video.superSources).sort()) {
		const newSSrc = newState.video.getSuperSource(ssrc, true)
		const oldSSrc = oldState.video.getSuperSource(ssrc, true)

		const props = diffObject(oldSSrc.border, newSSrc.border)
		if (props) {
			const command = new AtemCommands.SuperSourceBorderCommand(ssrc)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}
