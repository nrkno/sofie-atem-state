import { Commands as AtemCommands, Commands } from 'atem-connection'
import { State as StateObject } from '../'
import { diffObject, getAllKeysNumber } from '../util'
import * as _ from 'underscore'
import { Defaults } from '../defaults'

export function resolveAudioState (oldState: StateObject, newState: StateObject): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []
	if (!newState.audio) return commands

	commands.push(...resolveAudioMixerInputsState(oldState, newState))

	if (oldState.audio.master || newState.audio.master) {
		const oldMaster = oldState.audio.master || Defaults.Audio.Master
		const newMaster = newState.audio.master || Defaults.Audio.Master

		const props = diffObject(oldMaster, newMaster)
		if (props) {
			const command = new Commands.AudioMixerMasterCommand()
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}

export function resolveAudioMixerInputsState (oldState: StateObject, newState: StateObject): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.audio.channels, newState.audio.channels)) {
		const oldChannel = oldState.audio.channels[index] || Defaults.Audio.Channel
		const newChannel = newState.audio.channels[index] || Defaults.Audio.Channel

		const props = diffObject(oldChannel, newChannel, 'sourceType', 'portType')
		if (props) {
			const command = new Commands.AudioMixerInputCommand(index)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}
