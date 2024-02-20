# Cara build app

## Build react app

- clone repository dss-react-app
- cd dss-react-app
- npm install
- npm run build
- hasil build ada di folder dist
- run webserver static file: PORT=5173 serve -s dist

## Build electron app

- clone repository dss-electron-app
- cd dss-electron-app
- npm install
- npm run dist
- hasil build ada di folder dist
- buat file .env yg berisi: APPID, DBUSER, DBPASS, DEBUG
- run app: npm run start


