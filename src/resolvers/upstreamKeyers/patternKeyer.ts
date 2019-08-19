import { Commands as AtemCommands } from 'atem-connection'
import { State as StateObject } from '../../'
import { UpstreamKeyerPatternSettings } from 'atem-connection/dist/state/video/upstreamKeyers'

export function resolvePatternKeyerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	for (const mixEffectId in oldState.video.ME) {
		if (!newState.video.ME[mixEffectId]) continue
		for (const upstreamKeyerId in oldState.video.ME[mixEffectId].upstreamKeyers) {
			const oldKeyer = oldState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]
			const newKeyer = newState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]
			if (!oldKeyer || !newKeyer) {
				continue
			}

			const oldPatternKeyer = oldKeyer.patternSettings
			const newPatternKeyer = newKeyer.patternSettings
			if (!oldPatternKeyer || !newPatternKeyer) {
				continue
			}

			const props: Partial<UpstreamKeyerPatternSettings> = {}

			for (const key in AtemCommands.MixEffectKeyPatternCommand.MaskFlags) {
				const typedKey = key as keyof UpstreamKeyerPatternSettings
				if (oldPatternKeyer[typedKey] !== newPatternKeyer[typedKey]) {
					props[typedKey] = newPatternKeyer[typedKey] as any
				}
			}

			if (oldPatternKeyer.style !== newPatternKeyer.style) {
				props.positionX = newPatternKeyer.positionX
				props.positionY = newPatternKeyer.positionY
				props.symmetry = newPatternKeyer.symmetry
			}

			if (Object.keys(props).length > 0) {
				const command = new AtemCommands.MixEffectKeyPatternCommand()
				command.upstreamKeyerId = Number(upstreamKeyerId)
				command.mixEffect = Number(mixEffectId)
				command.updateProps(props)
				commands.push(command)
			}
		}
	}

	return commands
}
