import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { IonicApp, IonicModule } from 'ionic-angular';
import { TabsContainerComponent } from '../pages/tabs-container/tabs-container.component';
import { TopicsComponent } from '../pages/topics/topics.component';
import { MomentModule } from 'angular2-moment';
import { CommentsPage } from '../pages/topics/comments-page.component';
import { ActivityCommentsPage } from '../pages/activities/activity-comments.component';
import { HouseCommentsPage } from '../pages/houses/house-comments.component';
import { JobCommentsPage } from '../pages/jobs/job-comments.component';
import { LoginComponent } from '../pages/auth/login.component';
import { NewUserComponent } from '../pages/auth/new-user.component';
import { ProfileComponent } from '../pages/auth/profile.component';
import { NewTopicComponent } from '../pages/topics/new-topic.component';
import { NewActivityComponent } from '../pages/activities/new-activity.component';
import { NewHouseComponent } from '../pages/houses/new-house.component';
import { NewJobComponent } from '../pages/jobs/new-job.component';
import { CommentsOptionsComponent } from '../pages/topics/comments-options.component';
import { ActivityCommentsOptionsComponent } from '../pages/activities/activity-comments-options.component';
import { HouseCommentsOptionsComponent } from '../pages/houses/house-comments-options.component';
import { JobCommentsOptionsComponent } from '../pages/jobs/job-comments-options.component';
import { TopicDetail } from '../pages/topics/topic-detail.component';
import { ActivityDetail } from '../pages/activities/activity-detail.component';
import { HouseDetail } from '../pages/houses/house-detail.component';
import { JobDetail } from '../pages/jobs/job-detail.component';
import { TopicOptionsComponent } from '../pages/topics/topic-options.component';
import { ActivityOptionsComponent } from '../pages/activities/activity-options.component';
import { HouseOptionsComponent } from '../pages/houses/house-options.component';
import { JobOptionsComponent } from '../pages/jobs/job-options.component';
import { BookmarksComponent } from '../pages/bookmarks/bookmarks.component';
import { ChineseTimeAgoPipe } from '../filters/time.filter';
import { UtilityService } from '../services/utility.service';
import 'intl';
import 'intl/locale-data/jsonp/en';

@NgModule({
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    TabsContainerComponent,
    TopicsComponent,
    CommentsPage,
    ActivityCommentsPage,
    HouseCommentsPage,
    JobCommentsPage,
    LoginComponent,
    NewUserComponent,
    ProfileComponent,
    NewTopicComponent,
    NewActivityComponent,
    NewHouseComponent,
    NewJobComponent,
    CommentsOptionsComponent,
    ActivityCommentsOptionsComponent,
    HouseCommentsOptionsComponent,
    JobCommentsOptionsComponent,
    TopicDetail,
    TopicOptionsComponent,
    ActivityDetail,
    ActivityOptionsComponent,
    HouseDetail,
    HouseOptionsComponent,
    JobDetail,
    JobOptionsComponent,
    BookmarksComponent,
    ChineseTimeAgoPipe
  ],
  // Entry Components
  entryComponents: [
    AppComponent,
    TabsContainerComponent,
    TopicsComponent,
    CommentsPage,
    ActivityCommentsPage,
    HouseCommentsPage,
    JobCommentsPage,
    LoginComponent,
    NewUserComponent,
    ProfileComponent,
    NewTopicComponent,
    NewActivityComponent,
    NewHouseComponent,
    NewJobComponent,
    CommentsOptionsComponent,
    ActivityCommentsOptionsComponent,
    HouseCommentsOptionsComponent,
    JobCommentsOptionsComponent,
    TopicDetail,
    TopicOptionsComponent,
    ActivityDetail,
    ActivityOptionsComponent,
    HouseDetail,
    HouseOptionsComponent,
    JobDetail,
    JobOptionsComponent,
    BookmarksComponent
  ],
  // Providers
  providers: [ UtilityService ],
  // Modules
  imports: [
    IonicModule.forRoot(AppComponent, {},  {
     links: [
      { component: TopicDetail, name: 'TopicDetail', segment: 'topic-detail/:topicId'},
      { component: ActivityDetail, name: 'ActivityDetail', segment: 'activity-detail/:activityId'},
      { component: HouseDetail, name: 'HouseDetail', segment: 'house-detail/:houseId'},
      { component: JobDetail, name: 'JobDetail', segment: 'job-detail/:jobId'}
    ]
  }),
    MomentModule,
    ReactiveFormsModule
  ],
  exports: [ChineseTimeAgoPipe],
  // Main Component
  bootstrap: [ IonicApp ]
})
export class AppModule {}
