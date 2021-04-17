import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject, fillDefaults } from '../../util'
import { Defaults } from '../..'
import { PartialDeep } from 'type-fest'

export function resolveDVEKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>,
	newKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.dveSettings && !newKeyer.dveSettings) return commands

	const oldDVEKeyer = fillDefaults(Defaults.Video.UpstreamKeyerDVESettings, oldKeyer.dveSettings)
	const newDVEKeyer = fillDefaults(Defaults.Video.UpstreamKeyerDVESettings, newKeyer.dveSettings)

	const props = diffObject(oldDVEKeyer, newDVEKeyer)
	const command = new AtemCommands.MixEffectKeyDVECommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
