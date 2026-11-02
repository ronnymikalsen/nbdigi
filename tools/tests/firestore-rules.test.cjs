const assert = require('node:assert/strict');
const { after, test } = require('node:test');
const { initializeApp, deleteApp } = require('firebase/app');
const {
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  getFirestore,
  setDoc,
  terminate,
  updateDoc,
} = require('firebase/firestore');

const endpoint = process.env.FIRESTORE_EMULATOR_HOST;
assert.ok(
  endpoint,
  'Run via yarn test:firestore-rules; a local emulator is required.',
);
const [host, port] = endpoint.split(':');
assert.ok(
  ['127.0.0.1', 'localhost'].includes(host),
  'Only a local emulator is allowed.',
);

const clients = [];
function client(uid) {
  const app = initializeApp(
    { projectId: 'demo-nbdigi-rules-test' },
    uid ?? 'anonymous',
  );
  const db = getFirestore(app);
  connectFirestoreEmulator(
    db,
    host,
    Number(port),
    uid ? { mockUserToken: { sub: uid } } : {},
  );
  clients.push({ app, db });
  return db;
}

const alice = client('alice');
const bob = client('bob');
const anonymous = client();
const denied = (operation) =>
  assert.rejects(operation, (error) => error.code === 'permission-denied');

after(async () => {
  await Promise.all(
    clients.map(async ({ app, db }) => {
      await terminate(db);
      await deleteApp(app);
    }),
  );
});

test('a signed-in user can manage their own profile', async () => {
  const profile = doc(alice, 'users/alice');
  await setDoc(profile, { displayName: 'Alice' });
  assert.equal((await getDoc(profile)).data().displayName, 'Alice');
  await updateDoc(profile, { theme: 'dark-theme' });
  assert.equal((await getDoc(profile)).data().theme, 'dark-theme');
  await deleteDoc(profile);
});

test('a user cannot create, read, update or delete another user profile', async () => {
  await denied(setDoc(doc(bob, 'users/alice'), { displayName: 'Injected' }));
  await setDoc(doc(alice, 'users/alice'), { displayName: 'Alice' });
  await denied(getDoc(doc(bob, 'users/alice')));
  await denied(updateDoc(doc(bob, 'users/alice'), { displayName: 'Changed' }));
  await denied(deleteDoc(doc(bob, 'users/alice')));
  await denied(getDocs(collection(bob, 'users')));
});

test('user subcollections remain private to their owner', async () => {
  const item = doc(alice, 'users/alice/items/book-1');
  await setDoc(item, { title: 'Book' });
  assert.equal((await getDoc(item)).data().title, 'Book');
  await updateDoc(item, { title: 'Updated book' });
  await denied(getDoc(doc(bob, 'users/alice/items/book-1')));
  await denied(
    setDoc(doc(bob, 'users/alice/items/book-2'), { title: 'Injected' }),
  );
  await denied(
    updateDoc(doc(bob, 'users/alice/items/book-1'), { title: 'Changed' }),
  );
  await denied(deleteDoc(doc(bob, 'users/alice/items/book-1')));
  await denied(getDocs(collection(bob, 'users/alice/items')));
  assert.equal((await getDocs(collection(alice, 'users/alice/items'))).size, 1);
  await deleteDoc(item);
});

test('unauthenticated clients cannot access profiles or user data', async () => {
  await denied(getDoc(doc(anonymous, 'users/alice')));
  await denied(
    setDoc(doc(anonymous, 'users/anonymous'), { displayName: 'Anonymous' }),
  );
  await denied(
    updateDoc(doc(anonymous, 'users/alice'), { theme: 'light-theme' }),
  );
  await denied(deleteDoc(doc(anonymous, 'users/alice')));
  await denied(getDoc(doc(anonymous, 'users/alice/items/book-1')));
  await denied(
    setDoc(doc(anonymous, 'users/alice/items/book-1'), { title: 'Injected' }),
  );
});
