/**
* Items.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		titre : {
  			type : "string",
  			required : true
  		},
		menu : {
			model : "Menu"
		},
		subMenu: {
			model: "Menu"
		},
		article: {
			model: "Article"
		}
  }
};