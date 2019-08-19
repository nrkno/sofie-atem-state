import {
	Commands as AtemCommands, Enums as AtemEnums
} from 'atem-connection'
import { State as StateObject } from '../'

export function resolveMacroPlayerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []
	if (!newState.macro) return commands

	const newPlayer = newState.macro.macroPlayer
	const oldPlayer = oldState.macro.macroPlayer

	// TODO - fill out more

	if (newPlayer && newPlayer.isRunning && (!oldPlayer || !oldPlayer.isRunning || oldPlayer.macroIndex !== newPlayer.macroIndex)) {
		const command = new AtemCommands.MacroActionCommand()
		command.index = newPlayer.macroIndex
		command.updateProps({ action: AtemEnums.MacroAction.Run })
		commands.push(command)
		// TODO - cancel anything running?
	}

	return commands
}
