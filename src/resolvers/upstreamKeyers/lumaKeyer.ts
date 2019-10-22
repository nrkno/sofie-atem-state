import { Commands as AtemCommands } from 'atem-connection'
import { UpstreamKeyer } from 'atem-connection/dist/state/video/upstreamKeyers'
import { diffObject } from '../../util'
import { Defaults } from '../..'

export function resolveLumaKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: UpstreamKeyer, newKeyer: UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.lumaSettings && !newKeyer.lumaSettings) return commands

	const oldLumaKeyer = oldKeyer.lumaSettings || Defaults.Video.UpstreamKeyerLumaSettings
	const newLumaKeyer = newKeyer.lumaSettings || Defaults.Video.UpstreamKeyerLumaSettings

	const props = diffObject(oldLumaKeyer, newLumaKeyer)
	if (props) {
		const command = new AtemCommands.MixEffectKeyLumaCommand(mixEffectId, upstreamKeyerId)
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}
