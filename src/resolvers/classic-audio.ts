import { AudioState, Commands as AtemCommands, Commands } from 'atem-connection'
import { getAllKeysNumber, diffObject, fillDefaults } from '../util'
import * as Defaults from '../defaults'
import { PartialDeep } from 'type-fest'
import { DiffClassicAudio } from '../diff'
import { AtemClassicAudioState } from 'atem-connection/dist/state/audio'

export function resolveClassicAudioState(
	oldState: PartialDeep<AtemClassicAudioState> | undefined,
	newState: PartialDeep<AtemClassicAudioState> | undefined,
	diffOptions: DiffClassicAudio
): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (oldState || newState) {
		commands.push(...resolveClassicAudioMixerOutputsState(oldState, newState, diffOptions))

		if (diffOptions.channels) {
			commands.push(
				...resolveClassicAudioMixerInputsState(oldState?.channels, newState?.channels, diffOptions.channels)
			)
		}

		if (diffOptions.crossfade) {
			const oldAfv = oldState?.audioFollowVideoCrossfadeTransitionEnabled ?? false
			const newAfv = newState?.audioFollowVideoCrossfadeTransitionEnabled ?? false
			if (oldAfv !== newAfv) {
				commands.push(
					new AtemCommands.AudioMixerPropertiesCommand({
						audioFollowVideo: newAfv,
					})
				)
			}
		}
	}

	return commands
}

export function resolveClassicAudioMixerOutputsState(
	oldState: PartialDeep<AtemClassicAudioState> | undefined,
	newState: PartialDeep<AtemClassicAudioState> | undefined,
	diffOptions: DiffClassicAudio
): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (diffOptions.masterOutput) {
		const oldMaster = fillDefaults(Defaults.ClassicAudio.Master, oldState?.master)
		const newMaster = fillDefaults(Defaults.ClassicAudio.Master, newState?.master)

		const props = diffObject<AudioState.ClassicAudioMasterChannel>(oldMaster, newMaster)
		const command = new Commands.AudioMixerMasterCommand()
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	if (diffOptions.monitorOutput) {
		const oldMonitor = fillDefaults(Defaults.ClassicAudio.Monitor, oldState?.monitor)
		const newMonitor = fillDefaults(Defaults.ClassicAudio.Monitor, newState?.monitor)

		const props = diffObject<AudioState.ClassicAudioMonitorChannel>(oldMonitor, newMonitor)
		const command = new Commands.AudioMixerMonitorCommand()
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	if (diffOptions.headphonesOutput) {
		const oldHeadphones = fillDefaults(Defaults.ClassicAudio.Headphones, oldState?.headphones)
		const newHeadphones = fillDefaults(Defaults.ClassicAudio.Headphones, newState?.headphones)

		const props = diffObject<AudioState.ClassicAudioHeadphoneOutputChannel>(oldHeadphones, newHeadphones)
		const command = new Commands.AudioMixerHeadphonesCommand()
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}

export function resolveClassicAudioMixerInputsState(
	oldState: PartialDeep<AtemClassicAudioState['channels']> | undefined,
	newState: PartialDeep<AtemClassicAudioState['channels']> | undefined,
	diffOptions: number[] | 'all'
): Array<Commands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState, newState)) {
		if (diffOptions === 'all' || diffOptions.includes(index)) {
			const oldChannel = fillDefaults(Defaults.ClassicAudio.Channel, oldState?.[index])
			const newChannel = fillDefaults(Defaults.ClassicAudio.Channel, newState?.[index])

			const props = diffObject<AudioState.ClassicAudioChannel>(oldChannel, newChannel)
			const command = new Commands.AudioMixerInputCommand(index)
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}
	}

	return commands
}
