import { Fairlight, Commands as AtemCommands, Enums } from 'atem-connection'
import { getAllKeysNumber, diffObject, fillDefaults, getAllKeysString } from '../util'
import * as Defaults from '../defaults'
import { Writable, PartialDeep } from 'type-fest'
import { DiffFairlightAudio, DiffFairlightAudioInput, DiffFairlightAudioInputSource } from '../diff'

export function resolveFairlightAudioState(
	oldState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	newState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	version: Enums.ProtocolVersion,
	diffOptions: DiffFairlightAudio
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (oldState || newState) {
		commands.push(...resolveFairlightAudioMixerOutputsState(oldState, newState, diffOptions))

		if (diffOptions.inputs) {
			commands.push(...resolveFairlightAudioMixerInputsState(oldState, newState, version, diffOptions.inputs))
		}

		if (diffOptions.crossfade) {
			const oldAfv = oldState?.audioFollowVideoCrossfadeTransitionEnabled ?? false
			const newAfv = newState?.audioFollowVideoCrossfadeTransitionEnabled ?? false
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
	}

	return commands
}

function buildMasterPropertiesCommandState(
	master: PartialDeep<Fairlight.FairlightAudioMasterChannel> | undefined
): AtemCommands.FairlightMixerMasterCommandProperties {
	const properties = fillDefaults(Defaults.FairlightAudio.Master, master?.properties)
	const eq = fillDefaults(Defaults.FairlightAudio.Equalizer, master?.equalizer)
	const dynamics = fillDefaults(Defaults.FairlightAudio.Dynamics, master?.dynamics)

	return {
		...properties,
		equalizerEnabled: eq.enabled,
		equalizerGain: eq.gain,
		makeUpGain: dynamics.makeUpGain,
	}
}

export function resolveFairlightAudioMixerOutputsState(
	oldState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	newState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	diffOptions: DiffFairlightAudio
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (diffOptions.masterOutput) {
		if (diffOptions.masterOutput.properties) {
			const oldMaster = buildMasterPropertiesCommandState(oldState?.master)
			const newMaster = buildMasterPropertiesCommandState(newState?.master)

			const props = diffObject<Fairlight.FairlightAudioMasterChannelPropertiesState>(oldMaster, newMaster)
			const command = new AtemCommands.FairlightMixerMasterCommand()
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}

		if (diffOptions.masterOutput.dynamics) {
			{
				const oldLimiter = fillDefaults(Defaults.FairlightAudio.DynamicsLimiter, oldState?.master?.dynamics?.limiter)
				const newLimiter = fillDefaults(Defaults.FairlightAudio.DynamicsLimiter, newState?.master?.dynamics?.limiter)

				const props = diffObject<Fairlight.FairlightAudioLimiterState>(oldLimiter, newLimiter)
				const command = new AtemCommands.FairlightMixerMasterLimiterCommand()
				if (command.updateProps(props)) {
					commands.push(command)
				}
			}

			if (diffOptions.masterOutput.properties) {
				const oldCompressor = fillDefaults(
					Defaults.FairlightAudio.DynamicsCompressor,
					oldState?.master?.dynamics?.compressor
				)
				const newCompressor = fillDefaults(
					Defaults.FairlightAudio.DynamicsCompressor,
					newState?.master?.dynamics?.compressor
				)

				const props = diffObject<Fairlight.FairlightAudioCompressorState>(oldCompressor, newCompressor)
				const command = new AtemCommands.FairlightMixerMasterCompressorCommand()
				if (command.updateProps(props)) {
					commands.push(command)
				}
			}
		}

		if (diffOptions.masterOutput.equalizer) {
			for (const index of getAllKeysNumber(oldState?.master?.equalizer?.bands, newState?.master?.equalizer?.bands)) {
				const oldBand = fillDefaults(
					Defaults.FairlightAudio.DynamicsEqualizerBand,
					oldState?.master?.equalizer?.bands?.[index]
				)
				const newBand = fillDefaults(
					Defaults.FairlightAudio.DynamicsEqualizerBand,
					newState?.master?.equalizer?.bands?.[index]
				)

				const props = diffObject<Fairlight.FairlightAudioEqualizerBandState>(oldBand, newBand)
				const command = new AtemCommands.FairlightMixerMasterEqualizerBandCommand(index)
				if (command.updateProps(props)) {
					commands.push(command)
				}
			}
		}
	}

	if (diffOptions.monitorOutput) {
		const oldMonitor = fillDefaults(Defaults.FairlightAudio.Monitor, oldState?.monitor)
		const newMonitor = fillDefaults(Defaults.FairlightAudio.Monitor, newState?.monitor)

		const props = diffObject<Fairlight.FairlightAudioMonitorChannel>(oldMonitor, newMonitor)
		const command = new AtemCommands.FairlightMixerMonitorCommand()
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}

export function resolveFairlightAudioMixerInputsState(
	oldState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	newState: PartialDeep<Fairlight.AtemFairlightAudioState> | undefined,
	version: Enums.ProtocolVersion,
	diffOptions: Record<number | 'default', DiffFairlightAudioInput | undefined>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState?.inputs, newState?.inputs)) {
		const thisDiffOptions = diffOptions[index] ?? diffOptions['default']

		const oldInput = oldState?.inputs?.[index]
		const newInput = newState?.inputs?.[index]

		if (thisDiffOptions?.properties) {
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
				const props2: Writable<AtemCommands.FairlightMixerInputCommand['properties']> = props
				props2.rcaToXlrEnabled = props.activeInputLevel === Enums.FairlightAnalogInputLevel.ProLine

				if (command.updateProps(props2)) {
					commands.push(command)
				}
			}
		}

		if (thisDiffOptions?.sources) {
			commands.push(...resolveFairlightAudioMixerInputSourcesState(index, oldInput, newInput, thisDiffOptions.sources))
		}
	}

	return commands
}

