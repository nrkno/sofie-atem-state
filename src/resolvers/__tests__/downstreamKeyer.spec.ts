import * as DSK from '../downstreamKeyer'
import { State as StateObject, Defaults } from '../../'
import { Commands } from 'atem-connection'
import { DownstreamKeyer } from 'atem-connection/dist/state/video/downstreamKeyers'

const STATE1 = {
	video: {
		downstreamKeyers: [ JSON.parse(JSON.stringify(Defaults.Video.DownStreamKeyer)), JSON.parse(JSON.stringify(Defaults.Video.DownStreamKeyer)) ]
	}
}
const STATE2 = {
	video: {
		downstreamKeyers: [ JSON.parse(JSON.stringify(Defaults.Video.DownStreamKeyer)), JSON.parse(JSON.stringify(Defaults.Video.DownStreamKeyer)) ]
	}
}
const DSK1 = STATE2.video.downstreamKeyers[0] as DownstreamKeyer
const DSK2 = STATE2.video.downstreamKeyers[1] as DownstreamKeyer

test('Unit: Downstream keyer: same state gives no commands', function () {
	const commands = DSK.resolveDownstreamKeyerState(STATE1 as StateObject, STATE1 as StateObject)
	expect(commands.length).toEqual(0)
})

test('Unit: Downstream keyer: auto and onAir commands', function () {
	DSK1.onAir = true
	DSK2.isAuto = true
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
	DSK1.onAir = false
	DSK2.isAuto = false
})

test('Unit: Downstream keyer: sources', function () {
	DSK1.sources.fillSource = 1
	DSK2.sources.cutSource = 2
	const commands = DSK.resolveDownstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject)

	const firstCommand = commands[0] as Commands.DownstreamKeyFillSourceCommand
	expect(firstCommand.rawName).toEqual('CDsF')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toMatchObject({
		input: 1
	})

	const secondCommand = commands[1] as Commands.DownstreamKeyCutSourceCommand
	expect(secondCommand.rawName).toEqual('CDsC')
	expect(secondCommand.downstreamKeyerId).toEqual(1)
	expect(secondCommand.properties).toMatchObject({
		input: 2
	})
	DSK1.sources.fillSource = 0
	DSK2.sources.cutSource = 0
})

test('Unit: Downstream keyer: rate', function () {
	DSK1.properties.rate = 50
	const commands = DSK.resolveDownstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject)

	const firstCommand = commands[0] as Commands.DownstreamKeyRateCommand
	expect(firstCommand.rawName).toEqual('CDsR')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toMatchObject({
		rate: 50
	})
	DSK1.properties.rate = 25
})

test('Unit: Downstream keyer: tie', function () {
	DSK1.properties.tie = true
	const commands = DSK.resolveDownstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject)

	const firstCommand = commands[0] as Commands.DownstreamKeyTieCommand
	expect(firstCommand.rawName).toEqual('CDsT')
	expect(firstCommand.downstreamKeyId).toEqual(0)
	expect(firstCommand.properties).toMatchObject({
		tie: true
	})
	DSK1.properties.tie = false
})

test('Unit: Downstream keyer: properties', function () {
	DSK1.properties.preMultiply = true
	DSK1.properties.clip = 500
	DSK1.properties.gain = 50
	DSK1.properties.invert = true
	const commands = DSK.resolveDownstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject)

	const firstCommand = commands[0] as Commands.DownstreamKeyGeneralCommand
	expect(firstCommand.rawName).toEqual('CDsG')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toMatchObject({
		preMultiply: true,
		clip: 500,
		gain: 50,
		invert: true
	})
	DSK1.properties.preMultiply = false
	DSK1.properties.clip = 0
	DSK1.properties.gain = 0
	DSK1.properties.invert = false
})

test('Unit: Downstream keyer: mask', function () {
	DSK1.properties.mask = {
		enabled: true,
		top: 1,
		bottom: 2,
		left: 3,
		right: 4
	}
	const commands = DSK.resolveDownstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject)

	const firstCommand = commands[0] as Commands.DownstreamKeyMaskCommand
	expect(firstCommand.rawName).toEqual('CDsM')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toMatchObject({
		enabled: true,
		top: 1,
		bottom: 2,
		left: 3,
		right: 4
	})
	DSK1.properties.mask.enabled = false
	DSK1.properties.mask.top = 0
	DSK1.properties.mask.bottom = 0
	DSK1.properties.mask.left = 0
	DSK1.properties.mask.right = 0
})
