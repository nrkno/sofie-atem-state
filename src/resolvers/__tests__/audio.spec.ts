import { State as StateObject } from '../../'
import * as audio from '../audio'
import { AudioChannel } from 'atem-connection/dist/state/audio'
import { AudioMixerInputCommand } from 'atem-connection/dist/commands'
import * as _ from 'underscore'
import { jsonClone } from '../../util'

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
		mixOption: 1,
		gain: 5,
		balance: 4
	})
]
const STATE2 = new StateObject()
STATE2.audio.channels = jsonClone(STATE1.audio.channels)
STATE2.audio.master = {
	gain: 0,
	balance: 0,
	followFadeToBlack: false
}

test('Unit: audio: same state gives no commands', function () {
	// same state gives no commands:
	const commands = audio.resolveAudioState(STATE1, STATE1)
	expect(commands).toHaveLength(0)
})

test('Unit: audio: channel command', function () {
	STATE2.audio.channels[0]!.gain = -192

	const commands = audio.resolveAudioState(STATE1, STATE2) as Array<AudioMixerInputCommand>
	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('AudioMixerInputCommand')
	expect(commands[0].index).toEqual(0)
	expect(commands[0].properties).toEqual({ gain: -192 })
	expect(commands[0].flag).toEqual(2) // 010

	STATE2.audio.channels[0]!.gain = 0
})

test('Unit: audio: new channel', function () {
	const c = STATE1.audio.channels[1]!
	delete STATE1.audio.channels[1]

	const commands = audio.resolveAudioState(STATE1, STATE2) as Array<AudioMixerInputCommand>
	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('AudioMixerInputCommand')
	expect(commands[0].index).toEqual(1)
	expect(commands[0].properties).toEqual(_.omit(STATE2.audio.channels[1]!, 'portType', 'sourceType'))
	expect(commands[0].flag).toEqual(7) // 111

	STATE1.audio.channels[1] = c
})

test('Unit: audio: master channel', function () {
	STATE2.audio.master!.gain = -10

	const commands = audio.resolveAudioState(STATE1, STATE2) as Array<AudioMixerInputCommand>
	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('AudioMixerMasterCommand')
	expect(commands[0].properties).toEqual({ gain: STATE2.audio.master!.gain })
	expect(commands[0].flag).toEqual(1) // 001

	STATE2.audio.master!.gain = 0
})
