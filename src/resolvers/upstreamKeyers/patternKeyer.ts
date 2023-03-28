import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject, fillDefaults } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

export function resolvePatternKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerPatternSettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerPatternSettings> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldState && !newState) return commands

	const oldPatternKeyer = fillDefaults(Defaults.Video.UpstreamKeyerPatternSettings, oldState)
	const newPatternKeyer = fillDefaults(Defaults.Video.UpstreamKeyerPatternSettings, newState)

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
