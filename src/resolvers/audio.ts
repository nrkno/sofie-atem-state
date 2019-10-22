import { Commands as AtemCommands, Commands, AudioState, Enums } from 'atem-connection'
import { State as StateObject } from '../'
import { diffObject, getAllKeysNumber } from '../util'
import * as _ from 'underscore'

export function resolveAudioState (oldState: StateObject, newState: StateObject): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []
	if (!newState.audio) return commands

	commands.push(...resolveAudioMixerInputsState(oldState, newState))

	function masterDefaults (): AudioState.AudioMasterChannel {
		return {
			gain: 0,
			balance: 0,
			followFadeToBlack: false
		}
	}

	if (oldState.audio.master || newState.audio.master) {
		const oldMaster = oldState.audio.master || masterDefaults()
		const newMaster = newState.audio.master || masterDefaults()

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

	function channelDefaults (): AudioState.AudioChannel {
		return {
			gain: 0,
			balance: 0,
			mixOption: Enums.AudioMixOption.Off,
			sourceType: 0,
			portType: 0
		}
	}

	for (const index of getAllKeysNumber(oldState.audio.channels, newState.audio.channels)) {
		const oldChannel = oldState.audio.channels[index] || channelDefaults()
		const newChannel = newState.audio.channels[index] || channelDefaults()

		const props = diffObject(oldChannel, newChannel, 'sourceType', 'portType')
		if (props) {
			const command = new Commands.AudioMixerInputCommand(index)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}
