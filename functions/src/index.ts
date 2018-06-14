import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);

export const updateFavorite3 = functions.firestore
  .document('users/{userId}/items/{messageId}')
  .onWrite(
    (
      snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>,
      context: functions.EventContext
    ) => {
      console.log('start!');
      context.auth.uid;
      const data = snapshot.after;
      return admin
        .firestore()
        .collection('users/{userId}favorites')
        .get()
        .then((querySnapshot: FirebaseFirestore.QuerySnapshot) => {
          console.log('querySnapshot', querySnapshot.docs.length);
          console.log('data', data);
          querySnapshot.docs.forEach(v => {
            const doc = v.ref.collection('items').doc(data.id);
            console.log('doc', doc);

            if (doc) {
              return doc
                .update({
                  currentCanvasId: 10
                })
                .catch(err => console.log(err));
            } else {
              return null;
            }
          });
          console.log('done!');
          return null;
        })
        .catch(err => console.log(err));
    }
  );
