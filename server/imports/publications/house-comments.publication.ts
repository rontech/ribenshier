import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { HouseComments } from '../../../both/collections/house-comments.collection';
import { HouseComment } from '../../../both/models/house-comment.model';
 
Meteor.publish('house-comments', function(houseId: string): Mongo.Cursor<HouseComment> {
  if (!houseId) return;
 
  return HouseComments.collection.find({houseId});
});
