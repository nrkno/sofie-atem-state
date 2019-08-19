import { Commands as AtemCommands } from 'atem-connection'
import { State as StateObject } from '../../'
import { UpstreamKeyerChromaSettings } from 'atem-connection/dist/state/video/upstreamKeyers'

export function resolveChromaKeyerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	for (const mixEffectId in oldState.video.ME) {
		if (!newState.video.ME[mixEffectId]) continue
		for (const upstreamKeyerId in oldState.video.ME[mixEffectId].upstreamKeyers) {
			const oldKeyer = oldState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]
			const newKeyer = newState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]
			if (!oldKeyer || !newKeyer) {
				continue
			}

			const oldChromaKeyer = oldKeyer.chromaSettings
			const newChromaKeyer = newKeyer.chromaSettings
			if (!oldChromaKeyer || !newChromaKeyer) {
				continue
			}

			const props: Partial<UpstreamKeyerChromaSettings> = {}

			for (const key in AtemCommands.MixEffectKeyChromaCommand.MaskFlags) {
				const typedKey = key as keyof UpstreamKeyerChromaSettings
				if (oldChromaKeyer[typedKey] !== newChromaKeyer[typedKey]) {
					props[typedKey] = newChromaKeyer[typedKey] as any
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
