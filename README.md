# Cara build app

## Build react app

- clone repository dss-react-app
- cd dss-react-app
- npm install
- npm run build
- hasil build ada di folder dist

## Build electron app

- clone repository dss-electron-app
- cd dss-electron-app
- npm install
- npm run dist
- hasil build ada di folder dist
- buat file .env yg berisi: APPID, DBUSER, DBPASS, DEBUG
- copy semua file dari folder dss-react-app/dist ke folder <app>/resources/build
- edit file index.html, ubah /assets jadi ./assets
- run app: DEBUG=false ./my-electron-app


