# Quickstart

No new dependencies or databases are introduced in this feature.

To test the changes locally:

1. Ensure the backend is running (`npm run dev` in `backend`).
2. Ensure the frontend is running (`npm run dev` in `frontend`).
3. Log in as a regular `CLIENT` user to verify the role is hidden on the profile page, and as an `ADMIN` to verify it's still visible for them (if applicable).
4. Check the `Order History` and `Security` sidebar tabs for navigation and layout consistency.
5. Perform a password change in the `Security` tab and attempt to log in with the new password.
6. Check the home page to verify the placeholder image has been added.
7. Scroll to the footer and click Terms, Privacy, and Support to verify the routes load correctly.
