import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject, fillDefaults } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

export function resolveDVEKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerDVESettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerDVESettings> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldState && !newState) return commands

	const oldDVEKeyer = fillDefaults(Defaults.Video.UpstreamKeyerDVESettings, oldState)
	const newDVEKeyer = fillDefaults(Defaults.Video.UpstreamKeyerDVESettings, newState)

	const props = diffObject(oldDVEKeyer, newDVEKeyer)
	const command = new AtemCommands.MixEffectKeyDVECommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
