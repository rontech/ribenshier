import { Meteor } from 'meteor/meteor';
import { Thumbs, Images } from '../../../both/collections/images.collection';

import { Image, Thumb } from '../../../both/models/image.model';

Meteor.publish('thumbs', function(id: string) {
  return Thumbs.collection.find({
    originalStore: 'images',
    originalId: id
  });
});

Meteor.publish('thumb-list', function(ids: string[]) {
  return Thumbs.collection.find({
    originalStore: 'images',
    originalId: {$in: ids}
  });
});
 
Meteor.publish('images', function() {
  return  Images.collection.find({});
}); 
