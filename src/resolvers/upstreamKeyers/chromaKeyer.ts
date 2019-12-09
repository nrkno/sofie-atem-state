import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject } from '../../util'
import { Defaults } from '../..'

export function resolveChromaKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: VideoState.USK.UpstreamKeyer, newKeyer: VideoState.USK.UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.chromaSettings && !newKeyer.chromaSettings) return commands

	const oldChromaKeyer = oldKeyer.chromaSettings || Defaults.Video.UpstreamKeyerChromaSettings
	const newChromaKeyer = newKeyer.chromaSettings || Defaults.Video.UpstreamKeyerChromaSettings

	const props = diffObject(oldChromaKeyer, newChromaKeyer)
	const command = new AtemCommands.MixEffectKeyChromaCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
