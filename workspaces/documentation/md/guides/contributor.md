...

## Development

The following Git command will copy the entire Git project to your local machine,
complete with examples, tests, and documentation:

```shell
git clone https://github.com/moviemasher/moviemasher.js.git
```

The following NPM commands can be executed to install all needed dependencies, build
JavaScript from the TypeScript codebase, and launch a local development server:

```shell
npm install
npm run build
npm start
```

You can then load Movie Masher by navigating your web browser to
[http://localhost:8570](http://localhost:8570) and supplying any username/password
combination when prompted. When you're done exploring, execute the follow command to stop the server and clean up:

```shell
npm install
npm run build
npm run stop
```