import { State as StateObject } from '../../'
import * as audio from '../audio'
import { AudioChannel } from 'atem-connection/dist/state/audio'
import { AudioMixerInputCommand } from 'atem-connection/dist/commands'

function literal<T> (o: T) { return o }

const STATE1 = new StateObject()
STATE1.audio.channels = [
	literal<AudioChannel>({
		sourceType: 0,
		portType: 1,
		mixOption: 0,
		gain: 0,
		balance: 0
	}),
	literal<AudioChannel>({
		sourceType: 0,
		portType: 1,
		mixOption: 0,
		gain: 0,
		balance: 0
	})
]
const STATE2 = new StateObject()
STATE2.audio.channels = JSON.parse(JSON.stringify(STATE1.audio.channels))

test('Unit: audio: same state gives no commands', function () {
	// same state gives no commands:
	const commands = audio.resolveAudioState(STATE1 as unknown as StateObject, STATE1 as unknown as StateObject)
	expect(commands.length).toEqual(0)
})

test('Unit: audio: channel command', function () {
	STATE2.audio.channels[0].gain = -192

	const commands = audio.resolveAudioState(STATE1 as unknown as StateObject, STATE2 as unknown as StateObject) as Array<AudioMixerInputCommand>
	expect(commands.length).toEqual(1)
	expect(commands[0].rawName).toEqual('AMIP')
	expect(commands[0].index).toEqual(0)
	expect(commands[0].properties).toMatchObject({ gain: -192 })
	expect(commands[0].flag).toEqual(2) // 010

	STATE2.audio.channels[0].gain = 0
})

test('Unit: audio: new channel', function () {
	const c = STATE1.audio.channels[1]
	delete STATE1.audio.channels[1]

	const commands = audio.resolveAudioState(STATE1 as unknown as StateObject, STATE2 as unknown as StateObject) as Array<AudioMixerInputCommand>
	expect(commands.length).toEqual(1)
	expect(commands[0].rawName).toEqual('AMIP')
	expect(commands[0].index).toEqual(1)
	expect(commands[0].properties).toMatchObject({ ...STATE2.audio.channels[1] })
	expect(commands[0].flag).toEqual(7) // 111

	STATE1.audio.channels[1] = c
})
