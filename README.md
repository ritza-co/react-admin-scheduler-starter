# Create a React Admin Scheduler

This starter template has a React frontend app and an Express backend app. The client uses [Vite](https://vite.dev/), which is a development server and bundler. The server uses Express, [Sequelize ORM](https://sequelize.org/), and SQLite. 

## Code added to the server app to create and populate a local SQLite database

The following code was added for creating a local SQLite database populated with example Bryntum Scheduler data:

- **Sequelize instantiation code** (`backend/src/config/database.ts`): Code to create a Sequelize instance that uses a local SQLite database, stored as a `database.sqlite3` file in the `backend` folder.
- **Example data** (`backend/src/initialData`): Example JSON data for events, resources, and assignments. This data is used to populate the database.
- **Sequelize data models** (`backend/src/models`): Sequelize models to define the structure of the Bryntum Scheduler database tables.
- **Database seeding script** (`backend/src/addExampleData.ts`): A Node.js script that uses Sequelize to create a local SQLite database and populate it with the example data.
- **API endpoints** (`backend/src/index.ts`): API endpoints for events and resources CRUD operations - for use with the [Simple REST Data Provider For React-Admin](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-simple-rest).

The following npm packages were added:

- `sequelize`
- `sqlite3`
- `zod`
- `cors`

## Install the dependencies

Install the dependencies in the root, frontend and backend, by running the following command from the root directory: 

```sh
npm run install-all
```

## Create and populate a local SQLite database

Create and populate a local SQLite database with the example Scheduler data in `backend/src/initialData` by running the `addExampleData.ts` script:

```sh
npm run seed
```

## Running the frontend and backend apps at the same time

Run the local dev servers for the frontend and backend using the following command:

```sh
npm run dev
```

This runs the frontend and backend apps concurrently using the npm package `concurrently`.

You can access the frontend app at [`http://localhost:5173`](http://localhost:5173) and the backend app at [`http://localhost:1337`](http://localhost:1337).

If you open the frontend app in your browser, you'll see the text "App component", which is rendered by the `frontend/src/App.tsx` component.