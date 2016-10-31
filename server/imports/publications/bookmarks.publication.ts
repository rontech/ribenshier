import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { Bookmarks } from '../../../both/collections/bookmarks.collection';
import { Bookmark } from '../../../both/models/bookmark.model';
 
Meteor.publish('bookmarks', function(senderId: string): Mongo.Cursor<Bookmark> {
  if (!senderId) return;
 
  return Bookmarks.collection.find({senderId: senderId});
});
