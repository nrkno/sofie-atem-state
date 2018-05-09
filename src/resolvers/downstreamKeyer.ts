import {
	Commands as AtemCommands
} from 'atem-connection'
import AbstractCommand from 'atem-connection/dist/commands/AbstractCommand' // @todo: should come from main exports
import { State as StateObject } from '../'

export function resolveDownstreamKeyerState (oldState: StateObject, newState: StateObject): Array<AbstractCommand> {
	const commands: Array<AbstractCommand> = []

	for (const index in newState.video.downstreamKeyers) {
		const oldDsk = oldState.video.downstreamKeyers[index]
		const newDsk = newState.video.downstreamKeyers[index]

		if (!oldDsk.isAuto && newDsk.isAuto) {
			// @todo: transition rate
			const command = new AtemCommands.DownstreamKeyAutoCommand()
			command.downstreamKeyId = Number(index)
			commands.push(command)
		} else if (oldDsk.onAir !== newDsk.onAir) {
			const command = new AtemCommands.DownstreamKeyOnAirCommand()
			command.downstreamKeyId = Number(index)
			command.properties = { onAir: newDsk.onAir }
			commands.push(command)
		}
	}

	return commands
}
