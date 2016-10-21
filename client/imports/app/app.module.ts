import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { IonicApp, IonicModule } from "ionic-angular";
import { TabsContainerComponent } from "../pages/tabs-container/tabs-container.component";
import { TopicsComponent } from "../pages/topics/topics.component";
import { MomentModule } from "angular2-moment";
import { CommentsPage } from "../pages/comments/comments-page.component";
import { LoginComponent } from '../pages/auth/login.component';
import { ProfileComponent } from '../pages/auth/profile.component';
import { NewTopicComponent } from '../pages/topics/new-topic.component';
import { CommentsOptionsComponent } from '../pages/comments/comments-options.component';
import { TopicDetail } from "../pages/topic-detail/topic-detail.component";
import { ChineseTimeAgoPipe } from "../filters/time.filter";

@NgModule({
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    TabsContainerComponent,
    TopicsComponent,
    CommentsPage,
    LoginComponent,
    ProfileComponent,
    NewTopicComponent,
    CommentsOptionsComponent,
    TopicDetail,
    ChineseTimeAgoPipe
  ],
  // Entry Components
  entryComponents: [
    AppComponent,
    TabsContainerComponent,
    TopicsComponent,
    CommentsPage,
    LoginComponent,
    ProfileComponent,
    NewTopicComponent,
    CommentsOptionsComponent,
    TopicDetail
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
