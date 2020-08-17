import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject } from '../../util'
import { Defaults } from '../..'

export function resolveLumaKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: VideoState.USK.UpstreamKeyer, newKeyer: VideoState.USK.UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.lumaSettings && !newKeyer.lumaSettings) return commands

	const oldLumaKeyer = oldKeyer.lumaSettings || Defaults.Video.UpstreamKeyerLumaSettings
	const newLumaKeyer = newKeyer.lumaSettings || Defaults.Video.UpstreamKeyerLumaSettings

	const props = diffObject(oldLumaKeyer, newLumaKeyer)
	const command = new AtemCommands.MixEffectKeyLumaCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
