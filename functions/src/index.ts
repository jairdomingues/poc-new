import * as functions from 'firebase-functions';
import app from '../../server';

export const ssr = functions.https.onRequest(app);

exports.updateUser = functions.firestore
    .document('heroes/{id}')
    .onUpdate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();

    // access a particular field as you would any JS property
    const name = newValue.orderStatus;


    if (name === 'SENT') {
        console.log('sent');
    }
    // perform desired operations ...
    return true;

});
