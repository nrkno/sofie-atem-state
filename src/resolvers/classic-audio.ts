import { AudioState, Commands as AtemCommands, Commands } from 'atem-connection'
import { State as StateObject } from '../state'
import { getAllKeysNumber, diffObject, fillDefaults } from '../util'
import * as Defaults from '../defaults'
import { PartialDeep } from 'type-fest'

export function resolveClassicAudioState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (oldState.audio || newState.audio) {
		commands.push(...resolveClassicAudioMixerOutputsState(oldState, newState))
		commands.push(...resolveClassicAudioMixerInputsState(oldState, newState))
	}

	return commands
}

export function resolveClassicAudioMixerOutputsState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	{
		const oldMaster = fillDefaults(Defaults.Audio.Master, oldState.audio?.master)
		const newMaster = fillDefaults(Defaults.Audio.Master, newState.audio?.master)

		const props = diffObject<AudioState.ClassicAudioMasterChannel>(oldMaster, newMaster)
		const command = new Commands.AudioMixerMasterCommand()
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	{
		const oldMonitor = fillDefaults(Defaults.Audio.Monitor, oldState.audio?.monitor)
		const newMonitor = fillDefaults(Defaults.Audio.Monitor, newState.audio?.monitor)

		const props = diffObject<AudioState.ClassicAudioMonitorChannel>(oldMonitor, newMonitor)
		const command = new Commands.AudioMixerMonitorCommand()
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	{
		const oldHeadphones = fillDefaults(Defaults.Audio.Headphones, oldState.audio?.headphones)
		const newHeadphones = fillDefaults(Defaults.Audio.Headphones, newState.audio?.headphones)

		const props = diffObject<AudioState.ClassicAudioHeadphoneOutputChannel>(oldHeadphones, newHeadphones)
		const command = new Commands.AudioMixerHeadphonesCommand()
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}

export function resolveClassicAudioMixerInputsState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.audio?.channels, newState.audio?.channels)) {
		const oldChannel = fillDefaults(Defaults.Audio.Channel, oldState.audio?.channels?.[index])
		const newChannel = fillDefaults(Defaults.Audio.Channel, newState.audio?.channels?.[index])

		const props = diffObject<AudioState.ClassicAudioChannel>(oldChannel, newChannel)
		const command = new Commands.AudioMixerInputCommand(index)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}
