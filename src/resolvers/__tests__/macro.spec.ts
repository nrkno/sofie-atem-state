import * as video from '../index'
import { State as StateObject } from '../../'
import { Commands } from 'atem-connection'

const STATE1 = new StateObject()
STATE1.macro.macroPlayer = {
	isRunning: true,
	isWaiting: false,
	loop: true,
	macroIndex: 12
}

const STATE2 = new StateObject()
STATE2.macro.macroPlayer = {
	isRunning: true,
	isWaiting: false,
	loop: true,
	macroIndex: 10
}

const STATE3 = new StateObject()
STATE3.macro.macroPlayer = {
	isRunning: false,
	isWaiting: false,
	loop: true,
	macroIndex: 12
}

test('Unit: macro: same state gives no commands', function () {
	// same state gives no commands:
	const commands = video.videoState(STATE1 as unknown as StateObject, STATE1 as unknown as StateObject)
	expect(commands).toHaveLength(0)
})

test('Unit: macro: change running macro', function () {
	const commands = video.videoState(STATE1 as unknown as StateObject, STATE2 as unknown as StateObject) as Array<Commands.MacroActionCommand>

	expect(commands).toHaveLength(1)
	expect(commands[0].rawName).toEqual('MAct')
	expect(commands[0].index).toEqual(10)
	expect(commands[0].properties).toMatchObject({
		action: 0
	})
})

test('Unit: macro: stop macro', function () {
	const commands = video.videoState(STATE2 as unknown as StateObject, STATE3 as unknown as StateObject) as Array<Commands.MacroActionCommand>

	// This will change once this is supported properly, but for now it should not start playing
	expect(commands).toHaveLength(0)
})
