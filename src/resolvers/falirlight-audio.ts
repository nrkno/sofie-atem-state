import { Fairlight, Commands as AtemCommands, Enums } from 'atem-connection'
import { State as StateObject } from '../state'
import { getAllKeysNumber, diffObject, fillDefaults, getAllKeysString } from '../util'
import * as Defaults from '../defaults'
import { Mutable, PartialDeep } from 'type-fest'

export function resolveFairlightAudioState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>,
	version: Enums.ProtocolVersion
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (oldState.fairlight || newState.fairlight) {
		commands.push(...resolveFairlightAudioMixerOutputsState(oldState, newState))
		commands.push(...resolveFairlightAudioMixerInputsState(oldState, newState, version))

		const oldAfv = oldState.fairlight?.audioFollowVideoCrossfadeTransitionEnabled ?? false
		const newAfv = newState.fairlight?.audioFollowVideoCrossfadeTransitionEnabled ?? false
		if (oldAfv !== newAfv) {
			const command = new AtemCommands.FairlightMixerMasterPropertiesCommand()
			const newProps = {
				audioFollowVideo: newAfv,
			}
			if (command.updateProps(newProps)) {
				commands.push(command)
			}
		}
	}

	return commands
}

export function resolveFairlightAudioMixerOutputsState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	{
		{
			const oldMaster = fillDefaults(Defaults.FairlightAudio.Master, oldState.fairlight?.master)
			const newMaster = fillDefaults(Defaults.FairlightAudio.Master, newState.fairlight?.master)

			const props = diffObject<Fairlight.FairlightAudioMasterChannel>(oldMaster, newMaster)
			const command = new AtemCommands.FairlightMixerMasterCommand()
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}

		{
			const oldLimiter = fillDefaults(
				Defaults.FairlightAudio.DynamicsLimiter,
				oldState.fairlight?.master?.dynamics?.limiter
			)
			const newLimiter = fillDefaults(
				Defaults.FairlightAudio.DynamicsLimiter,
				newState.fairlight?.master?.dynamics?.limiter
			)

			const props = diffObject<Fairlight.FairlightAudioLimiterState>(oldLimiter, newLimiter)
			const command = new AtemCommands.FairlightMixerMasterLimiterCommand()
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}

		{
			const oldCompressor = fillDefaults(
				Defaults.FairlightAudio.DynamicsCompressor,
				oldState.fairlight?.master?.dynamics?.compressor
			)
			const newCompressor = fillDefaults(
				Defaults.FairlightAudio.DynamicsCompressor,
				newState.fairlight?.master?.dynamics?.compressor
			)

			const props = diffObject<Fairlight.FairlightAudioCompressorState>(oldCompressor, newCompressor)
			const command = new AtemCommands.FairlightMixerMasterCompressorCommand()
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}

		for (const index of getAllKeysNumber(
			oldState.fairlight?.master?.equalizerBands,
			newState.fairlight?.master?.equalizerBands
		)) {
			const oldBand = fillDefaults(
				Defaults.FairlightAudio.DynamicsEqualizerBand,
				oldState.fairlight?.master?.equalizerBands?.[index]
			)
			const newBand = fillDefaults(
				Defaults.FairlightAudio.DynamicsEqualizerBand,
				newState.fairlight?.master?.equalizerBands?.[index]
			)

			const props = diffObject<Fairlight.FairlightAudioEqualizerBandState>(oldBand, newBand)
			const command = new AtemCommands.FairlightMixerMasterEqualizerBandCommand(index)
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}
	}

	{
		const oldMonitor = fillDefaults(Defaults.FairlightAudio.Monitor, oldState.fairlight?.monitor)
		const newMonitor = fillDefaults(Defaults.FairlightAudio.Monitor, newState.fairlight?.monitor)

		const props = diffObject<Fairlight.FairlightAudioMonitorChannel>(oldMonitor, newMonitor)
		const command = new AtemCommands.FairlightMixerMonitorCommand()
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}

