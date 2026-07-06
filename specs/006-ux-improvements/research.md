# Research: UX Improvements

## Findings

### Profile Role Visibility
- The `Profile.tsx` component currently displays an `<Input label="ROL" value={user.role} disabled />`.
- We can simply wrap this inside `{user.role === 'ADMIN' && (...) }` to satisfy the requirement that clients cannot see their role.

### Order History & Security
- `OrderHistory.tsx` correctly fetches only the user's orders via the `GET /orders/my-orders` endpoint. No backend changes needed for order filtering.
- Both `Profile.tsx` and `OrderHistory.tsx` implement a hardcoded sidebar layout.
- The "Seguridad" tab doesn't exist yet as a route.
- We will update the sidebars in `Profile.tsx` and `OrderHistory.tsx` to use `<Link>` components to navigate between `/profile`, `/orders`, and `/security`, ensuring the active page highlights the correct sidebar item.
- We will create `Security.tsx` sharing the same sidebar layout, containing a form to update the password.
- We will add `updatePassword` to `UserController` in the backend using `bcrypt.compare` (to verify the current password) and `bcrypt.hash` (to encrypt the new one), exposed via `PUT /users/password`.

### Homepage Image
- `Home.tsx` contains a section with `bg-[var(--color-obsidian)]` where a `div` acts as an image placeholder with text "ESPACIO PARA IMAGEN".
- We will use the `generate_image` tool during execution to create a realistic, tech-themed ecommerce placeholder image.
- We will replace the placeholder div with an `<img />` tag pointing to this generated asset.

### Footer Links
- `Footer.tsx` has three `<Link to="#">` elements for Terms, Privacy, and Support.
- We will create three new simple pages `Terms.tsx`, `Privacy.tsx`, and `Support.tsx` in `frontend/src/pages/`.
- We will add their routes to `App.tsx` and update the `to` props in `Footer.tsx`.
