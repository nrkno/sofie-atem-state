import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject, fillDefaults } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

export function resolveChromaKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>,
	newKeyer: PartialDeep<VideoState.USK.UpstreamKeyer>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.chromaSettings && !newKeyer.chromaSettings) return commands

	const oldChromaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerChromaSettings, oldKeyer.chromaSettings)
	const newChromaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerChromaSettings, newKeyer.chromaSettings)

	const props = diffObject(oldChromaKeyer, newChromaKeyer)
	const command = new AtemCommands.MixEffectKeyChromaCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
