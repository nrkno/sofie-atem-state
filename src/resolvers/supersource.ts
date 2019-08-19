import {
	Commands as AtemCommands, VideoState
} from 'atem-connection'
import { State as StateObject } from '..'

export function resolveSupersourceBoxState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const index in newState.video.superSourceBoxes) {
		const newBox = newState.video.superSourceBoxes[index] || {}
		const oldBox = oldState.video.superSourceBoxes[index] || {}
		const props: Partial<VideoState.SuperSourceBox> = {}

		for (let key in newBox) {
			const typedKey = key as keyof VideoState.SuperSourceBox
			if (newBox[typedKey] !== oldBox[typedKey]) {
				props[typedKey] = newBox[typedKey] as any
			}
		}

		if (Object.keys(props).length > 0) {
			const command = new AtemCommands.SuperSourceBoxParametersCommand()
			command.boxId = Number(index)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}

export function resolveSuperSourcePropertiesState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	if (newState.video.superSourceProperties) {
		const newSsProperties = newState.video.superSourceProperties
		const oldSsProperties = oldState.video.superSourceProperties
		const props: Partial<VideoState.SuperSourceProperties> = {}

		for (let key in newSsProperties) {
			const typedKey = key as keyof VideoState.SuperSourceProperties
			if (newSsProperties[typedKey] !== oldSsProperties[typedKey]) {
				props[typedKey] = newSsProperties[typedKey] as any
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
