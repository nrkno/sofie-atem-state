import { Commands as AtemCommands } from 'atem-connection'
import { UpstreamKeyer } from 'atem-connection/dist/state/video/upstreamKeyers'
import { diffObject } from '../../util'
import { Defaults } from '../..'

export function resolveDVEKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: UpstreamKeyer, newKeyer: UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	let commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.dveSettings && !newKeyer.dveSettings) return commands

	const oldDVEKeyer = oldKeyer.dveSettings || Defaults.Video.UpstreamKeyerDVESettings
	const newDVEKeyer = newKeyer.dveSettings || Defaults.Video.UpstreamKeyerDVESettings

	const props = diffObject(oldDVEKeyer, newDVEKeyer)
	if (props) {
		const command = new AtemCommands.MixEffectKeyDVECommand(mixEffectId, upstreamKeyerId)
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}
