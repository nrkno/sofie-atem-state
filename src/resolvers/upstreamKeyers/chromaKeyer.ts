import { Commands as AtemCommands } from 'atem-connection'
import AbstractCommand from 'atem-connection/dist/commands/AbstractCommand' // @todo: should come from main exports
import { State as StateObject } from '../../'
import { UpstreamKeyerChromaSettings } from 'atem-connection/dist/state/video/upstreamKeyers'

export function resolveChromaKeyerState (oldState: StateObject, newState: StateObject): Array<AbstractCommand> {
	let commands: Array<AbstractCommand> = []

	for (const mixEffectId in oldState.video.ME) {
		for (const upstreamKeyerId in oldState.video.ME[mixEffectId].upstreamKeyers) {
			const oldChromaKeyer = oldState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId].chromaSettings
			const newChromaKeyer = newState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId].chromaSettings
			const props: Partial<UpstreamKeyerChromaSettings> = {}

			for (const key in AtemCommands.MixEffectKeyChromaCommand.MaskFlags) {
				if ((oldChromaKeyer as any)[key] !== (newChromaKeyer as any)[key]) {
					(props as any)[key] = (newChromaKeyer as any)[key]
				}
			}

			if (Object.keys(props).length > 0) {
				const command = new AtemCommands.MixEffectKeyChromaCommand()
				command.upstreamKeyerId = Number(upstreamKeyerId)
				command.mixEffect = Number(mixEffectId)
				command.updateProps(props)
				commands.push(command)
			}
		}
	}

	return commands
}
