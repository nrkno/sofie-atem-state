import { Commands as AtemCommands, MediaState } from 'atem-connection'
import { PartialDeep } from 'type-fest'
import { State as StateObject } from '../state'
import * as Defaults from '../defaults'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util'

export function resolveMediaPlayerState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.media?.players, newState.media?.players)) {
		const newPlayer = fillDefaults(Defaults.Video.MediaPlayer, newState.media?.players?.[index])
		const oldPlayer = fillDefaults(Defaults.Video.MediaPlayer, oldState.media?.players?.[index])

		const srcProps = diffObject<MediaState.MediaPlayerSource>(oldPlayer, newPlayer)
		const srcCommand = new AtemCommands.MediaPlayerSourceCommand(index)
		if (srcCommand.updateProps(srcProps)) {
			commands.push(srcCommand)
		}

		const props = diffObject<MediaState.MediaPlayer>(oldPlayer, newPlayer)
		const command = new AtemCommands.MediaPlayerStatusCommand(index)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
