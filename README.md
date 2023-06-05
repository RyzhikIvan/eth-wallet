# This small app works in the Goerli test network only

To start using it you need the following:

## Create `.env` file with next lines:

`GENERATE_SOURCEMAP=false`
`REACT_APP_INFURA_PROJECT_ID=''`
`REACT_APP_ETHERSCAN_API_KEY=''`

##### `yarn` to instal dependencies

##### `yarn start` to start server

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

##### `yarn test` to run Jest tests

Tests are ready only for a few components for an example

###### Important information

- Your wallet's private key will not be saved anywhere! So after the page reloads you need to provide it again. Because the app has only a front-end part. For security reasons, the app will save in local storage only custom tokens addresses.

- This is SPA, with no routing but with a conditional rendering of the components. Not the best choice but for this architecture it's ok.

###### If this app was a commercial development I would add:

- pagination
- more validation for inputs
- formik.js for forms
- UI libraries for components
- more tests
- more complicated structure with separated CSS, tests and types
- media queries for responsive design
- live update for transactions table
