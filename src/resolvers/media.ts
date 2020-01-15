import {
	Commands as AtemCommands, AtemStateUtil
} from 'atem-connection'
import { State as StateObject } from '../'
import { diffObject, getAllKeysNumber } from '../util'

export function resolveMediaPlayerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.media.players, newState.media.players)) {
		const newPlayer = AtemStateUtil.getMediaPlayer(newState, index, true)
		const oldPlayer = AtemStateUtil.getMediaPlayer(oldState, index, true)

		const props = diffObject(oldPlayer, newPlayer)
		const command = new AtemCommands.MediaPlayerStatusCommand(index)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
