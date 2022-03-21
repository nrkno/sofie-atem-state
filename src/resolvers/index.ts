import { Commands as AtemCommands, Enums } from 'atem-connection'
import { State as StateObject } from '../state'
import { resolveMixEffectsState } from './mixEffect'
import { resolveDownstreamKeyerState } from './downstreamKeyer'
import { resolveSuperSourceState } from './supersource'
import { resolveClassicAudioState } from './classic-audio'
import { resolveMacroPlayerState } from './macro'
import { resolveMediaPlayerState } from './media'
import { PartialDeep } from 'type-fest'
import { resolveColorState } from './color'
import { resolveMultiviewerState } from './settings/multiviewer'
import { resolveFairlightAudioState } from './falirlight-audio'
import { SectionsToDiff } from '../diff'
import { resolveAuxiliaries } from './auxiliaries'

export function diffState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>,
	options: SectionsToDiff,
	version: Enums.ProtocolVersion
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	commands.push(...resolveMixEffectsState(oldState, newState))
	commands.push(...resolveMacroPlayerState(oldState, newState))
	commands.push(...resolveDownstreamKeyerState(oldState, newState))
	commands.push(...resolveSuperSourceState(oldState, newState, version))
	commands.push(...resolveClassicAudioState(oldState, newState))
	commands.push(...resolveFairlightAudioState(oldState, newState, version))
	commands.push(...resolveMediaPlayerState(oldState, newState))
	commands.push(...resolveColorState(oldState, newState))

	if (options.multiviewer) {
		commands.push(
			...resolveMultiviewerState(oldState.settings?.multiViewers, newState.settings?.multiViewers, options.multiviewer)
		)
	}

	if (options.auxiliaries && options.auxiliaries.length) {
		commands.push(
			...resolveAuxiliaries(oldState.video?.auxilliaries, newState.video?.auxilliaries, options.auxiliaries)
		)
	}

	return commands
}
