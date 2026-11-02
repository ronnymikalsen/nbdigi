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

## Conversational search

The search box defaults to **KI-søk**. Ask for e.g. `Vis bilder av hunder`,
then refine with `Bare etter 2000`. The active NgRx search criteria are sent
with each message, so subjects, media types and date filters carry forward.
The chat supports subjects, media types, whole-year date ranges, sorting,
places and photographers/creators. Other existing filters remain in place
unless you start a new search.
**Vanlig søk** uses the original catalogue search without making AI requests.
Conversation history stays in memory and is cleared by **Nytt søk** or a reload.

- **Angre** restores the search criteria and conversation from before the last
  change (up to 20 changes, including removing chips and changing sorting).
- Remove an active filter using its chip. Other search criteria stay in place.
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

1. Run `yarn start`, open the app and submit a message in **KI-søk**.
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
