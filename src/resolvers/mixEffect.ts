import {
	Commands as AtemCommands,
	Enums as ConnectionEnums,
	AtemStateUtil
} from 'atem-connection'
import { Enums, State as StateObject, Defaults } from '../'
import { getAllKeysNumber, diffObject } from '../util'
import { MixEffect } from '../state'
import * as _ from 'underscore'

import { resolveUpstreamKeyerState } from './upstreamKeyers'

export function resolveMixEffectsState (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const mixEffectId of getAllKeysNumber(oldState.video.mixEffects, newState.video.mixEffects)) {
		const oldMixEffect: MixEffect = AtemStateUtil.getMixEffect(oldState, mixEffectId, true)
		const newMixEffect: MixEffect = AtemStateUtil.getMixEffect(newState, mixEffectId, true)

		commands.push(...resolveTransitionPropertiesState(mixEffectId, oldMixEffect, newMixEffect))
		commands.push(...resolveTransitionSettingsState(mixEffectId, oldMixEffect, newMixEffect))
		commands.push(...resolveUpstreamKeyerState(mixEffectId, oldMixEffect, newMixEffect))

		let oldMEInput = oldMixEffect.input
		if (typeof oldMEInput === 'undefined') oldMEInput = oldMixEffect.programInput

		if (typeof newMixEffect.input !== 'undefined' && typeof newMixEffect.transition !== 'undefined') {
			if (newMixEffect.input !== oldMEInput || newMixEffect.transition === Enums.TransitionStyle.DUMMY) {
				commands.push(new AtemCommands.PreviewInputCommand(mixEffectId, newMixEffect.input))

				if (newMixEffect.transition === Enums.TransitionStyle.CUT) {
					commands.push(new AtemCommands.CutCommand(mixEffectId))
				} else if (newMixEffect.transition !== Enums.TransitionStyle.DUMMY) {
					if (newMixEffect.transition !== (oldMixEffect.transition || oldMixEffect.transitionProperties.style)) { // set style before auto transition command
						const command = new AtemCommands.TransitionPropertiesCommand(mixEffectId)
						command.updateProps({ style: newMixEffect.transition as ConnectionEnums.TransitionStyle })
						commands.push(command)
					}

					commands.push(new AtemCommands.TransitionPositionCommand(mixEffectId, 0))
					commands.push(new AtemCommands.AutoTransitionCommand(mixEffectId))
				}
			}
		} else {
			if (oldMixEffect.previewInput !== newMixEffect.previewInput) {
				commands.push(new AtemCommands.PreviewInputCommand(mixEffectId, newMixEffect.previewInput))
			}
			if (oldMEInput !== newMixEffect.programInput) {
				// @todo: check if we need to use the cut command?
				// use cut command if:
				//   DSK is tied
				//   Upstream Keyer is set for next transition
				commands.push(new AtemCommands.ProgramInputCommand(mixEffectId,newMixEffect.programInput))
			}
		}

		if (newMixEffect.inTransition && oldMixEffect.transitionPosition !== newMixEffect.transitionPosition) {
			commands.push(new AtemCommands.TransitionPositionCommand(mixEffectId, newMixEffect.transitionPosition))
		}
		if (oldMixEffect.inTransition && !newMixEffect.inTransition) {
			commands.push(new AtemCommands.TransitionPositionCommand(mixEffectId, 10000)) // finish transition
		}

		if (oldMixEffect.transitionPreview !== newMixEffect.transitionPreview) {
			commands.push(new AtemCommands.PreviewTransitionCommand(mixEffectId, newMixEffect.transitionPreview))
		}

		// @todo: fadeToBlack
	}

	return commands
}

export function resolveTransitionPropertiesState (mixEffectId: number, oldMixEffect: MixEffect, newMixEffect: MixEffect): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const oldTransitionProperties = oldMixEffect.transitionProperties
	const newTransitionProperties = newMixEffect.transitionProperties

	const props = diffObject(oldTransitionProperties, newTransitionProperties)
	const command = new AtemCommands.TransitionPropertiesCommand(mixEffectId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}

export function resolveTransitionSettingsState (mixEffectId: number, oldMixEffect: MixEffect, newMixEffect: MixEffect): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const oldTransitionSettings = oldMixEffect.transitionSettings
	const newTransitionSettings = newMixEffect.transitionSettings

	if (newTransitionSettings.dip || oldTransitionSettings.dip) {
		const dipProperties = diffObject(oldTransitionSettings.dip || Defaults.Video.DipTransitionSettings, newTransitionSettings.dip || Defaults.Video.DipTransitionSettings)
		const command = new AtemCommands.TransitionDipCommand(mixEffectId)
		if (command.updateProps(dipProperties)) {
			commands.push(command)
		}
	}

	if (newTransitionSettings.DVE || oldTransitionSettings.DVE) {
		const dveProperties = diffObject(oldTransitionSettings.DVE || Defaults.Video.DVETransitionSettings, newTransitionSettings.DVE || Defaults.Video.DVETransitionSettings)
		const command = new AtemCommands.TransitionDVECommand(mixEffectId)
		if (command.updateProps(dveProperties)) {
			commands.push(command)
		}
	}

	if (newTransitionSettings.mix || oldTransitionSettings.mix) {
		const oldProps = oldTransitionSettings.mix || Defaults.Video.MixTransitionSettings
		const newProps = newTransitionSettings.mix || Defaults.Video.MixTransitionSettings
		if (oldProps.rate !== newProps.rate) {
			commands.push(new AtemCommands.TransitionMixCommand(mixEffectId, newProps.rate))
		}
	}

	if (newTransitionSettings.stinger || oldTransitionSettings.stinger) {
		const stingerProperties = diffObject(oldTransitionSettings.stinger || Defaults.Video.StingerTransitionSettings, newTransitionSettings.stinger || Defaults.Video.StingerTransitionSettings)
		const command = new AtemCommands.TransitionStingerCommand(mixEffectId)
		if (command.updateProps(stingerProperties)) {
			commands.push(command)
		}
	}

	if (newTransitionSettings.wipe || oldTransitionSettings.wipe) {
		const wipeProperties = diffObject(oldTransitionSettings.wipe || Defaults.Video.WipeTransitionSettings, newTransitionSettings.wipe || Defaults.Video.WipeTransitionSettings)
		const command = new AtemCommands.TransitionWipeCommand(mixEffectId)
		if (command.updateProps(wipeProperties)) {
			commands.push(command)
		}
	}

	return commands
}
