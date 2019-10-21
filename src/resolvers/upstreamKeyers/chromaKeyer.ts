import { Commands as AtemCommands } from 'atem-connection'
import { UpstreamKeyerChromaSettings, UpstreamKeyer } from 'atem-connection/dist/state/video/upstreamKeyers'
import { diffObject } from '../../util'

export function resolveChromaKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: UpstreamKeyer, newKeyer: UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.chromaSettings && !newKeyer.chromaSettings) return commands

	function defaultChromaSettings (): UpstreamKeyerChromaSettings {
		return {
			hue: 0,
			gain: 0,
			ySuppress: 0,
			lift: 0,
			narrow: false
		}
	}

	const oldChromaKeyer = oldKeyer.chromaSettings || defaultChromaSettings()
	const newChromaKeyer = newKeyer.chromaSettings || defaultChromaSettings()

	const props = diffObject(oldChromaKeyer, newChromaKeyer)

	if (props) {
		const command = new AtemCommands.MixEffectKeyChromaCommand(mixEffectId, upstreamKeyerId)
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}
