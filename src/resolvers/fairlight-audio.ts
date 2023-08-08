import { Commands as AtemCommands, Commands, Fairlight } from 'atem-connection'
import { State as StateObject } from '..'
import { getAllKeysNumber, diffObject, fillDefaults } from '../util'
import { PartialDeep } from 'type-fest'

export function resolveFairlightAudioState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []
	if (!newState.fairlight) return commands

	if (newState.fairlight.audioRouting || oldState.fairlight?.audioRouting) {
		commands.push(
			...resolveFairlightAudioRoutingState(newState.fairlight.audioRouting, oldState.fairlight?.audioRouting)
		)
	}

	return commands
}

export function resolveFairlightAudioRoutingState(
	oldState: PartialDeep<Fairlight.FairlightAudioRouting> | undefined,
	newState: PartialDeep<Fairlight.FairlightAudioRouting> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const outputId of getAllKeysNumber(oldState?.outputs, newState?.outputs)) {
		const oldProperties = fillDefaults<Pick<Fairlight.FairlightAudioRoutingOutput, 'sourceId'>>(
			{ sourceId: 0 },
			oldState?.outputs?.[outputId]
		)
		const newProperties = fillDefaults<Pick<Fairlight.FairlightAudioRoutingOutput, 'sourceId'>>(
			{ sourceId: 0 },
			newState?.outputs?.[outputId]
		)

		const props = diffObject<Fairlight.FairlightAudioRoutingOutput>(oldProperties, newProperties)
		const command = new AtemCommands.AudioRoutingOutputCommand(outputId)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
