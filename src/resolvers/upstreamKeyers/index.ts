import { Commands as AtemCommands, VideoState, AtemStateUtil } from 'atem-connection'
import * as _ from 'underscore'

import { resolveDVEKeyerState } from './dveKeyer'
import { resolveChromaKeyerState } from './chromaKeyer'
import { resolveLumaKeyerState } from './lumaKeyer'
import { resolvePatternKeyerState } from './patternKeyer'
import { getAllKeysNumber, diffObject } from '../../util'
import { MixEffect } from '../../state'

export function resolveUpstreamKeyerState (mixEffectId: number, oldMixEffect: MixEffect, newMixEffect: MixEffect): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const upstreamKeyerId of getAllKeysNumber(oldMixEffect.upstreamKeyers, newMixEffect.upstreamKeyers)) {
		const oldKeyer = AtemStateUtil.getUpstreamKeyer(oldMixEffect as VideoState.MixEffect, upstreamKeyerId, true)
		const newKeyer = AtemStateUtil.getUpstreamKeyer(newMixEffect as VideoState.MixEffect, upstreamKeyerId, true)

		commands.push(...resolveUpstreamKeyerMaskState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))
		commands.push(...resolveDVEKeyerState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))
		commands.push(...resolveChromaKeyerState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))
		commands.push(...resolveLumaKeyerState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))
		commands.push(...resolvePatternKeyerState(mixEffectId, upstreamKeyerId, oldKeyer, newKeyer))

		if (oldKeyer.fillSource !== newKeyer.fillSource) {
			commands.push(new AtemCommands.MixEffectKeyFillSourceSetCommand(mixEffectId, upstreamKeyerId, newKeyer.fillSource))
		}
		if (oldKeyer.cutSource !== newKeyer.cutSource) {
			commands.push(new AtemCommands.MixEffectKeyCutSourceSetCommand(mixEffectId, upstreamKeyerId, newKeyer.cutSource))
		}

		const typeProps = diffObject(oldKeyer, newKeyer)
		const command = new AtemCommands.MixEffectKeyTypeSetCommand(mixEffectId, upstreamKeyerId)
		if (command.updateProps(typeProps)) {
			commands.push(command)
		}

		if (oldKeyer.onAir !== newKeyer.onAir) {
			commands.push(new AtemCommands.MixEffectKeyOnAirCommand(mixEffectId, upstreamKeyerId, newKeyer.onAir))
		}
	}

	return commands
}

export function resolveUpstreamKeyerMaskState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: VideoState.USK.UpstreamKeyer, newKeyer: VideoState.USK.UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const props = diffObject<VideoState.USK.UpstreamKeyerMaskSettings>(oldKeyer.maskSettings, newKeyer.maskSettings)

	const command = new AtemCommands.MixEffectKeyMaskSetCommand(mixEffectId, upstreamKeyerId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}
