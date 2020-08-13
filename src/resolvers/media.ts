import {
	Commands as AtemCommands, AtemStateUtil, MediaState, AtemState
} from 'atem-connection'
import { State as StateObject } from '../'
import { diffObject, getAllKeysNumber } from '../util'

export function resolveMediaPlayerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.media.players, newState.media.players)) {
		const newPlayer = AtemStateUtil.getMediaPlayer(newState as AtemState, index, true)
		const oldPlayer = AtemStateUtil.getMediaPlayer(oldState as AtemState, index, true)

		const props = diffObject<MediaState.MediaPlayer>(oldPlayer, newPlayer)
		const command = new AtemCommands.MediaPlayerStatusCommand(index)
		if (command.updateProps(props)) {
			commands.push(command)
		}

		const srcProps = diffObject<MediaState.MediaPlayerSource>(oldPlayer, newPlayer)
		const srcCommand = new AtemCommands.MediaPlayerSourceCommand(index)
		if (srcCommand.updateProps(srcProps)) {
			commands.push(srcCommand)
		}
	}

	return commands
}
