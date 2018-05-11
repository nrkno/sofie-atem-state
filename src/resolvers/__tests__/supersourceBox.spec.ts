import * as supersource from '../supersourceBox'
import { State as StateObject } from '../../'
import { Commands } from 'atem-connection'

const STATE1 = {
	video: {
		superSourceBoxes: [
			{
				enabled: false,
				source: 0,
				x: 0,
				y: 0,
				size: 0,
				cropped: false,
				cropTop: 0,
				cropBottom: 0,
				cropLeft: 0,
				cropRight: 0
			}
		]
	}
}
const STATE2 = {
	video: {
		superSourceBoxes: [
			{
				enabled: true,
				source: 1,
				x: 1,
				y: 1,
				size: 1,
				cropped: true,
				cropTop: 1,
				cropBottom: 1,
				cropLeft: 1,
				cropRight: 1
			}
		]
	}
}

test('Unit: media player: same state gives no commands', function () {
	// same state gives no commands:
	const commands = supersource.resolveSupersourceBoxState(STATE1 as StateObject, STATE1 as StateObject)
	expect(commands.length).toEqual(0)
})

test('Unit: media player: status command', function () {
	const commands = supersource.resolveSupersourceBoxState(STATE1 as StateObject, STATE2 as StateObject) as Array<Commands.SuperSourceBoxParametersCommand>

	expect(commands[0].rawName).toEqual('SSBP')
	expect(commands[0].boxId).toEqual(0)
	expect(commands[0].flag).toEqual(1023)
	expect(commands[0].properties).toMatchObject({
		enabled: true,
		source: 1,
		x: 1,
		y: 1,
		size: 1,
		cropped: true,
		cropTop: 1,
		cropBottom: 1,
		cropLeft: 1,
		cropRight: 1
	})
})
