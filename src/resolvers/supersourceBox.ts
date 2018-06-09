import {
	Commands as AtemCommands, VideoState
} from 'atem-connection'
import { State as StateObject } from '../'

export function resolveSupersourceBoxState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const index in newState.video.superSourceBoxes) {
		const newBox = newState.video.superSourceBoxes[index] || {}
		const oldBox = oldState.video.superSourceBoxes[index] || {}
		const props: Partial<VideoState.SuperSourceBox> = {}

		for (let key in newBox) {
			if ((newBox as any)[key] !== (oldBox as any)[key]) {
				(props as any)[key] = (newBox as any)[key]
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
