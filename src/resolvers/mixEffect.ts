import { Commands as AtemCommands, Enums as ConnectionEnums, VideoState } from 'atem-connection'
import { State as StateObject } from '../state'
import * as Defaults from '../defaults'
import * as Enums from '../enums'
import { getAllKeysNumber, diffObject, fillDefaults } from '../util'
import { ExtendedMixEffect } from '../state'

import { resolveUpstreamKeyerState } from './upstreamKeyers'
import { PartialDeep } from 'type-fest'

export function resolveMixEffectsState(
	oldState: PartialDeep<StateObject>,
	newState: PartialDeep<StateObject>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const mixEffectId of getAllKeysNumber(oldState.video?.mixEffects, newState.video?.mixEffects)) {
		const oldMixEffect = oldState.video?.mixEffects?.[mixEffectId]
		const newMixEffect = newState.video?.mixEffects?.[mixEffectId]

		commands.push(...resolveTransitionPropertiesState(mixEffectId, oldMixEffect, newMixEffect))
		commands.push(...resolveTransitionSettingsState(mixEffectId, oldMixEffect, newMixEffect))
		commands.push(...resolveUpstreamKeyerState(mixEffectId, oldMixEffect, newMixEffect))

		let oldMEInput = Defaults.Video.defaultInput
		let oldMeTransition: Enums.TransitionStyle = Defaults.Video.TransitionProperties.style
		if (oldMixEffect) {
			const oldMixEffectExt = oldMixEffect as ExtendedMixEffect
			if ('input' in oldMixEffectExt || 'transition' in oldMixEffectExt) {
				oldMEInput = oldMixEffectExt.input ?? oldMEInput
				oldMeTransition = oldMixEffectExt.transition ?? oldMeTransition
			} else {
				oldMeTransition = oldMixEffect.transitionProperties?.style ?? oldMeTransition
				if ('programInput' in oldMixEffect) {
					oldMEInput = oldMixEffect.programInput ?? oldMEInput
				}
			}
		}

		if (newMixEffect && 'input' in newMixEffect && 'transition' in newMixEffect) {
			if (newMixEffect.input !== oldMEInput || newMixEffect.transition === Enums.TransitionStyle.DUMMY) {
				commands.push(
					new AtemCommands.PreviewInputCommand(mixEffectId, newMixEffect.input ?? Defaults.Video.defaultInput)
				)

				if (newMixEffect.transition === Enums.TransitionStyle.CUT) {
					commands.push(new AtemCommands.CutCommand(mixEffectId))
				} else if (newMixEffect.transition !== Enums.TransitionStyle.DUMMY) {
					if (newMixEffect.transition !== oldMeTransition) {
						// set style before auto transition command
						const command = new AtemCommands.TransitionPropertiesCommand(mixEffectId)
						command.updateProps({
							nextStyle: newMixEffect.transition as ConnectionEnums.TransitionStyle,
						})
						commands.push(command)
					}

					commands.push(new AtemCommands.TransitionPositionCommand(mixEffectId, 0))
					commands.push(new AtemCommands.AutoTransitionCommand(mixEffectId))
				}
			}
		} else if ((!oldMixEffect || 'previewInput' in oldMixEffect) && (!newMixEffect || 'previewInput' in newMixEffect)) {
			const oldMePreviewInput = oldMixEffect?.previewInput ?? Defaults.Video.defaultInput
			const newMePreviewInput = newMixEffect?.previewInput ?? Defaults.Video.defaultInput
			if (oldMePreviewInput !== newMePreviewInput) {
				commands.push(new AtemCommands.PreviewInputCommand(mixEffectId, newMePreviewInput))
			}
			const newMeProgramInput = newMixEffect?.programInput ?? Defaults.Video.defaultInput
			if (oldMEInput !== newMeProgramInput) {
				// @todo: check if we need to use the cut command?
				// use cut command if:
				//   DSK is tied
				//   Upstream Keyer is set for next transition
				commands.push(new AtemCommands.ProgramInputCommand(mixEffectId, newMeProgramInput))
			}
		}

		if (
			newMixEffect?.transitionPosition?.inTransition &&
			oldMixEffect?.transitionPosition?.handlePosition !== newMixEffect.transitionPosition.handlePosition
		) {
			commands.push(
				new AtemCommands.TransitionPositionCommand(mixEffectId, newMixEffect?.transitionPosition?.handlePosition ?? 0)
			)
		}
		if (oldMixEffect?.transitionPosition?.inTransition && !newMixEffect?.transitionPosition?.inTransition) {
			commands.push(new AtemCommands.TransitionPositionCommand(mixEffectId, 10000)) // finish transition
		}

		if ((oldMixEffect?.transitionPreview ?? false) !== (newMixEffect?.transitionPreview ?? false)) {
			commands.push(new AtemCommands.PreviewTransitionCommand(mixEffectId, newMixEffect?.transitionPreview ?? false))
		}

		// @todo: fadeToBlack
	}

	return commands
}

