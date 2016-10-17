import { Meteor } from 'meteor/meteor';
 
import { Topics } from '../../../both/collections/topics.collection';
import { Topic } from '../../../both/models/topic.model';
import { Comments } from '../../../both/collections/comments.collection';
import { Comment } from '../../../both/models/comment.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('topics', function(): PublishCompositeConfig<Topic> {
  if (!this.userId) return;
 
  return {
    find: () => {
      return Topics.collection.find({});
    },
 
    children: [
      <PublishCompositeConfig1<Topic, Comment>> {
        find: (topic) => {
          return Comments.collection.find({topicId: topic._id}, {
            sort: {createdAt: -1},
            limit: 1
          });
        }
      },
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
