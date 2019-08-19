import {
	Commands as AtemCommands } from 'atem-connection'
import { State as StateObject } from '../'

import { resolveMixEffectsState } from './mixEffect'
import { resolveDownstreamKeyerState } from './downstreamKeyer'
import { resolveSupersourceBoxState, resolveSuperSourcePropertiesState } from './supersource'
import { resolveAudioState } from './audio'
import { resolveMacroPlayerState } from './macro'

export function videoState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	commands = commands.concat(resolveMixEffectsState(oldState, newState))
	commands = commands.concat(resolveMacroPlayerState(oldState, newState))
	commands = commands.concat(resolveDownstreamKeyerState(oldState, newState))
	commands = commands.concat(resolveSupersourceBoxState(oldState, newState))
	commands = commands.concat(resolveSuperSourcePropertiesState(oldState, newState))
	commands = commands.concat(resolveAudioState(oldState, newState))

	// resolve auxilliaries:
	for (const index in newState.video.auxilliaries) {
		if (oldState.video.auxilliaries[index] !== newState.video.auxilliaries[index]) {
			const command = new AtemCommands.AuxSourceCommand()
			command.auxBus = Number(index)
			command.updateProps({ source: newState.video.auxilliaries[index] })
			commands.push(command)
		}
	}

	return commands
}
