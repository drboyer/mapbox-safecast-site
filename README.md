# mb-safecast-site

## building and running

Frontend javascript work happens in the .js files in the src/ directory.

If you've just cloned this repo, you must first run `npm install` to install the
Node/JS modules locally.

Run `npm run start` to start a local webserver running at http://localhost:8080/.

This webserver will compile the .js files in the src/ directory and automatically
rebuild the output JavaScript whenever any files in the src/ are updated and saved.

If you want to manually build the output Javascript files without running the
development web server, you can run `npm run build`
