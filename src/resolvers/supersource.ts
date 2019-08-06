import {
	Commands as AtemCommands, VideoState, Enums
} from 'atem-connection'
import { State as StateObject } from '..'

export function resolveSuperSourceState (oldState: StateObject, newState: StateObject, version: Enums.ProtocolVersion): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	if (!newState.video.superSources) return commands

	if (version < Enums.ProtocolVersion.V8_0) {
		commands = commands.concat(
			resolveSuperSourceBoxState(oldState, newState),
			resolveSuperSourcePropertiesState(oldState, newState))
	} else {
		commands = commands.concat(
			resolveSuperSourceBoxState(oldState, newState),
			resolveSuperSourcePropertiesV8State(oldState, newState),
			resolveSuperSourceBorderV8State(oldState, newState))
	}

	return commands
}

export function resolveSuperSourceBoxState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const index in newState.video.superSources[0].boxes) {
		const newBox = newState.video.superSources[0].boxes[index] || {}
		const oldBox = oldState.video.superSources[0].boxes[index] || {}
		const props: Partial<VideoState.SuperSourceBox> = {}

		for (let key in newBox) {
			const typedKey = key as keyof VideoState.SuperSourceBox
			if (newBox[typedKey] !== oldBox[typedKey]) {
				props[typedKey] = newBox[typedKey]
			}
		}

		if (Object.keys(props).length > 0) {
			const command = new AtemCommands.SuperSourceBoxParametersCommand()
			command.ssrcId = 0
			command.boxId = Number(index)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}

export function resolveSuperSourcePropertiesState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	if (newState.video.superSources[0]) {
		const newSsProperties: VideoState.SuperSourceProperties & VideoState.SuperSourceBorder = {
			...newState.video.superSources[0].properties,
			...newState.video.superSources[0].border
		}
		const oldSsProperties: VideoState.SuperSourceProperties & VideoState.SuperSourceBorder = {
			...oldState.video.superSources[0].properties,
			...oldState.video.superSources[0].border
		}
		const props: Partial<VideoState.SuperSourceProperties & VideoState.SuperSourceBorder> = {}

		for (let key in newSsProperties) {
			const typedKey = key as keyof (VideoState.SuperSourceProperties & VideoState.SuperSourceBorder)
			if (newSsProperties[typedKey] !== oldSsProperties[typedKey]) {
				props[typedKey] = newSsProperties[typedKey]
			}
		}

		if (Object.keys(props).length > 0) {
			const command = new AtemCommands.SuperSourcePropertiesCommand()
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}

export function resolveSuperSourcePropertiesV8State (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const ssrc in newState.video.superSources) {
		const newSsProperties = newState.video.superSources[ssrc].properties
		const oldSsProperties = oldState.video.superSources[ssrc].properties
		const props: Partial<VideoState.SuperSourceProperties> = {}

		for (let key in newSsProperties) {
			const typedKey = key as keyof VideoState.SuperSourceProperties
			if (newSsProperties[typedKey] !== oldSsProperties[typedKey]) {
				props[typedKey] = newSsProperties[typedKey]
			}
		}

		if (Object.keys(props).length > 0) {
			const command = new AtemCommands.SuperSourcePropertiesV8Command()
			command.ssrcId = Number(ssrc)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}

export function resolveSuperSourceBorderV8State (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const ssrc in newState.video.superSources) {
		const newSsProperties = newState.video.superSources[ssrc].border
		const oldSsProperties = oldState.video.superSources[ssrc].border
		const props: Partial<VideoState.SuperSourceBorder> = {}

		for (let key in newSsProperties) {
			const typedKey = key as keyof VideoState.SuperSourceBorder
			if (newSsProperties[typedKey] !== oldSsProperties[typedKey]) {
				props[typedKey] = newSsProperties[typedKey]
			}
		}

		if (Object.keys(props).length > 0) {
			const command = new AtemCommands.SuperSourceBorderCommand()
			command.ssrcId = Number(ssrc)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}
