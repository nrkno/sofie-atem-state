import { Commands as AtemCommands } from 'atem-connection'
import { getAllKeysNumber } from '../util'
import * as Defaults from '../defaults'
import { DiffAuxiliaries } from '../diff'

export function resolveAuxiliaries(
	oldState: Array<number | undefined> | undefined,
	newState: Array<number | undefined> | undefined,
	options: DiffAuxiliaries
): Array<AtemCommands.AuxSourceCommand> {
	const commands: Array<AtemCommands.AuxSourceCommand> = []

	// resolve auxilliaries:
	for (const index of getAllKeysNumber(oldState, newState)) {
		if (options === 'all' || options.includes(index)) {
			const oldSource = oldState?.[index] ?? Defaults.Video.defaultInput
			const newSource = newState?.[index] ?? Defaults.Video.defaultInput

			if (oldSource !== newSource) {
				commands.push(new AtemCommands.AuxSourceCommand(index, newSource))
			}
		}
	}

	return commands
}
