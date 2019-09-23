import {
	Commands as AtemCommands
} from 'atem-connection'
import { State as StateObject } from '../'
import { DownstreamKeyerProperties, DownstreamKeyerMask } from 'atem-connection/dist/state/video/downstreamKeyers'

export function resolveDownstreamKeyerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	commands = commands.concat(resolveDownstreamKeyerMaskState(oldState, newState))
	commands = commands.concat(resolveDownstreamKeyerPropertiesState(oldState, newState))

	for (const index in newState.video.downstreamKeyers) {
		const oldDsk = oldState.video.downstreamKeyers[index]
		const newDsk = newState.video.downstreamKeyers[index]

		if (oldDsk.sources.fillSource !== newDsk.sources.fillSource) {
			const command = new AtemCommands.DownstreamKeyFillSourceCommand()
			command.downstreamKeyerId = Number(index)
			command.updateProps({ input: newDsk.sources.fillSource })
			commands.push(command)
		}
		if (oldDsk.sources.cutSource !== newDsk.sources.cutSource) {
			const command = new AtemCommands.DownstreamKeyCutSourceCommand()
			command.downstreamKeyerId = Number(index)
			command.updateProps({ input: newDsk.sources.cutSource })
			commands.push(command)
		}

		if (!oldDsk.isAuto && newDsk.isAuto) {
			const command = new AtemCommands.DownstreamKeyAutoCommand()
			command.downstreamKeyerId = Number(index)
			commands.push(command)
		} else if (oldDsk.onAir !== newDsk.onAir) {
			const command = new AtemCommands.DownstreamKeyOnAirCommand()
			command.downstreamKeyerId = Number(index)
			command.properties = { onAir: newDsk.onAir }
			commands.push(command)
		}
	}

	return commands
}

export function resolveDownstreamKeyerPropertiesState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const index in newState.video.downstreamKeyers) {
		const oldProps = oldState.video.downstreamKeyers[index].properties
		const newProps = newState.video.downstreamKeyers[index].properties
		const dskIndex = Number(index)
		const props: Partial<DownstreamKeyerProperties> = {}

		if (oldProps.clip !== newProps.clip) {
			props.clip = newProps.clip
		}
		if (oldProps.gain !== newProps.gain) {
			props.gain = newProps.gain
		}
		if (oldProps.invert !== newProps.invert) {
			props.invert = newProps.invert
		}
		if (oldProps.preMultiply !== newProps.preMultiply) {
			props.preMultiply = newProps.preMultiply
		}

		if (Object.keys(props).length > 0) {
			const command = new AtemCommands.DownstreamKeyGeneralCommand()
			command.downstreamKeyerId = dskIndex
			command.updateProps(props)
			commands.push(command)
		}

		if (oldProps.rate !== newProps.rate) {
			const command = new AtemCommands.DownstreamKeyRateCommand()
			command.downstreamKeyerId = dskIndex
			command.updateProps({ rate: newProps.rate })
			commands.push(command)
		}

		if (oldProps.tie !== newProps.tie) {
			const command = new AtemCommands.DownstreamKeyTieCommand()
			command.downstreamKeyerId = dskIndex
			command.updateProps({ tie: newProps.tie })
			commands.push(command)
		}
	}

	return commands
}

export function resolveDownstreamKeyerMaskState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const index in newState.video.downstreamKeyers) {
		const oldProps = oldState.video.downstreamKeyers[index].properties.mask
		const newProps = newState.video.downstreamKeyers[index].properties.mask
		const dskIndex = Number(index)
		const props: Partial<DownstreamKeyerMask> = {}

		for (let key in newProps) {
			const typedKey = key as keyof DownstreamKeyerMask
			if (newProps[typedKey] !== oldProps[typedKey]) {
				props[typedKey] = newProps[typedKey] as any
			}
		}

		if (Object.keys(props).length > 0) {
			const command = new AtemCommands.DownstreamKeyMaskCommand()
			command.downstreamKeyerId = dskIndex
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}
