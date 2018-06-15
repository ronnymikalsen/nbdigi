'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);
exports.updateFavorite3 = functions.firestore
  .document('users/{userId}/items/{messageId}')
  .onWrite((snapshot, context) => {
    const data = snapshot.after;
    const currentCanvasId = data.get('currentCanvasId');
    return snapshot.after.ref.parent.parent
      .collection('favorites')
      .get()
      .then(collections => {
        collections.forEach(snap => {
          snap.ref
            .collection('items')
            .get()
            .then(i => {
              i.forEach(hmm => {
                if (hmm.id === data.id) {
                  hmm.ref
                    .update({
                      currentCanvasId: currentCanvasId
                    })
                    .catch(err => console.log(err));
                }
              });
            })
            .catch(err => console.log(err));
        });
      })
      .catch(err => console.log(err));
  });
//# sourceMappingURL=index.js.map
