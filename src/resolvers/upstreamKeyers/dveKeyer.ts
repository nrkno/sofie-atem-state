import { Commands as AtemCommands } from 'atem-connection'
import { State as StateObject } from '../../'
import { UpstreamKeyerDVESettings } from 'atem-connection/dist/state/video/upstreamKeyers'

export function resolveDVEKeyerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	for (const mixEffectId in oldState.video.ME) {
		if (!newState.video.ME[mixEffectId]) continue
		for (const upstreamKeyerId in oldState.video.ME[mixEffectId].upstreamKeyers) {
			const oldKeyer = oldState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]
			const newKeyer = newState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]
			if (!oldKeyer || !newKeyer) {
				continue
			}

			const oldDVEKeyer = oldKeyer.dveSettings
			const newDVEKeyer = newKeyer.dveSettings
			if (!oldDVEKeyer || !newDVEKeyer) {
				continue
			}

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
