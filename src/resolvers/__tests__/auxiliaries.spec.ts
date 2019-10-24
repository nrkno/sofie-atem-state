import * as video from '../index'
import { State as StateObject } from '../../'
import { Commands, Enums } from 'atem-connection'

const STATE1 = {
	video: {
		auxilliaries: [ 0, 0, 0, 0 ]
	}
}
const STATE2 = {
	video: {
		auxilliaries: [ 1, 0, 2, 0 ]
	}
}

test('Unit: auxiliaries: same state gives no commands', function () {
	// same state gives no commands:
	const commands = video.videoState(STATE1 as unknown as StateObject, STATE1 as unknown as StateObject, Enums.ProtocolVersion.V7_2)
	expect(commands.length).toEqual(0)
})

test('Unit: media player: status command', function () {
	const commands = video.videoState(STATE1 as unknown as StateObject, STATE2 as unknown as StateObject, Enums.ProtocolVersion.V7_2) as Array<Commands.AuxSourceCommand>

	expect(commands[0].rawName).toEqual('CAuS')
	expect(commands[0].auxBus).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		source: 1
	})

	expect(commands[1].rawName).toEqual('CAuS')
	expect(commands[1].auxBus).toEqual(2)
	expect(commands[1].properties).toMatchObject({
		source: 2
	})
})
