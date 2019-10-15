import {
	Commands as AtemCommands, MediaState
} from 'atem-connection'
import { State as StateObject } from '../'
import { diffObject } from '../util'

export function resolveMediaPlayerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const index in newState.media.players) {
		const newPlayer = newState.media.players[index]
		const oldPlayer = oldState.media.players[index]

		const props = diffObject<MediaState.MediaPlayer>(oldPlayer, newPlayer)
		if (props) {
			const command = new AtemCommands.MediaPlayerStatusCommand()
			command.mediaPlayerId = Number(index)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}
