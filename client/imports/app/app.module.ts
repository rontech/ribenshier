import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { IonicApp, IonicModule } from 'ionic-angular';
import { TabsContainerComponent } from '../pages/tabs-container/tabs-container.component';
import { TopicsComponent } from '../pages/topics/topics.component';
import { MomentModule } from 'angular2-moment';
import { CommentsPage } from '../pages/comments/comments-page.component';
import { ActivityCommentsPage } from '../pages/activities/activity-comments.component';
import { HouseCommentsPage } from '../pages/houses/house-comments.component';
import { LoginComponent } from '../pages/auth/login.component';
import { ProfileComponent } from '../pages/auth/profile.component';
import { NewTopicComponent } from '../pages/topics/new-topic.component';
import { NewActivityComponent } from '../pages/activities/new-activity.component';
import { NewHouseComponent } from '../pages/houses/new-house.component';
import { CommentsOptionsComponent } from '../pages/comments/comments-options.component';
import { ActivityCommentsOptionsComponent } from '../pages/activities/activity-comments-options.component';
import { HouseCommentsOptionsComponent } from '../pages/houses/house-comments-options.component';
import { TopicDetail } from '../pages/topic-detail/topic-detail.component';
import { ActivityDetail } from '../pages/activities/activity-detail.component';
import { HouseDetail } from '../pages/houses/house-detail.component';
import { TopicOptionsComponent } from '../pages/topic-detail/topic-options.component';
import { ActivityOptionsComponent } from '../pages/activities/activity-options.component';
import { HouseOptionsComponent } from '../pages/houses/house-options.component';
import { ChineseTimeAgoPipe } from '../filters/time.filter';
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
    LoginComponent,
    ProfileComponent,
    NewTopicComponent,
    NewActivityComponent,
    NewHouseComponent,
    CommentsOptionsComponent,
    ActivityCommentsOptionsComponent,
    HouseCommentsOptionsComponent,
    TopicDetail,
    TopicOptionsComponent,
    ActivityDetail,
    ActivityOptionsComponent,
    HouseDetail,
    HouseOptionsComponent,
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
    LoginComponent,
    ProfileComponent,
    NewTopicComponent,
    NewActivityComponent,
    NewHouseComponent,
    CommentsOptionsComponent,
    ActivityCommentsOptionsComponent,
    HouseCommentsOptionsComponent,
    TopicDetail,
    TopicOptionsComponent,
    ActivityDetail,
    ActivityOptionsComponent,
    HouseDetail,
    HouseOptionsComponent
  ],
  // Providers
  providers: [
  ],
  // Modules
  imports: [
    IonicModule.forRoot(AppComponent),
    MomentModule
  ],
  exports: [ChineseTimeAgoPipe],
  // Main Component
  bootstrap: [ IonicApp ]
})
export class AppModule {}
