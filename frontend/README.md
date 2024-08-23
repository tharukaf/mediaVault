# Media Vault

This application provides a single place for you to store all your favorite types of entertainment

### Tools used in this project:

- `React` as its frontend UI library with `Vite` as its build tool
- `react-router` is used to enable client-side routing
- `Node.js` for the backend server runtime enviroment
- `Express.js` as the server framework

### APIs used in this project:

- **TMDB**: movie/tv data
- **Spotify**: music data
- **IGDB**: video game data
- **Google Books**: book data

## Setting up `React`

- `cd ./frontend`
- Create a `.env` file and define `API_URL = 'http://localhost:8000'`
- To deploy the application in a production environment, replace the URL with the URL the backend server is deployed to
- Run `npm install` to install the necessary dependencies
- Start the frontend development server by running `npm run dev`

## Setting up `Node.js`

- `cd ./backend`
- Create a `.env` file and define API keys as follows:
- Run `npm install` to install the required packages
- Start the backend development server by running `npm start`
- Access the application in your browser at `http://localhost:5173`
