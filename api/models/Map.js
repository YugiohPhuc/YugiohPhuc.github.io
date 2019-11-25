/**
 * Map.js
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
			type: 'string',
		},
		beacons: {
			collection: 'beacon',
			via: 'map'
		},
		users: {
			collection: 'user',
			via: 'map'
		},
		width: {
			type: 'float'
		},
		height: {
			type: 'float'
		},
		map_file_path: {
			type: 'string'
		},
		orientation: {
			type: 'float',
			defaultsTo: '0.0'
		}
	}
};

