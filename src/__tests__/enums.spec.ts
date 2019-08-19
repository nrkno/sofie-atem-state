import * as _ from 'lodash'
import { Enums } from '../'
import { Enums as ConnEnums } from 'atem-connection'

test('Unit test: Enums: TransitionStyle identical values', function () {
	const enumVals = _.filter(_.values(Enums.TransitionStyle), _.isNumber)
	const connVals = _.filter(_.values(ConnEnums.TransitionStyle), _.isNumber)

	const extendedConnVals = [
		...connVals,
		Enums.TransitionStyle.CUT,
		Enums.TransitionStyle.DUMMY
	]

	expect(extendedConnVals).toEqual(enumVals)
})
