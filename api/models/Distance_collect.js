/**
 * Distance_collect.js
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
		beacon: {
			model: 'beacon'
		},
		user: {
			model: 'user'
		},
		distance: {
			type: 'float',
			defaultsTo: 0.0,
			required: true
		}
	}
};

