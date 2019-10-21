import {
	Commands as AtemCommands, MediaState
} from 'atem-connection'
import { State as StateObject } from '../'
import { diffObject, getAllKeysNumber } from '../util'

export function resolveMediaPlayerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.media.players, newState.media.players)) {
		const newPlayer = newState.media.getMediaPlayer(index, true)
		const oldPlayer = oldState.media.getMediaPlayer(index, true)

		const props = diffObject<MediaState.MediaPlayer>(oldPlayer, newPlayer)
		if (props) {
			const command = new AtemCommands.MediaPlayerStatusCommand(index)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}
