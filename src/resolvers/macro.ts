import {
	Commands as AtemCommands, Enums as AtemEnums
} from 'atem-connection'
import { State as StateObject } from '../'

export function resolveMacroPlayerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const newPlayer = newState.macro.macroPlayer
	const oldPlayer = oldState.macro.macroPlayer

	// TODO - fill out more

	if (newPlayer && newPlayer.isRunning && (!oldPlayer || !oldPlayer.isRunning || oldPlayer.macroIndex !== newPlayer.macroIndex)) {
		commands.push(new AtemCommands.MacroActionCommand(newPlayer.macroIndex, AtemEnums.MacroAction.Run))
		// TODO - cancel anything running?
	}

	return commands
}
