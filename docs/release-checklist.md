# ELYVEX focused release checks

Run these checks on a production preview before each release. Use one signed-in test account and a separate guest browser session. Record the build/preview URL and any failures with the release notes.

## Sign-in and saved priorities

- [ ] Sign in with the test account and confirm the app returns to the requested page.
- [ ] In Settings, select Gaming, Battery life, and Camera quality, save, refresh, and confirm all three remain selected.
- [ ] Sign out, sign back in with the same account, and confirm the same priorities load.
- [ ] Open the app as a guest and confirm priority controls direct the visitor to sign in; guest actions do not overwrite the account’s saved priorities.

## Recommendations

- [ ] As a guest with no saved priorities, open **What we recommend**. Confirm the setup prompt explains that priorities are required and offers sign-in.
- [ ] As a signed-in account with no priorities, open the same page. Confirm it offers the preference setup path and does not show a fabricated ranked list.
- [ ] Save one priority and then several priorities. Confirm phones are ranked and the overall match is the equal-weight average of the selected priority scores.
- [ ] Expand **How this score was calculated** on a result. Confirm each selected priority has its own score, category-tag status, and relevant spec explanation.
- [ ] Use a catalog phone with a missing relevant spec. Confirm the breakdown explicitly says that spec is missing and uses the category match only for that priority.
- [ ] Change priorities and confirm the ordering, per-priority breakdown, and displayed match percentages update together.

## Search filters on mobile

- [ ] At a narrow viewport (about 390 px wide), open Filters and confirm the drawer can scroll through every filter group, including the last group.
- [ ] Choose a category, brand, and at least one spec threshold. Confirm selected controls are visibly selected and the matching phone count updates.
- [ ] Close the drawer with **Show results**, reopen it, and confirm selections remain active.
- [ ] Remove one active filter chip and confirm only that filter clears. Use **Clear all** and confirm every filter, including price range, resets.
- [ ] Close the drawer with its close button and by tapping the backdrop. Confirm the page remains scrollable and the filter button shows the current applied-filter count.
- [ ] Repeat selection and clearing with a keyboard; confirm focused controls are distinguishable from selected controls.

## Compare and phone details

- [ ] Select two phones from search and open Compare. Confirm both phones and their available specifications appear, with better values identified where applicable.
- [ ] Remove one phone and choose a replacement. Confirm the comparison updates and never contains more than two phones.
- [ ] Open a phone from Discover and from Search. Confirm its detail page shows available catalog values, clearly marks unavailable values, and offers save/compare actions.
- [ ] Use Back from a phone opened in filtered search. Confirm the prior search query and filters are preserved.

## Release gate

- [ ] Build the frontend successfully and check the preview at desktop and mobile widths, including light and dark themes.
- [ ] Confirm the deployed preview uses the latest commit and Firebase sign-in works on its configured authorized domain.
