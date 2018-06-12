import { Commands as AtemCommands } from 'atem-connection'
import { State as StateObject } from '../../'
import { UpstreamKeyerMaskSettings } from 'atem-connection/dist/state/video/upstreamKeyers'

import { resolveDVEKeyerState } from './dveKeyer'
import { resolveChromaKeyerState } from './chromaKeyer'
import { resolveLumaKeyerState } from './lumaKeyer'
import { resolvePatternKeyerState } from './patternKeyer'

export function resolveUpstreamKeyerState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	commands = commands.concat(resolveUpstreamKeyerMaskState(oldState, newState))
	commands = commands.concat(resolveDVEKeyerState(newState, oldState))
	commands = commands.concat(resolveChromaKeyerState(newState, oldState))
	commands = commands.concat(resolveLumaKeyerState(newState, oldState))
	commands = commands.concat(resolvePatternKeyerState(newState, oldState))

	for (const mixEffectId in oldState.video.ME) {
		for (const upstreamKeyerId in oldState.video.ME[mixEffectId].upstreamKeyers) {
			const oldKeyer = oldState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]
			const newKeyer = newState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]

			if (!oldKeyer || !newKeyer) {
				continue
			}

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

export function resolveUpstreamKeyerMaskState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	for (const mixEffectId in oldState.video.ME) {
		for (const upstreamKeyerId in oldState.video.ME[mixEffectId].upstreamKeyers) {
			const oldKeyer = oldState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]
			const newKeyer = newState.video.ME[mixEffectId].upstreamKeyers[upstreamKeyerId]

			if (!oldKeyer || !newKeyer) {
				continue
			}

			const props: Partial<UpstreamKeyerMaskSettings> = {}
			if (oldKeyer.maskEnabled !== newKeyer.maskEnabled) props.maskEnabled = newKeyer.maskEnabled
			if (oldKeyer.maskLeft !== newKeyer.maskLeft) props.maskLeft = newKeyer.maskLeft
			if (oldKeyer.maskRight !== newKeyer.maskRight) props.maskRight = newKeyer.maskRight
			if (oldKeyer.maskTop !== newKeyer.maskTop) props.maskTop = newKeyer.maskTop
			if (oldKeyer.maskBottom !== newKeyer.maskBottom) props.maskBottom = newKeyer.maskBottom

			if (Object.keys(props).length > 0) {
				const command = new AtemCommands.MixEffectKeyMaskSetCommand()
				command.upstreamKeyerId = Number(upstreamKeyerId)
				command.mixEffect = Number(mixEffectId)
				command.updateProps(props)
				commands.push(command)
			}
		}
	}

	return commands
}
