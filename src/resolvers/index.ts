import {
	Commands as AtemCommands,
	Enums } from 'atem-connection'
import { State as StateObject } from '../'

import { resolveMixEffectsState } from './mixEffect'
import { resolveDownstreamKeyerState } from './downstreamKeyer'
import { resolveSuperSourceState } from './supersource'
import { resolveAudioState } from './audio'
import { resolveMacroPlayerState } from './macro'
import { getAllKeysNumber } from '../util'
import { resolveMediaPlayerState } from './media'

export function videoState (oldState: StateObject, newState: StateObject, version: Enums.ProtocolVersion): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	commands.push(...resolveMixEffectsState(oldState, newState))
	commands.push(...resolveMacroPlayerState(oldState, newState))
	commands.push(...resolveDownstreamKeyerState(oldState, newState))
	commands.push(...resolveSuperSourceState(oldState, newState, version))
	commands.push(...resolveAudioState(oldState, newState))
	commands.push(...resolveMediaPlayerState(oldState, newState))

	// resolve auxilliaries:
	for (const index of getAllKeysNumber(oldState.video.auxilliaries, newState.video.auxilliaries)) {
		const oldSource = oldState.video.auxilliaries[index] || 0
		const newSource = newState.video.auxilliaries[index] || 0

		if (oldSource !== newSource) {
			commands.push(new AtemCommands.AuxSourceCommand(index, newSource))
		}
	}

	return commands
}
