import { Commands as AtemCommands, Commands } from 'atem-connection'
import { State as StateObject } from '../'
import { getAllKeysNumber, diffObject, fillDefaults } from '../util'
import * as Defaults from '../defaults'
import { PartialDeep } from 'type-fest'

export function resolveAudioState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []
	if (!newState.audio) return commands

	commands.push(...resolveAudioMixerInputsState(oldState, newState))

	if (oldState.audio || newState.audio) {
		const oldMaster = fillDefaults(Defaults.Audio.Master, oldState.audio?.master)
		const newMaster = fillDefaults(Defaults.Audio.Master, newState.audio?.master)

		const props = diffObject(oldMaster, newMaster)
		const command = new Commands.AudioMixerMasterCommand()
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}

export function resolveAudioMixerInputsState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (oldState.audio || newState.audio) {
		for (const index of getAllKeysNumber(oldState.audio?.channels, newState.audio?.channels)) {
			const oldChannel = fillDefaults(Defaults.Audio.Channel, oldState.audio?.channels?.[index])
			const newChannel = fillDefaults(Defaults.Audio.Channel, newState.audio?.channels?.[index])

			const props = diffObject(oldChannel, newChannel)
			const command = new Commands.AudioMixerInputCommand(index)
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}
	}

	return commands
}
