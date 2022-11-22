import { Commands as AtemCommands, Enums as AtemEnums, Macro } from 'atem-connection'
import { DiffMacroPlayer } from '../diff'
import { PartialDeep } from 'type-fest'

export function resolveMacroPlayerState(
	oldPlayer: PartialDeep<Macro.MacroPlayerState> | undefined,
	newPlayer: PartialDeep<Macro.MacroPlayerState> | undefined,
	diffOptions: DiffMacroPlayer
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	// TODO - fill out more

	if (diffOptions.player) {
		if (
			newPlayer &&
			newPlayer.isRunning &&
			newPlayer.macroIndex !== undefined &&
			(!oldPlayer || !oldPlayer.isRunning || oldPlayer.macroIndex !== newPlayer.macroIndex)
		) {
			commands.push(new AtemCommands.MacroActionCommand(newPlayer.macroIndex, AtemEnums.MacroAction.Run))
			// TODO - cancel anything running?
		}
	}

	return commands
}