function buildSourcePropertiesCommandState(
	source: PartialDeep<Fairlight.FairlightAudioSource> | undefined
): AtemCommands.FairlightMixerSourceCommandProperties {
	const properties = fillDefaults(Defaults.FairlightAudio.SourceProperties, source?.properties)
	const eq = fillDefaults(Defaults.FairlightAudio.Equalizer, source?.equalizer)
	const dynamics = fillDefaults(Defaults.FairlightAudio.Dynamics, source?.dynamics)

	return {
		...properties,
		equalizerEnabled: eq.enabled,
		equalizerGain: eq.gain,
		makeUpGain: dynamics.makeUpGain,
	}
}

export function resolveFairlightAudioMixerInputSourcesState(
	index: number,
	oldInput: PartialDeep<Fairlight.FairlightAudioInput> | undefined,
	newInput: PartialDeep<Fairlight.FairlightAudioInput> | undefined,
	diffOptions: Record<number | 'default', DiffFairlightAudioInputSource | undefined>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const sourceId of getAllKeysString(oldInput?.sources, newInput?.sources)) {
		const thisDiffOptions = diffOptions[index] ?? diffOptions['default']

		const oldSource = oldInput?.sources?.[sourceId]
		const newSource = newInput?.sources?.[sourceId]

		if (thisDiffOptions?.properties) {
			const oldProperties = buildSourcePropertiesCommandState(oldSource)
			const newProperties = buildSourcePropertiesCommandState(newSource)

			const props = diffObject<AtemCommands.FairlightMixerSourceCommandProperties>(oldProperties, newProperties)
			const command = new AtemCommands.FairlightMixerSourceCommand(index, BigInt(sourceId))
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}

		if (thisDiffOptions?.dynamics) {
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

		if (thisDiffOptions?.equalizer) {
			for (const index of getAllKeysNumber(oldSource?.equalizer?.bands, newSource?.equalizer?.bands)) {
				const oldBand = fillDefaults(
					Defaults.FairlightAudio.DynamicsEqualizerBand,
					oldSource?.equalizer?.bands?.[index]
				)
				const newBand = fillDefaults(
					Defaults.FairlightAudio.DynamicsEqualizerBand,
					newSource?.equalizer?.bands?.[index]
				)

				const props = diffObject<Fairlight.FairlightAudioEqualizerBandState>(oldBand, newBand)
				const command = new AtemCommands.FairlightMixerMasterEqualizerBandCommand(index)
				if (command.updateProps(props)) {
					commands.push(command)
				}
			}
		}
	}

	return commands
}
