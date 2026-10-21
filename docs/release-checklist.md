# ELYVEX focused release checks

Run these checks on a production preview before each release. Use one signed-in test account and a separate guest browser session. Record the build/preview URL and any failures with the release notes.

## Sign-in and saved priorities

- [ ] Sign in with the test account and confirm the app returns to the requested page.
- [ ] In Settings, select a persona and set a budget, save, refresh, and confirm both remain selected.
- [ ] Sign out, sign back in with the same account, and confirm the same persona, budget, and category priorities load.
- [ ] Open the app as a guest and confirm the recommendation setup prompts sign-in; guest choices do not overwrite the account’s saved profile.

## Recommendations

- [ ] As a guest, open **What we recommend**. Confirm persona and budget selection require sign-in before they can be saved.
- [ ] As a signed-in account with no persona, open the same page. Confirm the setup dialog offers persona and budget controls and shows no ranked list until **Run recommender** is pressed.
- [ ] Choose Student and set a budget. Run the recommender and confirm only the five highest scoring catalog phones at or below that budget appear.
- [ ] Expand **Score contribution by priority**. Confirm each weighted field shows its weight, normalized value, and point contribution; verify the contributions sum to the match score (allowing rounding).
- [ ] Use a catalog phone with a missing field. Confirm the breakdown explicitly flags it and assigns zero points without estimating a value.
- [ ] Switch to Gaming, Creator, Business Professional, and Senior. Confirm persona weights shown in the breakdown change and the list is recalculated.
- [ ] Set a budget above the catalog maximum (up to 2,000). Confirm the slider supports the full range and phones beyond the source maximum are not invented.
- [ ] Refresh and sign in again. Confirm persona and budget persist in the account.

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
