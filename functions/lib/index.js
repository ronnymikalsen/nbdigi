'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);
exports.updateFavorite3 = functions.firestore
  .document('users/{userId}/items/{messageId}')
  .onWrite((snapshot, context) => {
    console.log('start!');
    context.auth.uid;
    const data = snapshot.after;
    return admin
      .firestore()
      .collection('users/{userId}favorites')
      .get()
      .then(querySnapshot => {
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
  });
//# sourceMappingURL=index.js.map
