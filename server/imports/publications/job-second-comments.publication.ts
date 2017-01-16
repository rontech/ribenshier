import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { JobSecondComments } from '../../../both/collections/job-second-comments.collection';
import { JobSecondComment } from '../../../both/models/job-second-comment.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('job-second-comments', function(jobId: string): PublishCompositeConfig<JobSecondComment> {
  if (!jobId) return;
 
    return {
    find() {
      return JobSecondComments.collection.find({objId: jobId});
    },

     children: [
      {
        find: (JobSecondComment) => {
          return Meteor.users.find({
            _id: JobSecondComment.fromId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});
