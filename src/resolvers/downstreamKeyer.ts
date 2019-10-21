import {
	Commands as AtemCommands
} from 'atem-connection'
import { State as StateObject } from '../'
import { DownstreamKeyerProperties, DownstreamKeyer, DownstreamKeyerGeneral } from 'atem-connection/dist/state/video/downstreamKeyers'
import { getAllKeysNumber, diffObject } from '../util'

export function resolveDownstreamKeyerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState.video.downstreamKeyers, newState.video.downstreamKeyers)) {
		const oldDsk = oldState.video.getDownstreamKeyer(index, true)
		const newDsk = newState.video.getDownstreamKeyer(index, true)

		commands.push(...resolveDownstreamKeyerPropertiesState(index, oldDsk, newDsk))
		commands.push(...resolveDownstreamKeyerMaskState(index, oldDsk, newDsk))

		const oldSources = oldDsk.sources || {
			fillSource: 0,
			cutSource: 0
		}
		const newSources = newDsk.sources || {
			fillSource: 0,
			cutSource: 0
		}

		if (oldSources.fillSource !== newSources.fillSource) {
			commands.push(new AtemCommands.DownstreamKeyFillSourceCommand(index, newSources.fillSource))
		}
		if (oldSources.cutSource !== newSources.cutSource) {
			commands.push(new AtemCommands.DownstreamKeyCutSourceCommand(index, newSources.cutSource))
		}

		if (!oldDsk.isAuto && newDsk.isAuto) {
			commands.push(new AtemCommands.DownstreamKeyAutoCommand(index))
		} else if (oldDsk.onAir !== newDsk.onAir) {
			commands.push(new AtemCommands.DownstreamKeyOnAirCommand(index, newDsk.onAir))
		}
	}

	return commands
}

function defaultProperties (): DownstreamKeyerProperties {
	return {
		preMultiply: false,
		clip: 0,
		gain: 0,
		invert: false,
		tie: false,
		rate: 25,
		mask: {
			enabled: false,
			top: 0,
			bottom: 0,
			left: 0,
			right: 0
		}
	}
}

export function resolveDownstreamKeyerPropertiesState (index: number, oldDsk: DownstreamKeyer, newDsk: DownstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldDsk.properties && !newDsk.properties) return commands

	const oldProps = oldDsk.properties || defaultProperties()
	const newProps = newDsk.properties || defaultProperties()

	const props = diffObject<DownstreamKeyerGeneral>(oldProps, newProps)
	if (props) {
		const command = new AtemCommands.DownstreamKeyGeneralCommand(index)
		command.updateProps(props)
		commands.push(command)
	}

	if (oldProps.rate !== newProps.rate) {
		commands.push(new AtemCommands.DownstreamKeyRateCommand(index, newProps.rate))
	}

	if (oldProps.tie !== newProps.tie) {
		commands.push(new AtemCommands.DownstreamKeyTieCommand(index, newProps.tie))
	}

	return commands
}

export function resolveDownstreamKeyerMaskState (index: number, oldDsk: DownstreamKeyer, newDsk: DownstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldDsk.properties && !newDsk.properties) return commands

	const oldProps = oldDsk.properties || defaultProperties()
	const newProps = newDsk.properties || defaultProperties()

	const props = diffObject(oldProps.mask, newProps.mask)

	if (props) {
		const command = new AtemCommands.DownstreamKeyMaskCommand(index)
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}
