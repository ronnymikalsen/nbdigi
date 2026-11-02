# Nbdigi

This project uses Angular 22 and Nx 24.

## Nx

Install Node 22.22.3 or newer (see `.nvmrc`), then run `yarn install`.

## Development server

Run `yarn start` and navigate to `http://localhost:4200/`.

## Code scaffolding

Use Nx generators, for example `yarn nx g @nx/angular:component my-component --project=nbdigi`.

## Build

Run `yarn build:production`. Browser artifacts are written to `dist/apps/nbdigi/browser`.

## Deploy

Run `yarn deploy` to build the production app and publish **only Hosting** to
`nbdigi-9637d`. Firestore rules, indexes and Cloud Functions are deployed separately.

Run `yarn test:firestore-rules` to check owner-only profile and subcollection access
against the local Firestore emulator (requires Java). After the rules pass, publish
them separately with `yarn firebase deploy --only firestore:rules --project nbdigi-9637d`.

## Conversational search

Open **KI-søk** in the navigation (`/ai-search`). Ask for e.g. `Vis bilder og bøker om hunder`,
then refine with `Bare etter 2000`. The chat's own search criteria are sent
with each message, so subjects, media types and date filters carry forward.
The chat supports subjects, media types, whole-year date ranges, sorting,
places and photographers/creators. Other existing filters remain in place
unless you start a new search.
Select multiple media types together, add one with `Ta også med kart`, or narrow
the selection with `Bare bøker`. Date and other refinements apply to every selected
media type. Mixed searches fetch each selected type in parallel and show separate sections
with per-type result counts. Without an explicit count, the request size is calculated
from the available width to fit two rows per type (normally four cards on mobile).
Ask for a specific count, e.g. `Jeg vil se 40 treff av fugler i bøker` (1–100 per
media type), to fetch and show all forty. No fetched cards are hidden behind an
expansion button. `Flere bilder` immediately submits a follow-up and fetches the next page.
New answers scroll to their beginning so the results are immediately visible.
Each answer keeps its own snapshots.
Say `flere` or `vis flere treff` to fetch the next API page for every available
media type, or `flere bilder` to expand just photos. The chat follows each group's
catalogue next link and shows only the new cards in fresh grids in the new
answer, omitting previously shown cards and unrequested media types. Previous
answers remain unchanged. Undo restores the previous cards and pagination position.
Each answer retains the requested result cards per media type. Follow-ups add a new result group
without replacing previous answers. The chat route has no separate result list
or filter bar. The original search and its filters remain at `/search`.
Conversation history stays in memory and is cleared by **Nytt søk** or a reload.

Chat state lives in the root-provided `AiSearchStore` (`@ngrx/signals`): criteria,
messages with result snapshots, request status, errors and undo history. It
survives route navigation and remains independent of the classic NgRx search
feature. `ChatSearchService` handles Firebase AI Logic, catalogue name resolution
and catalogue requests; both search features share the same catalogue restriction
builder. Reset cancels pending chat requests and clears only the chat state.
The store does not persist conversations to browser storage or Firestore.

- **Angre** restores the search criteria and conversation from before the last
  change (up to 20 changes, including removing chips and changing sorting).
- Remove a restriction conversationally, e.g. `Fjern datofilteret`. Other search
  criteria stay in place.
- Replies report the actual catalogue count for that specific search request.
  A failed or superseded search never supplies a made-up or stale count.
- Suggestions can draft a year, place or photographer follow-up. **Nyeste først**
  and **Fjern datofilter** update the search directly without calling Gemini.
- Try `Bare fra Oslo` or `Fotografert av Anders Beer Wilse`. Names are checked
  against catalogue suggestions; ambiguous matches prompt a clarification.
  A photographer refinement uses the catalogue's creator field, which also
  contains authors and other contributors depending on the media type.

The AI uses Firebase AI Logic with the Gemini Developer API; no custom server
or Cloud Function is required. Enable AI Logic for the registered web app in
the Firebase console. The Gemini free tier requires a Spark project with no
linked billing account and is subject to model availability and quotas.
The model name is configured in `environment.ai.model`. Search interpretation
uses `gemini-3.1-flash-lite` with `environment.ai.thinkingLevel` set to `MINIMAL`.
If changing models, choose a thinking level supported by that model.

For local development:

1. Run `yarn start`, open `/ai-search` and submit a message.
2. Open the browser developer console and find the `AppCheck debug token`.
3. In Firebase, open **App Check → Apps → nbdigi → Manage debug tokens** and
   register that token. Keep debug tokens private; do not commit them.
4. Submit the message again. Debug tokens are specific to that browser profile.

Before deploying, create a reCAPTCHA Enterprise website key for the deployed
domains and register the provider for the web app under Firebase App Check.
Set `ai.appCheckSiteKey` in `environment.prod.ts` to the public site key. The
production build never enables the debug provider. Keep App Check enforced
for AI Logic. The existing ordinary search remains available if AI setup,
quota or connectivity prevents a chat request.

See [Firebase AI Logic setup](https://firebase.google.com/docs/ai-logic/get-started?platform=web),
[App Check setup](https://firebase.google.com/docs/ai-logic/app-check), and
[pricing](https://firebase.google.com/docs/ai-logic/pricing?api=dev).

## Running unit tests

Run `yarn test` to execute the Jest suite.

Run `yarn lint` to execute ESLint.

## Further help

See the [Angular documentation](https://angular.dev/) and [Nx documentation](https://nx.dev/).
