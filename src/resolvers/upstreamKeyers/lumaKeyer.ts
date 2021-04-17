import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject, fillDefaults } from '../../util'
import { Defaults } from '../..'
import { PartialDeep } from 'type-fest'

export function resolveLumaKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>,
	newKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.lumaSettings && !newKeyer.lumaSettings) return commands

	const oldLumaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerLumaSettings, oldKeyer.lumaSettings)
	const newLumaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerLumaSettings, newKeyer.lumaSettings)

	const props = diffObject(oldLumaKeyer, newLumaKeyer)
	const command = new AtemCommands.MixEffectKeyLumaCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
