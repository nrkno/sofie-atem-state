import * as media from '../media'
import { State as StateObject } from '../../'
import { Commands } from 'atem-connection'

const STATE1 = {
	media: {
		players: [
			{
				playing: false,
				loop: false,
				atBeginning: false,
				clipFrame: 0
			},
			{
				playing: true,
				loop: false,
				atBeginning: false,
				clipFrame: 0
			}
		]
	}
}
const STATE2 = {
	media: {
		players: [
			{
				playing: true,
				loop: false,
				atBeginning: false,
				clipFrame: 25
			},
			{
				playing: false,
				loop: true,
				atBeginning: true,
				clipFrame: 0
			}
		]
	}
}

test('Unit: media player: same state gives no commands', function () {
	// same state gives no commands:
	const commands = media.resolveMediaPlayerState(STATE1 as StateObject, STATE1 as StateObject)
	expect(commands.length).toEqual(0)
})

test('Unit: media player: status command', function () {
	const commands = media.resolveMediaPlayerState(STATE1 as StateObject, STATE2 as StateObject) as Array<Commands.MediaPlayerStatusCommand>

	expect(commands[0].rawName).toEqual('SCPS')
	expect(commands[0].mediaPlayerId).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		playing: true,
		clipFrame: 25
	})

	expect(commands[1].rawName).toEqual('SCPS')
	expect(commands[1].mediaPlayerId).toEqual(1)
	expect(commands[1].properties).toMatchObject({
		playing: false,
		loop: true,
		atBeginning: true
	})
})
