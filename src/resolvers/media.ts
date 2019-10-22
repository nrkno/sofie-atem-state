import {
	Commands as AtemCommands
} from 'atem-connection'
import { State as StateObject } from '../'
import { diffObject, getAllKeysNumber } from '../util'

export function resolveMediaPlayerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.media.players, newState.media.players)) {
		const newPlayer = newState.media.getMediaPlayer(index, true)
		const oldPlayer = oldState.media.getMediaPlayer(index, true)

		const props = diffObject(oldPlayer, newPlayer)
		const command = new AtemCommands.MediaPlayerStatusCommand(index)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
