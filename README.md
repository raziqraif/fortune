To run the frontend, read client-react/README.md
If `npm run` in the client-react directory fails, try `npm install` in the client-react directory.
If npm doesn't work in general, you may not have Node installed.
    You’ll need to have Node 8.16.0 or Node 10.16.0 or later version on your local development machine

If you wanna use docker, `docker-compose -f dev-docker-compose.yml up`.
Whenever you add a dependency, you should `docker-compose -f dev-docker-compose
build`
