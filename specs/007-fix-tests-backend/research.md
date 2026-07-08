# Research: API Response Formatting & Test Failures

## Decision: Standardize API Envelopes
**Decision**: Standardize all API success responses to `{ data: payload }`.
**Rationale**: 45% of the integration tests are failing with `TypeError: Cannot read properties of undefined` because they expect the response body to have a `data` field, but controllers are either returning the payload directly, or failing internally. Standardizing the envelope is a REST best practice and fixes the tests.
**Alternatives considered**: Modifying the tests to not expect the `data` envelope. Rejected because wrapping responses is a better practice, allows for metadata pagination, and the test suite clearly expects it across multiple endpoints.

## Decision: Authentication Test Assertions
**Decision**: Change the assertions in authentication tests to validate against standard HTTP 400 status codes and `{ error: message }` format.
**Rationale**: The tests currently assert against `success: false` which is an anti-pattern when using proper HTTP error status codes.
**Alternatives considered**: Changing the error middleware to return `success: false`. Rejected because standard HTTP mechanisms already communicate failure.
