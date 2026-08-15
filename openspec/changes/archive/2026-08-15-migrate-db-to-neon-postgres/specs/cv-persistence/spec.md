## MODIFIED Requirements

### Requirement: Transient connection failures are retried automatically
The system SHALL configure the `DbContext` to automatically retry database operations that fail due to a transient connection error (for example, the database resuming from an auto-suspended state), using a short delay between attempts, before surfacing the failure to the caller.

#### Scenario: A transient failure during database resume is retried
- **WHEN** a database operation fails with a transient connection error while the database is resuming from being auto-suspended
- **THEN** the system automatically retries the operation after a short delay, up to a bounded number of attempts, so a transient failure that resolves within that window is not observed by the caller

#### Scenario: A non-transient failure or exhausted retries is surfaced
- **WHEN** a database operation fails with an error that is not classified as transient, or all retry attempts have been exhausted
- **THEN** the failure is surfaced to the caller instead of being retried indefinitely
