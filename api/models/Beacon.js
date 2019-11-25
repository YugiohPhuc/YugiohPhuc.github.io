/**
 * Beacon.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		id: {
			type: 'integer',
			primaryKey: true,
			autoIncrement: true
		},
	    name: {
			type: 'string'
	    },
	    model: {
			type: 'string',
			required: false
	    },
	    map: {
			model: 'map',
			required: true
	    },
		bssid: {
			type: 'string',
			defaultsTo: "--:--:--:--:--:--",
			required: true,
			size: 17
		},
		ssid: {
			type: 'string',
			required: true,
			size: 255
		},
	    posX: {
			type: 'float',
			defaultsTo: 0.0,
			required: true,
		},
		posY: {
			type: 'float',
			defaultsTo: 0.0,
			required: true,
		},
		a_parameter: {
			type: 'float',
			defaultsTo: 0.0,
			required: true,
		},
		n_parameter: {
			type: 'float',
			defaultsTo: 1.8,
			required: true,
		}
	}
};

