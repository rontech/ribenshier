import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { JobComments } from '../../../both/collections/job-comments.collection';
import { JobComment } from '../../../both/models/job-comment.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('job-comments', function(jobId: string): PublishCompositeConfig<JobComment> {
  if (!jobId) return;
 
  return {
    find() {
      return JobComments.collection.find({objId: jobId});
    },

    children: [
      {
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
