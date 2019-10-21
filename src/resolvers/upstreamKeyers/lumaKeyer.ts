import { Commands as AtemCommands } from 'atem-connection'
import { UpstreamKeyerLumaSettings, UpstreamKeyer } from 'atem-connection/dist/state/video/upstreamKeyers'
import { diffObject } from '../../util'

export function resolveLumaKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: UpstreamKeyer, newKeyer: UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.lumaSettings && !newKeyer.lumaSettings) return commands

	function defaultLumaSettings (): UpstreamKeyerLumaSettings {
		return {
			preMultiplied: false,
			clip: 0,
			gain: 0,
			invert: false
		}
	}

	const oldLumaKeyer = oldKeyer.lumaSettings || defaultLumaSettings()
	const newLumaKeyer = newKeyer.lumaSettings || defaultLumaSettings()

	const props = diffObject(oldLumaKeyer, newLumaKeyer)
	if (props) {
		const command = new AtemCommands.MixEffectKeyLumaCommand(mixEffectId, upstreamKeyerId)
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}
