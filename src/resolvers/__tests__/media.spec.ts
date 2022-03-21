import * as media from '../media'
import { Commands, Enums, MediaState, AtemStateUtil } from 'atem-connection'
import { jsonClone } from '../../util'

const STATE1 = AtemStateUtil.Create()
;(STATE1.media.players as MediaState.MediaPlayerState[]) = [
	{
		playing: false,
		loop: false,
		atBeginning: false,
		clipFrame: 0,
		sourceType: Enums.MediaSourceType.Clip,
		stillIndex: 0,
		clipIndex: 0,
	},
	{
		playing: true,
		loop: false,
		atBeginning: false,
		clipFrame: 0,
		sourceType: Enums.MediaSourceType.Clip,
		stillIndex: 0,
		clipIndex: 0,
	},
]
const STATE2 = AtemStateUtil.Create()
;(STATE2.media.players as MediaState.MediaPlayerState[]) = [
	{
		playing: true,
		loop: false,
		atBeginning: false,
		clipFrame: 25,
		sourceType: Enums.MediaSourceType.Clip,
		stillIndex: 0,
		clipIndex: 0,
	},
	{
		playing: false,
		loop: true,
		atBeginning: true,
		clipFrame: 0,
		sourceType: Enums.MediaSourceType.Clip,
		stillIndex: 0,
		clipIndex: 0,
	},
]

test('Unit: media player: same state gives no commands', function () {
	// same state gives no commands:
	const commands = media.resolveMediaPlayerState(STATE1, STATE1)
	expect(commands).toHaveLength(0)
})

test('Unit: media player: status command', function () {
	const commands = media.resolveMediaPlayerState(STATE1, STATE2) as Array<Commands.MediaPlayerStatusCommand>

	expect(commands[0].constructor.name).toEqual('MediaPlayerStatusCommand')
	expect(commands[0].mediaPlayerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		playing: true,
		clipFrame: 25,
	})

	expect(commands[1].constructor.name).toEqual('MediaPlayerStatusCommand')
	expect(commands[1].mediaPlayerId).toEqual(1)
	expect(commands[1].properties).toEqual({
		playing: false,
		loop: true,
		atBeginning: true,
	})
})

test('Unit: media player: select clip and play', function () {
	const state1b = jsonClone(STATE1)
	if (state1b.media.players[0]) {
		state1b.media.players[0].clipIndex = 1
		state1b.media.players[0].playing = true
		state1b.media.players[0].loop = true
	}

	const commands = media.resolveMediaPlayerState(STATE1, state1b) as Array<Commands.MediaPlayerStatusCommand>

	expect(commands[0].constructor.name).toEqual('MediaPlayerSourceCommand')
	expect(commands[0].mediaPlayerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		clipIndex: 1,
	})

	expect(commands[1].constructor.name).toEqual('MediaPlayerStatusCommand')
	expect(commands[1].mediaPlayerId).toEqual(0)
	expect(commands[1].properties).toEqual({
		playing: true,
		loop: true,
	})
})
