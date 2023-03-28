import { Commands as AtemCommands, MediaState } from 'atem-connection'
import { PartialDeep } from 'type-fest'
import * as Defaults from '../defaults'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util'
import { DiffMediaPlayer } from '../diff'

export function resolveMediaPlayerState(
	oldPlayers: Array<PartialDeep<MediaState.MediaPlayerState> | undefined> | undefined,
	newPlayers: Array<PartialDeep<MediaState.MediaPlayerState> | undefined> | undefined,
	diffOptions: DiffMediaPlayer | DiffMediaPlayer[]
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldPlayers, newPlayers)) {
		const thisDiffOptions = Array.isArray(diffOptions) ? diffOptions[index] : diffOptions

		if (thisDiffOptions) {
			const newPlayer = fillDefaults(Defaults.Video.MediaPlayer, newPlayers?.[index])
			const oldPlayer = fillDefaults(Defaults.Video.MediaPlayer, oldPlayers?.[index])

			if (thisDiffOptions.source) {
				const srcProps = diffObject<MediaState.MediaPlayerSource>(oldPlayer, newPlayer)
				const srcCommand = new AtemCommands.MediaPlayerSourceCommand(index)
				if (srcCommand.updateProps(srcProps)) {
					commands.push(srcCommand)
				}
			}

			if (thisDiffOptions.status) {
				const props = diffObject<MediaState.MediaPlayer>(oldPlayer, newPlayer)
				const command = new AtemCommands.MediaPlayerStatusCommand(index)
				if (command.updateProps(props)) {
					commands.push(command)
				}
			}
		}
	}

	return commands
}
