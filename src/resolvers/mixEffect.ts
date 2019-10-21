import {
	Commands as AtemCommands,
	Enums as ConnectionEnums
} from 'atem-connection'
import { Enums, State as StateObject } from '../'
import { diffObject, getAllKeysNumber } from '../util'
import { MixEffect } from '../state'

import { resolveUpstreamKeyerState } from './upstreamKeyers'
import { TransitionProperties } from 'atem-connection/dist/state/video'

export function resolveMixEffectsState (oldState: StateObject, newState: StateObject): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const mixEffectId of getAllKeysNumber(oldState.video.ME, newState.video.ME)) {
		const oldMixEffect: MixEffect = oldState.video.getMe(mixEffectId, true)
		const newMixEffect: MixEffect = newState.video.getMe(mixEffectId, true)

		commands.push(...resolveTransitionPropertiesState(mixEffectId, oldMixEffect, newMixEffect))
		commands.push(...resolveTransitionSettingsState(mixEffectId, oldMixEffect, newMixEffect))
		commands.push(...resolveUpstreamKeyerState(mixEffectId, oldMixEffect, newMixEffect))

		if (typeof newMixEffect.input !== 'undefined' && typeof newMixEffect.transition !== 'undefined') {
			if (typeof oldMixEffect.input === 'undefined') {
				oldMixEffect.input = oldMixEffect.programInput
			}
			if (newMixEffect.input !== oldMixEffect.input || newMixEffect.transition === Enums.TransitionStyle.DUMMY) {
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
			if ((oldMixEffect.input || oldMixEffect.programInput) !== newMixEffect.programInput) {
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

	const props = diffObject<Pick<TransitionProperties, 'selection' | 'style'>>(oldTransitionProperties, newTransitionProperties)
	if (props) {
		const command = new AtemCommands.TransitionPropertiesCommand(mixEffectId)
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}

export function resolveTransitionSettingsState (mixEffectId: number, oldMixEffect: MixEffect, newMixEffect: MixEffect): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const oldTransitionSettings = oldMixEffect.transitionSettings
	const newTransitionSettings = newMixEffect.transitionSettings

	if (newTransitionSettings.dip) {
		const dipProperties = diffObject(oldTransitionSettings.dip, newTransitionSettings.dip)
		if (dipProperties) {
			const command = new AtemCommands.TransitionDipCommand(mixEffectId)
			command.updateProps(dipProperties)
			commands.push(command)
		}
	}

	if (newTransitionSettings.DVE) {
		const dveProperties = diffObject(oldTransitionSettings.DVE, newTransitionSettings.DVE)
		if (dveProperties) {
			const command = new AtemCommands.TransitionDVECommand(mixEffectId)
			command.updateProps(dveProperties)
			commands.push(command)
		}
	}

	if (newTransitionSettings.mix) {
		const mixProperties = diffObject(oldTransitionSettings.mix, newTransitionSettings.mix)
		if (mixProperties) {
			const command = new AtemCommands.TransitionMixCommand(mixEffectId)
			command.updateProps(mixProperties)
			commands.push(command)
		}
	}

	if (newTransitionSettings.stinger) {
		const stingerProperties = diffObject(oldTransitionSettings.stinger, newTransitionSettings.stinger)
		if (stingerProperties) {
			const command = new AtemCommands.TransitionStingerCommand(mixEffectId)
			command.updateProps(stingerProperties)
			commands.push(command)
		}
	}

	if (newTransitionSettings.wipe) {
		const wipeProperties = diffObject(oldTransitionSettings.wipe, newTransitionSettings.wipe)
		if (wipeProperties) {
			const command = new AtemCommands.TransitionWipeCommand(mixEffectId)
			command.updateProps(wipeProperties)
			commands.push(command)
		}
	}

	return commands
}
