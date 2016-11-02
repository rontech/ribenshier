import { Meteor } from 'meteor/meteor';
 
import { Topics } from '../../../both/collections/topics.collection';
import { Topic } from '../../../both/models/topic.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('topics', function(): PublishCompositeConfig<Topic> {
  return {
    find: () => {
      return Topics.collection.find({});
    },
 
    children: [
      <PublishCompositeConfig1<Topic, User>> {
        find: (topic) => {
          return Meteor.users.find({
            _id: topic.creatorId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});

Meteor.publishComposite('topics-one', function(topicId: string): PublishCompositeConfig<Topic> {
  return {
    find: () => {
      return Topics.collection.find({topicId});
    },
 
    children: [
      <PublishCompositeConfig1<Topic, User>> {
        find: (topic) => {
          return Meteor.users.find({
            _id: topic.creatorId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});
