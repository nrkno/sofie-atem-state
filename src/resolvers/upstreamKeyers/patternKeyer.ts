import { Commands as AtemCommands, Enums } from 'atem-connection'
import { UpstreamKeyerPatternSettings, UpstreamKeyer } from 'atem-connection/dist/state/video/upstreamKeyers'
import { diffObject } from '../../util'

export function resolvePatternKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: UpstreamKeyer, newKeyer: UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.patternSettings && !newKeyer.patternSettings) return commands

	function defaultPatternSettings (): UpstreamKeyerPatternSettings {
		return {
			style: Enums.Pattern.LeftToRightBar,
			size: 0,
			symmetry: 0,
			softness: 0,
			positionX: 0,
			positionY: 0,
			invert: false
		}
	}

	const oldPatternKeyer = oldKeyer.patternSettings || defaultPatternSettings()
	const newPatternKeyer = newKeyer.patternSettings || defaultPatternSettings()

	const props = diffObject(oldPatternKeyer, newPatternKeyer)
	if (props && oldPatternKeyer.style !== newPatternKeyer.style) {
		// These can be reset when changing pattern, so enforce they are what we expect
		props.positionX = newPatternKeyer.positionX
		props.positionY = newPatternKeyer.positionY
		props.symmetry = newPatternKeyer.symmetry
	}

	if (props) {
		const command = new AtemCommands.MixEffectKeyPatternCommand(mixEffectId, upstreamKeyerId)
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}
