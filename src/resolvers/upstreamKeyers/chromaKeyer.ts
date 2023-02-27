import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject, fillDefaults } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

export function resolveChromaKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerChromaSettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerChromaSettings> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldState && !newState) return commands

	const oldChromaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerChromaSettings, oldState)
	const newChromaKeyer = fillDefaults(Defaults.Video.UpstreamKeyerChromaSettings, newState)

	const props = diffObject(oldChromaKeyer, newChromaKeyer)
	const command = new AtemCommands.MixEffectKeyChromaCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}

export function resolveAdvancedChromaKeyerState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<VideoState.USK.UpstreamKeyerAdvancedChromaSettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerAdvancedChromaSettings> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldState && !newState) return commands

	{
		const oldProperties = fillDefaults(Defaults.Video.UpstreamKeyerAdvancedChromaProperties, oldState?.properties)
		const newProperties = fillDefaults(Defaults.Video.UpstreamKeyerAdvancedChromaProperties, newState?.properties)

		const props = diffObject(oldProperties, newProperties)
		const command = new AtemCommands.MixEffectKeyAdvancedChromaPropertiesCommand(mixEffectId, upstreamKeyerId)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}
	{
		const oldProperties = fillDefaults(Defaults.Video.UpstreamKeyerAdvancedChromaSample, oldState?.sample)
		const newProperties = fillDefaults(Defaults.Video.UpstreamKeyerAdvancedChromaSample, newState?.sample)

		const props = diffObject(oldProperties, newProperties)
		const command = new AtemCommands.MixEffectKeyAdvancedChromaSampleCommand(mixEffectId, upstreamKeyerId)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
