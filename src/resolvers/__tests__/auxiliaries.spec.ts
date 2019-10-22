import * as video from '../index'
import { State as StateObject } from '../../'
import { Commands, Enums } from 'atem-connection'

const STATE1 = new StateObject()
STATE1.video.auxilliaries = [ 0, 0, 0, 2 ]

const STATE2 = new StateObject()
STATE2.video.auxilliaries = [ 1, 0, 2, 0 ]

test('Unit: auxiliaries: same state gives no commands', function () {
	// same state gives no commands:
	const commands = video.videoState(STATE1, STATE1, Enums.ProtocolVersion.V7_2)
	expect(commands).toHaveLength(0)
})

test('Unit: media player: status command', function () {
	const commands = video.videoState(STATE1, STATE2, Enums.ProtocolVersion.V7_2) as Array<Commands.AuxSourceCommand>
	expect(commands).toHaveLength(3)

	expect(commands[0].constructor.name).toEqual('AuxSourceCommand')
	expect(commands[0].auxBus).toEqual(0)
	expect(commands[0].properties).toEqual({
		source: 1
	})

	expect(commands[1].constructor.name).toEqual('AuxSourceCommand')
	expect(commands[1].auxBus).toEqual(2)
	expect(commands[1].properties).toEqual({
		source: 2
	})

	expect(commands[2].constructor.name).toEqual('AuxSourceCommand')
	expect(commands[2].auxBus).toEqual(3)
	expect(commands[2].properties).toEqual({
		source: 0
	})
})
