import * as DSK from '../downstreamKeyer'
import { State as StateObject } from '../../'
import { Commands } from 'atem-connection'

const STATE1 = {
	video: {
		downstreamKeyers: [
			{
				onAir: false,
				inTransition: false,
				isAuto: false,
				remainingFrames: 25
			},
			{
				onAir: true,
				inTransition: false,
				isAuto: false,
				remainingFrames: 25
			}
		]
	}
}
const STATE2 = {
	video: {
		downstreamKeyers: [
			{
				onAir: true,
				inTransition: false,
				isAuto: false,
				remainingFrames: 25
			},
			{
				onAir: false,
				inTransition: false,
				isAuto: true,
				remainingFrames: 25
			}
		]
	}
}

test('Unit: Downstream keyer: same state gives no commands', function () {
	const commands = DSK.resolveDownstreamKeyerState(STATE1 as StateObject, STATE1 as StateObject)
	expect(commands.length).toEqual(0)
})

test('Unit: Downstream keyer: auto and onAir commands', function () {
	const commands = DSK.resolveDownstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject)

	const firstCommand = commands[0] as Commands.DownstreamKeyOnAirCommand
	expect(firstCommand.rawName).toEqual('CDsL')
	expect(firstCommand.downstreamKeyId).toEqual(0)
	expect(firstCommand.properties).toMatchObject({
		onAir: true
	})

	const secondCommand = commands[1] as Commands.DownstreamKeyAutoCommand
	expect(secondCommand.rawName).toEqual('DDsA')
	expect(secondCommand.downstreamKeyId).toEqual(1)
})
