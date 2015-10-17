/**
* Article.js
*
* @description :: This models represents a post which submit by a member.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	titre: {
  		type: 'string',
  		required: true
  	},
  	contenu: {
  		type: 'string',
  		required: true
  	},
    auteur : {
      model : "User"
    },
    item: {
      model: "Item"
    }
  }
};