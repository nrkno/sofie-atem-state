import {
	Commands as AtemCommands, MediaState
} from 'atem-connection'
import { State as StateObject } from '../'

export function resolveMediaPlayerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const index in newState.media.players) {
		const newPlayer = newState.media.players[index]
		const oldPlayer = oldState.media.players[index]

		const props: Partial<MediaState.MediaPlayer> = {}

		for (let key in newPlayer) {
			if ((newPlayer)[key as keyof MediaState.MediaPlayer] !== (oldPlayer)[key as keyof MediaState.MediaPlayer]) {
				(props)[key as keyof MediaState.MediaPlayer] = (newPlayer)[key as keyof MediaState.MediaPlayer]
			}
		}

		if (Object.keys(props).length > 0) {
			const command = new AtemCommands.MediaPlayerStatusCommand()
			command.mediaPlayerId = Number(index)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}
