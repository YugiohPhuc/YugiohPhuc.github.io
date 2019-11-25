/**
 * User.js
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
			required: true
	    },
	    email: {
			type: 'string',
			required: true,
			email: true
		},
    	password: {
			type: 'string',
			required: true
    	},
    	role: {
			type: 'string',
			enum: ['guest', 'customer', 'developer', 'admin'],
			defaultsTo: 'guest'
    	},
		map: {
			model: 'map',
			defaultsTo: 1
		},
		posX: {
			type: 'float',
			defaultsTo: 0.0
		},
		posY: {
			type: 'float',
			defaultsTo: 0.0
		},
		online: {
			type: 'boolean',
			defaultsTo: true
		},
		distance_collects: {
			collection: 'distance_collect',
			via: 'user'
		},
		height:{
			type: 'float',
			defaultsTo: 1.7
		},
		gender:{
			type: 'string',
			enum: ['male', 'female'],
			defaultsTo: 'male'
		},
		toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
	},
};

