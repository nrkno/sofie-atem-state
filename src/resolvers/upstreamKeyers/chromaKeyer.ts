import { Commands as AtemCommands } from 'atem-connection'
import { UpstreamKeyer } from 'atem-connection/dist/state/video/upstreamKeyers'
import { diffObject } from '../../util'
import { Defaults } from '../..'

export function resolveChromaKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: UpstreamKeyer, newKeyer: UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.chromaSettings && !newKeyer.chromaSettings) return commands

	const oldChromaKeyer = oldKeyer.chromaSettings || Defaults.Video.UpstreamKeyerChromaSettings
	const newChromaKeyer = newKeyer.chromaSettings || Defaults.Video.UpstreamKeyerChromaSettings

	const props = diffObject(oldChromaKeyer, newChromaKeyer)

	if (props) {
		const command = new AtemCommands.MixEffectKeyChromaCommand(mixEffectId, upstreamKeyerId)
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}
