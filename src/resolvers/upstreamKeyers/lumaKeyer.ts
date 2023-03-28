import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject, fillDefaults } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

export function resolveLumaKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerLumaSettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerLumaSettings> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldState && !newState) return commands

	const oldLumaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerLumaSettings, oldState)
	const newLumaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerLumaSettings, newState)

	const props = diffObject(oldLumaKeyer, newLumaKeyer)
	const command = new AtemCommands.MixEffectKeyLumaCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
