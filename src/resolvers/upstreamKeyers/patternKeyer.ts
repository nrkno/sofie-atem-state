import { Commands as AtemCommands } from 'atem-connection'
import { UpstreamKeyer } from 'atem-connection/dist/state/video/upstreamKeyers'
import { diffObject } from '../../util'
import { Defaults } from '../..'

export function resolvePatternKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: UpstreamKeyer, newKeyer: UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.patternSettings && !newKeyer.patternSettings) return commands

	const oldPatternKeyer = oldKeyer.patternSettings || Defaults.Video.UpstreamKeyerPatternSettings
	const newPatternKeyer = newKeyer.patternSettings || Defaults.Video.UpstreamKeyerPatternSettings

	const props = diffObject(oldPatternKeyer, newPatternKeyer)
	if (props && oldPatternKeyer.style !== newPatternKeyer.style) {
		// These can be reset when changing pattern, so enforce they are what we expect
		props.positionX = newPatternKeyer.positionX
		props.positionY = newPatternKeyer.positionY
		props.symmetry = newPatternKeyer.symmetry
	}

	const command = new AtemCommands.MixEffectKeyPatternCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
