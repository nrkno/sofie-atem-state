import { Commands as AtemCommands } from 'atem-connection'
import AbstractCommand from 'atem-connection/dist/commands/AbstractCommand' // @todo: should come from main exports
import { State as StateObject } from '../../'

export function resolveUpstreamKeyerState (oldState: StateObject, newState: StateObject): Array<AbstractCommand> {
	let commands: Array<AbstractCommand> = []

	for (const mixEffectId in oldState.video.ME) {
		for (const upstreamKeyerId in oldState.video.ME[mixEffectId].upstreamKeyers) {
			const oldKeyer = oldState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]
			const newKeyer = newState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]

			if (oldKeyer.fillSource !== newKeyer.fillSource) {
				const command = new AtemCommands.MixEffectKeyFillSourceSetCommand()
				command.upstreamKeyerId = Number(upstreamKeyerId)
				command.mixEffect = Number(mixEffectId)
				command.updateProps({
					fillSource: newKeyer.fillSource
				})
				commands.push(command)
			}
			if (oldKeyer.cutSource !== newKeyer.cutSource) {
				const command = new AtemCommands.MixEffectKeyCutSourceSetCommand()
				command.upstreamKeyerId = Number(upstreamKeyerId)
				command.mixEffect = Number(mixEffectId)
				command.updateProps({
					cutSource: newKeyer.cutSource
				})
				commands.push(command)
			}

			if (oldKeyer.mixEffectKeyType !== newKeyer.mixEffectKeyType || oldKeyer.flyEnabled !== newKeyer.flyEnabled) {
				const command = new AtemCommands.MixEffectKeyTypeSetCommand()
				command.upstreamKeyerId = Number(upstreamKeyerId)
				command.mixEffect = Number(mixEffectId)
				if (oldKeyer.mixEffectKeyType !== newKeyer.mixEffectKeyType) command.updateProps({ keyType: newKeyer.mixEffectKeyType })
				if (oldKeyer.flyEnabled !== newKeyer.flyEnabled) command.updateProps({ flyEnabled: newKeyer.flyEnabled })
				commands.push(command)
			}

			if (oldKeyer.onAir !== newKeyer.onAir) {
				const command = new AtemCommands.MixEffectKeyOnAirCommand()
				command.upstreamKeyerId = Number(upstreamKeyerId)
				command.mixEffect = Number(mixEffectId)
				command.updateProps({
					onAir: newKeyer.onAir
				})
				commands.push(command)
			}
		}
	}

	return commands
}