export function resolveFairlightAudioMixerInputsState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>,
	version: Enums.ProtocolVersion
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.fairlight?.inputs, newState.fairlight?.inputs)) {
		const oldInput = oldState.fairlight?.inputs?.[index]
		const newInput = newState.fairlight?.inputs?.[index]

		{
			const oldProperties = fillDefaults(Defaults.FairlightAudio.InputProperties, oldInput?.properties)
			const newProperties = fillDefaults(Defaults.FairlightAudio.InputProperties, newInput?.properties)

			const props = diffObject<Fairlight.FairlightAudioInputProperties>(oldProperties, newProperties)
			if (version >= AtemCommands.FairlightMixerInputV8Command.minimumVersion) {
				const command = new AtemCommands.FairlightMixerInputV8Command(index)
				if (command.updateProps(props)) {
					commands.push(command)
				}
			} else {
				const command = new AtemCommands.FairlightMixerInputCommand(index)

				// Translate old properties
				const props2: Mutable<AtemCommands.FairlightMixerInputCommand['properties']> = props
				props2.rcaToXlrEnabled = props.activeInputLevel === Enums.FairlightAnalogInputLevel.ProLine

				if (command.updateProps(props2)) {
					commands.push(command)
				}
			}
		}

		commands.push(...resolveFairlightAudioMixerInputSourcesState(index, oldInput, newInput))
	}

	return commands
}

export function resolveFairlightAudioMixerInputSourcesState(
	index: number,
	oldInput: PartialDeep<Fairlight.FairlightAudioInput> | undefined,
	newInput: PartialDeep<Fairlight.FairlightAudioInput> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const sourceId of getAllKeysString(oldInput?.sources, newInput?.sources)) {
		const oldSource = oldInput?.sources?.[sourceId]
		const newSource = newInput?.sources?.[sourceId]

		{
			const oldProperties = fillDefaults(Defaults.FairlightAudio.SourceProperties, oldSource?.properties)
			const newProperties = fillDefaults(Defaults.FairlightAudio.SourceProperties, newSource?.properties)

			const props = diffObject<Fairlight.FairlightAudioSourceProperties>(oldProperties, newProperties)
			const command = new AtemCommands.FairlightMixerSourceCommand(index, BigInt(sourceId))
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}

		{
			const oldLimiter = fillDefaults(Defaults.FairlightAudio.DynamicsLimiter, oldSource?.dynamics?.limiter)
			const newLimiter = fillDefaults(Defaults.FairlightAudio.DynamicsLimiter, newSource?.dynamics?.limiter)

			const props = diffObject<Fairlight.FairlightAudioLimiterState>(oldLimiter, newLimiter)
			const command = new AtemCommands.FairlightMixerSourceLimiterCommand(index, BigInt(sourceId))
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}

		{
			const oldCompressor = fillDefaults(Defaults.FairlightAudio.DynamicsCompressor, oldSource?.dynamics?.compressor)
			const newCompressor = fillDefaults(Defaults.FairlightAudio.DynamicsCompressor, newSource?.dynamics?.compressor)

			const props = diffObject<Fairlight.FairlightAudioCompressorState>(oldCompressor, newCompressor)
			const command = new AtemCommands.FairlightMixerSourceCompressorCommand(index, BigInt(sourceId))
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}

		{
			const oldExpander = fillDefaults(Defaults.FairlightAudio.DynamicsExpander, oldSource?.dynamics?.expander)
			const newExpander = fillDefaults(Defaults.FairlightAudio.DynamicsExpander, newSource?.dynamics?.expander)

			const props = diffObject<Fairlight.FairlightAudioExpanderState>(oldExpander, newExpander)
			const command = new AtemCommands.FairlightMixerSourceExpanderCommand(index, BigInt(sourceId))
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}
	}

	return commands
}
