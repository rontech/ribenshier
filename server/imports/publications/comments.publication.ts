import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { Comments } from '../../../both/collections/comments.collection';
import { Comment } from '../../../both/models/comment.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('comments', function(topicId: string): PublishCompositeConfig<Comment> {
  if (!topicId) return;
 
  return {
    find() {
      return Comments.collection.find({objId: topicId}); 
    },

    children: [
      <PublishCompositeConfig1<Comment, User>> {
        find: (comment) => {
          return Meteor.users.find({
            _id: comment.senderId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});
