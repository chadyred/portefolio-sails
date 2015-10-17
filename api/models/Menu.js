/**
* Menu.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
		titre : {
			type: "string",
            required: true
		},
		items : {
			collection: "Item",
			via: "menu"
		},
		itemWrapper : {
			model: "Item"			
		},		
		role : {
			model: "Role"		
		},		
	}  
};

