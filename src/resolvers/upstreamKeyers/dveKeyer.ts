import { Commands as AtemCommands } from 'atem-connection'
import AbstractCommand from 'atem-connection/dist/commands/AbstractCommand' // @todo: should come from main exports
import { State as StateObject } from '../../'
import { UpstreamKeyerDVESettings } from 'atem-connection/dist/state/video/upstreamKeyers'

export function resolveDVEKeyerState (oldState: StateObject, newState: StateObject): Array<AbstractCommand> {
	let commands: Array<AbstractCommand> = []

	for (const mixEffectId in oldState.video.ME) {
		for (const upstreamKeyerId in oldState.video.ME[mixEffectId].upstreamKeyers) {
			const oldDVEKeyer = oldState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId].dveSettings
			const newDVEKeyer = newState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId].dveSettings
			const props: Partial<UpstreamKeyerDVESettings> = {}

			for (const key in AtemCommands.MixEffectKeyDVECommand.MaskFlags) {
				if ((oldDVEKeyer as any)[key] !== (newDVEKeyer as any)[key]) {
					(props as any)[key] = (newDVEKeyer as any)[key]
				}
			}

			if (Object.keys(props).length > 0) {
				const command = new AtemCommands.MixEffectKeyDVECommand()
				command.upstreamKeyerId = Number(upstreamKeyerId)
				command.mixEffect = Number(mixEffectId)
				command.updateProps(props)
				commands.push(command)
			}
		}
	}

	return commands
}
