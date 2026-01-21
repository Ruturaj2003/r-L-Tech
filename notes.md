## API Request Handling Guidelines

### Non-GET Requests

For all **non-GET** requests, ensure data placement follows these rules:

- **Send payload in the request body** when applicable:
  ```js
  axios.post(url, body); // Data sent in request body
  ```

* **Send data via query parameters only when required**:

  ```js
  axios.post(url, null, { params }); // Data sent in URL as query params
  ```

### Location

All API service logic must reside in the `services/` folder.

---

## UI & UX Guidelines

### Design Strategy

- Desktop-first approach
- UI must be optimized for tablet devices

### Features

#### Global Navigation Search

- Implement a global navigation search
- Access must be restricted based on authorization level

**Example:**

- HR role can access only 5 specific pages
- Attempting to access unauthorized pages should redirect the user

#### Notifications → Chat Interface

- Notifications that open a chat interface are low priority
- This feature should be implemented after core functionality

```

```

### Add the Customer Fotter in the Table
