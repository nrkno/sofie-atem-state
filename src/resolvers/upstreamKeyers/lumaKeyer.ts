import { Commands as AtemCommands } from 'atem-connection'
import { State as StateObject } from '../../'
import { UpstreamKeyerLumaSettings } from 'atem-connection/dist/state/video/upstreamKeyers'

export function resolveLumaKeyerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	for (const mixEffectId in oldState.video.ME) {
		for (const upstreamKeyerId in oldState.video.ME[mixEffectId].upstreamKeyers) {
			const oldLumaKeyer = oldState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId].lumaSettings
			const newLumaKeyer = newState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId].lumaSettings
			const props: Partial<UpstreamKeyerLumaSettings> = {}

			for (const key in AtemCommands.MixEffectKeyLumaCommand.MaskFlags) {
				if ((oldLumaKeyer as any)[key] !== (newLumaKeyer as any)[key]) {
					(props as any)[key] = (newLumaKeyer as any)[key]
				}
			}

			if (Object.keys(props).length > 0) {
				const command = new AtemCommands.MixEffectKeyLumaCommand()
				command.upstreamKeyerId = Number(upstreamKeyerId)
				command.mixEffect = Number(mixEffectId)
				command.updateProps(props)
				commands.push(command)
			}
		}
	}

	return commands
}
