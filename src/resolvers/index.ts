import {
	Commands as AtemCommands
} from 'atem-connection'
import AbstractCommand from 'atem-connection/dist/commands/AbstractCommand' // @todo: should come from main exports
import { State as StateObject } from '../'

import { resolveMixEffectsState } from './mixEffect'
import { resolveDownstreamKeyerState } from './downstreamKeyer'
import { resolveSupersourceBoxState } from './supersourceBox'

export function videoState (oldState: StateObject, newState: StateObject): Array<AbstractCommand> {
	let commands: Array<AbstractCommand> = []

	commands = commands.concat(resolveMixEffectsState(oldState, newState))
	commands = commands.concat(resolveDownstreamKeyerState(oldState, newState))
	commands = commands.concat(resolveSupersourceBoxState(oldState, newState))

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
