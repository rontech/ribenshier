import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
import { ApperComments } from '../../../both/collections/apper-comments.collection';
import { ApperComment } from '../../../both/models/apper-comment.model';

Meteor.publishComposite('apper-comments', function(topicId: string): PublishCompositeConfig<ApperComment> {
  if (!topicId) return;
 
  return {
    find() {
      return ApperComments.collection.find({objId: topicId});
    },

    children: [
      {
        find: (appercomment) => {
          return Meteor.users.find({
            _id: appercomment.fromId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});
