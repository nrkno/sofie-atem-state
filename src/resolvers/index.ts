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
	diffOptions: SectionsToDiff,
	version: Enums.ProtocolVersion
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	commands.push(...resolveMixEffectsState(oldState, newState))

	if (diffOptions.macros?.player) {
		commands.push(
			...resolveMacroPlayerState(oldState.macro?.macroPlayer, newState.macro?.macroPlayer, diffOptions.macros.player)
		)
	}

	if (diffOptions.video?.downstreamKeyers) {
		commands.push(
			...resolveDownstreamKeyerState(
				oldState.video?.downstreamKeyers,
				newState.video?.downstreamKeyers,
				diffOptions.video.downstreamKeyers
			)
		)
	}
	commands.push(...resolveSuperSourceState(oldState, newState, version))
	commands.push(...resolveClassicAudioState(oldState, newState))
	commands.push(...resolveFairlightAudioState(oldState, newState, version))

	if (diffOptions.media?.players) {
		commands.push(
			...resolveMediaPlayerState(oldState.media?.players, newState.media?.players, diffOptions.media.players)
		)
	}

	if (diffOptions.colorGenerators && diffOptions.colorGenerators.length) {
		commands.push(...resolveColorState(oldState.colorGenerators, newState.colorGenerators, diffOptions.colorGenerators))
	}

	if (diffOptions.settings?.multiviewer) {
		commands.push(
			...resolveMultiviewerState(
				oldState.settings?.multiViewers,
				newState.settings?.multiViewers,
				diffOptions.settings.multiviewer
			)
		)
	}

	if (diffOptions.video?.auxiliaries && diffOptions.video.auxiliaries.length) {
		commands.push(
			...resolveAuxiliaries(oldState.video?.auxilliaries, newState.video?.auxilliaries, diffOptions.video.auxiliaries)
		)
	}

	return commands
}
