import { Commands as AtemCommands, Commands } from 'atem-connection'
import { State as StateObject } from '../'
import { AudioChannel } from 'atem-connection/dist/state/audio'
import { compareProps } from '../util'

export function resolveAudioState (oldState: StateObject, newState: StateObject): Array<Commands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []
	if (!newState.audio) return commands

	commands = commands.concat(resolveAudioMixerInputsState(oldState, newState))

	const oldMaster = oldState.audio.master
	const newMaster = newState.audio.master
	const props = compareProps(oldMaster, newMaster, ['gain', 'balance', 'followFadeToBlack'])

	if (Object.keys(props).length > 0) {
		const command = new Commands.AudioMixerMasterCommand()
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}

export function resolveAudioMixerInputsState (oldState: StateObject, newState: StateObject): Array<Commands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []
	if (!newState.audio || !newState.audio.channels) return commands

	for (const index in newState.audio.channels) {
		const oldChannel = oldState.audio.channels[index]
		const newChannel = newState.audio.channels[index]
		let props: Partial<AudioChannel> = {}

		if (!newChannel) continue

		if (!oldChannel) {
			props = newChannel
		} else {
			props = compareProps(oldChannel, newChannel, ['gain', 'mixOption', 'balance'])
		}

		if (Object.keys(props).length > 0) {
			const command = new Commands.AudioMixerInputCommand()
			command.index = Number(index)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}
