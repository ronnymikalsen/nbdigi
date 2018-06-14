'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp();
exports.updateFavorite3 = functions.firestore
  .document('users/{userId}/items/{messageId}')
  .onWrite(event => {
    const data = event.data;
    admin
      .firestore()
      .collection('users/{userId}/favorites')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(v => {
          const doc = v.ref.collection('items').doc(data.id);
          if (doc) {
            doc
              .update({
                currentCanvasId: 10
              })
              .catch(err => console.log(err));
          }
          console.log('value', v);
        });
      })
      .catch(err => console.log(err));
  });
//# sourceMappingURL=index.js.map
