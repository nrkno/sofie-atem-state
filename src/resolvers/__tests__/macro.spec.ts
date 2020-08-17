import * as video from '../index'
import { Commands, Enums, AtemStateUtil } from 'atem-connection'

const STATE1 = AtemStateUtil.Create()
STATE1.macro.macroPlayer = {
	isRunning: true,
	isWaiting: false,
	loop: true,
	macroIndex: 12
}

const STATE2 = AtemStateUtil.Create()
STATE2.macro.macroPlayer = {
	isRunning: true,
	isWaiting: false,
	loop: true,
	macroIndex: 10
}

const STATE3 = AtemStateUtil.Create()
STATE3.macro.macroPlayer = {
	isRunning: false,
	isWaiting: false,
	loop: true,
	macroIndex: 12
}

test('Unit: macro: same state gives no commands', function () {
	// same state gives no commands:
	const commands = video.videoState(STATE1, STATE1, Enums.ProtocolVersion.V7_2)
	expect(commands).toHaveLength(0)
})

test('Unit: macro: change running macro', function () {
	const commands = video.videoState(STATE1, STATE2, Enums.ProtocolVersion.V7_2) as Array<Commands.MacroActionCommand>

	expect(commands).toHaveLength(1)
	expect(commands[0].constructor.name).toEqual('MacroActionCommand')
	expect(commands[0].index).toEqual(10)
	expect(commands[0].properties).toEqual({
		action: 0
	})
})

test('Unit: macro: stop macro', function () {
	const commands = video.videoState(STATE2, STATE3, Enums.ProtocolVersion.V7_2) as Array<Commands.MacroActionCommand>

	// This will change once this is supported properly, but for now it should not start playing
	expect(commands).toHaveLength(0)
})
