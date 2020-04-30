![logo](docs/fortune_logo.PNG)

Purdue University CS30700: Software Engineering I

Spring 2020

Instructor: Dr. Jeff Turkstra (jeff@purdue.edu)

Project Coordinator: Szu-Kai Yang (yang878@purdue.edu)


Team 11:

Ryan Huff (huff44@purdue.edu)

Sam Kravitz (skravitz@purdue.edu)

Akash Lankala (alankala@purdue.edu)

Raziq Raif Ramli (mramli@purdue.edu)

Tyler Stanish (tstanish@purdue.edu)

Blake Steel (bsteel@purdue.edu)


Frontend
---------

To run the frontend, read client-react/README.md
If `npm run` in the client-react directory fails, try `npm install` in the client-react directory.
If npm doesn't work in general, you may not have Node installed. You’ll need to have Node 8.16.0 or Node 10.16.0 or later version on your local development machine


Docker
--------
If you wanna use docker for an oh-so-clean, system-dependency-free, and effortless testing setup, run `docker-compose -f dev-docker-compose.yml up` to spin up a local db, api, and client.  Whenever you add a dependency to
package.json or requirements.txt, you should rebuild: `docker-compose -f dev-docker-compose.yml build`.

You can run client tests with `docker-compose -f testing-docker-compose.yml run
client`

And api tests with `docker-compose -f testing-docker-compose.yml run api`

Debugging with docker
---------------------
You can debug JS on the browser. If you wanna debug Python, `docker attach
<container id>`. When you hit a `breakpoint()` it'll drop you into pdb.
