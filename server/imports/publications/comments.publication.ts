import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { Comments } from '../../../both/collections/comments.collection';
import { Comment } from '../../../both/models/comment.model';
 
Meteor.publish('comments', function(topicId: string): Mongo.Cursor<Comment> {
  if (!this.userId) return;
  if (!topicId) return;
 
  return Comments.collection.find({topicId});
});
