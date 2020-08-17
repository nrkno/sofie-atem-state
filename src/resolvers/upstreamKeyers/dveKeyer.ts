import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject } from '../../util'
import { Defaults } from '../..'

export function resolveDVEKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: VideoState.USK.UpstreamKeyer, newKeyer: VideoState.USK.UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	let commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.dveSettings && !newKeyer.dveSettings) return commands

	const oldDVEKeyer = oldKeyer.dveSettings || Defaults.Video.UpstreamKeyerDVESettings
	const newDVEKeyer = newKeyer.dveSettings || Defaults.Video.UpstreamKeyerDVESettings

	const props = diffObject(oldDVEKeyer, newDVEKeyer)
	const command = new AtemCommands.MixEffectKeyDVECommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
