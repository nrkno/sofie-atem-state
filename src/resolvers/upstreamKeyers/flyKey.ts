import { Commands as AtemCommands, VideoState } from 'atem-connection'
import { diffObject, fillDefaults, getAllKeysNumber } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

type FlyFrmaesState = [
	VideoState.USK.UpstreamKeyerFlyKeyframe | undefined,
	VideoState.USK.UpstreamKeyerFlyKeyframe | undefined
]

export function resolveFlyKeyerFramesState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<FlyFrmaesState>,
	newState: PartialDeep<FlyFrmaesState>,
	diffOptions: number[] | 'all'
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState, newState)) {
		if (diffOptions === 'all' || diffOptions.includes(index)) {
			const newKeyframe = fillDefaults(Defaults.Video.flyKeyframe(index), oldState?.[index])
			const oldKeyframe = fillDefaults(Defaults.Video.flyKeyframe(index), newState?.[index])

			const props = diffObject(oldKeyframe, newKeyframe)
			const command = new AtemCommands.MixEffectKeyFlyKeyframeCommand(mixEffectId, upstreamKeyerId, index)
			if (command.updateProps(props)) {
				commands.push(command)
			}
		}
	}

	return commands
}
