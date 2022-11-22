import { ColorGeneratorState, Commands as AtemCommands } from 'atem-connection'
import { PartialDeep } from 'type-fest'
import * as Defaults from '../defaults'
import { diffObject, fillDefaults, getAllKeysNumber } from '../util'
import { DiffColorGenerators } from '../diff'

export function resolveColorState(
	oldState: PartialDeep<{ [index: number]: ColorGeneratorState | undefined }> | undefined,
	newState: PartialDeep<{ [index: number]: ColorGeneratorState | undefined }> | undefined,
	diffOptions: DiffColorGenerators
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState, newState)) {
		if (diffOptions === 'all' || diffOptions.includes(index)) {
			const newColor = fillDefaults(Defaults.Color.ColorGenerator, newState?.[index])
			const oldColor = fillDefaults(Defaults.Color.ColorGenerator, oldState?.[index])

			const props = diffObject<ColorGeneratorState>(oldColor, newColor)
			const command = new AtemCommands.ColorGeneratorCommand(index)
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}
	}

	return commands
}