export function resolveTransitionPropertiesState(
	mixEffectId: number,
	oldMixEffect: PartialDeep<VideoState.MixEffect> | PartialDeep<ExtendedMixEffect> | undefined,
	newMixEffect: PartialDeep<VideoState.MixEffect> | PartialDeep<ExtendedMixEffect> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const oldTransitionProperties = fillDefaults(Defaults.Video.TransitionProperties, oldMixEffect?.transitionProperties)
	const newTransitionProperties = fillDefaults(Defaults.Video.TransitionProperties, newMixEffect?.transitionProperties)

	const props = diffObject(oldTransitionProperties, newTransitionProperties)
	const command = new AtemCommands.TransitionPropertiesCommand(mixEffectId)
	if (command.updateProps(props)) {
		commands.push(command)
	}

	return commands
}

export function resolveTransitionSettingsState(
	mixEffectId: number,
	oldMixEffect: PartialDeep<VideoState.MixEffect> | PartialDeep<ExtendedMixEffect> | undefined,
	newMixEffect: PartialDeep<VideoState.MixEffect> | PartialDeep<ExtendedMixEffect> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	const oldTransitionSettings = oldMixEffect?.transitionSettings
	const newTransitionSettings = newMixEffect?.transitionSettings

	if (newTransitionSettings?.dip || oldTransitionSettings?.dip) {
		const dipProperties = diffObject(
			fillDefaults(Defaults.Video.DipTransitionSettings, oldTransitionSettings?.dip),
			fillDefaults(Defaults.Video.DipTransitionSettings, newTransitionSettings?.dip)
		)
		const command = new AtemCommands.TransitionDipCommand(mixEffectId)
		if (command.updateProps(dipProperties)) {
			commands.push(command)
		}
	}

	if (newTransitionSettings?.DVE || oldTransitionSettings?.DVE) {
		const dveProperties = diffObject(
			fillDefaults(Defaults.Video.DVETransitionSettings, oldTransitionSettings?.DVE),
			fillDefaults(Defaults.Video.DVETransitionSettings, newTransitionSettings?.DVE)
		)
		const command = new AtemCommands.TransitionDVECommand(mixEffectId)
		if (command.updateProps(dveProperties)) {
			commands.push(command)
		}
	}

	if (newTransitionSettings?.mix || oldTransitionSettings?.mix) {
		const oldProps = fillDefaults(Defaults.Video.MixTransitionSettings, oldTransitionSettings?.mix)
		const newProps = fillDefaults(Defaults.Video.MixTransitionSettings, newTransitionSettings?.mix)
		if (oldProps.rate !== newProps.rate) {
			commands.push(new AtemCommands.TransitionMixCommand(mixEffectId, newProps.rate))
		}
	}

	if (newTransitionSettings?.stinger || oldTransitionSettings?.stinger) {
		const stingerProperties = diffObject(
			fillDefaults(Defaults.Video.StingerTransitionSettings, oldTransitionSettings?.stinger),
			fillDefaults(Defaults.Video.StingerTransitionSettings, newTransitionSettings?.stinger)
		)
		const command = new AtemCommands.TransitionStingerCommand(mixEffectId)
		if (command.updateProps(stingerProperties)) {
			commands.push(command)
		}
	}

	if (newTransitionSettings?.wipe || oldTransitionSettings?.wipe) {
		const wipeProperties = diffObject(
			fillDefaults(Defaults.Video.WipeTransitionSettings, oldTransitionSettings?.wipe),
			fillDefaults(Defaults.Video.WipeTransitionSettings, newTransitionSettings?.wipe)
		)
		const command = new AtemCommands.TransitionWipeCommand(mixEffectId)
		if (command.updateProps(wipeProperties)) {
			commands.push(command)
		}
	}

	return commands
}
