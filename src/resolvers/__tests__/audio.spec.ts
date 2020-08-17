import * as audio from '../audio'
import * as _ from 'underscore'
import { jsonClone } from '../../util'
import { AudioState, Commands, AtemStateUtil } from 'atem-connection'

function literal<T> (o: T) { return o }

const STATE1 = AtemStateUtil.Create()
STATE1.audio.channels = [
	literal<AudioState.AudioChannel>({
		sourceType: 0,
		portType: 1,
		mixOption: 0,
		gain: 0,
		balance: 0,
		supportsRcaToXlrEnabled: false,
		rcaToXlrEnabled: false
	}),
	literal<AudioState.AudioChannel>({
		sourceType: 0,
		portType: 1,
		mixOption: 1,
		gain: 5,
		balance: 4,
		supportsRcaToXlrEnabled: false,
		rcaToXlrEnabled: false
	})
]
const STATE2 = AtemStateUtil.Create()
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

	const commands = audio.resolveAudioState(STATE1, STATE2) as Array<Commands.AudioMixerInputCommand>
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

	const commands = audio.resolveAudioState(STATE1, STATE2) as Array<Commands.AudioMixerInputCommand>
	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('AudioMixerInputCommand')
	expect(commands[0].index).toEqual(1)
	expect(commands[0].properties).toEqual(_.omit(STATE2.audio.channels[1]!, 'portType', 'sourceType', 'supportsRcaToXlrEnabled', 'rcaToXlrEnabled')) // at what point should it include rcaToXlrEnabled?
	expect(commands[0].flag).toEqual(7) // 111

	STATE1.audio.channels[1] = c
})

test('Unit: audio: master channel', function () {
	STATE2.audio.master!.gain = -10

	const commands = audio.resolveAudioState(STATE1, STATE2) as Array<Commands.AudioMixerInputCommand>
	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('AudioMixerMasterCommand')
	expect(commands[0].properties).toEqual({ gain: STATE2.audio.master!.gain })
	expect(commands[0].flag).toEqual(1) // 001

	STATE2.audio.master!.gain = 0
})
