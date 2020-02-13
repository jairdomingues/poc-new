import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule, AngularFirestore, FirestoreSettingsToken} from '@angular/fire/firestore';
import {environment} from '../../../environments/environment';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'angularexampleapp'),
    AngularFirestoreModule,
  ],
  exports: [
    AngularFireModule,
    AngularFirestoreModule
  ],
})

export class FirebaseModule {

  constructor(private db: AngularFirestore) {

    this.db.firestore.settings({
      cacheSizeBytes: -1 //db.firestore.CACHE_SIZE_UNLIMITED
    });

    this.db.firestore.enablePersistence()
      .catch(function(err) {
          if (err.code == 'failed-precondition') {
              // Multiple tabs open, persistence can only be enabled
              // in one tab at a a time.
              // ...
          } else if (err.code == 'unimplemented') {
              // The current browser does not support all of the
              // features required to enable persistence
              // ...
          }
      })
  }


}
