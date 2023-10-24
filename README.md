# fasType

# UI Flow

### Header:

- Logo or application name
- Navigation links (Home, About, Contact, etc.)
- Login and Signup buttons (on the right side)

### Footer:

- Copyright information
- Additional links or relevant information

### Main Content Area:

- Container or section to hold the main content
- Card component for the typing exercise
    - Display a paragraph for the user to type
    - Input field for the user to enter their typed text
    - Timer to track the typing speed
    - Submit button to check the typed text and calculate statistics
    - Success or error message indicating if the typed text was correct or not

### Statistics Section:

- Graph or visual representation of the user's typing statistics
- Display relevant information such as typing speed, accuracy, and progress over time

### Based on the user's login status, the application behavior can be as follows:

1. **Not logged in:**
- The user can still access the typing exercise and practice typing.
- However, the details of their typing (such as speed, accuracy, etc.) will not be saved in the database.
- The statistics section may display a message suggesting users to log in for enhanced features and personalized statistics.
1. **Logged in:**
- The user can access the typing exercise, and their typing details will be saved in the database.
- The statistics section will display personalized graphs and visualizations based on the user's typing history.
- Users can view their historical typing data, track progress, and compare statistics over time.

<aside>
💡 Implement the authentication and authorization mechanisms to handle user registration, login, and session management. This will ensure that only logged-in users can access personalized statistics and that their typing data is securely saved in the database.

</aside>

## Folder Structure

```
/src
  /api
    - api.js (Axios API calls)
  /components
    /Header
      - Header.jsx
    /Footer
      - Footer.jsx
    /Card
      - Card.jsx
    /Statistics
      - Statistics.jsx
  /context
    - AuthContext.js (Context provider for authentication state using Context API)
  /redux
    /actions
      - authActions.js (Redux actions for authentication state)
    /reducers
      - authReducer.js (Redux reducer for authentication state)
    /store
      - configureStore.js (Redux store configuration)
  /pages
    - Home.jsx (Main page with the typing exercise and statistics)
    - Login.jsx (Login page)
    - Signup.jsx (Signup page)
  /utils
    - axios.js (Axios instance setup)
  /styles
    - main.css (Global styles)
  /config
    - env.js (Environment variables)
  - App.jsx (Root component)
  - index.js (Entry point)

/public
  - index.html
  - favicon.ico
```

### Context API or Redux

1. Context API for local component state:
    - Use the Context API for managing local component state or state that doesn't need to be shared across the entire application.
    - You can create context providers and consumers for specific components or smaller sections of your application.
    - This can be useful for managing UI-related state, form inputs, or any state that is not critical to the overall application state.
2.  Redux for global application state:
    - Use Redux for managing the global application state or state that needs to be shared and accessed by multiple components.
    - Set up a centralized Redux store to hold your application's state.
    - Define actions and reducers to handle state updates and interactions with the Redux store.
    - Use Redux's connect or useSelector and useDispatch hooks to connect your components to the Redux store and access the global state.
