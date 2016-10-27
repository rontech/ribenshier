import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { TopicThumbeds } from '../../../both/collections/topic-thumbed.collection';
import { TopicThumbed } from '../../../both/models/topic-thumbed.model';
 
Meteor.publish('topic-thumbed', function(topicId: string): Mongo.Cursor<TopicThumbed> {
  if (!topicId) return;
 
  return TopicThumbeds.collection.find({topicId});
});
