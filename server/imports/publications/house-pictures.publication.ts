import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { HousePictures } from '../../../both/collections/house-pictures.collection';
import { HousePicture } from '../../../both/models/house-picture.model';
 
Meteor.publish('house-pictures', function(houseId: string): Mongo.Cursor<HousePicture> {
  if (!houseId) return;
 
  return HousePictures.collection.find({houseId});
});
