# Node and Gulp

NOTE: There is a PDF Version of this documentation available at the bottom of this page. It is much easier to read.

A basic overview of the steps to get up and running with Node and Gulp. Please see [Building for Production](#BuildingForProduction) for instructions how how to release for production.

1. Install [Node Version Manager](#InstallingNodeVersionManager)
2. Install Node (all developers at Event Farm should be using the same node version. At the time of this documentation we are all on version 6.9.4): `nvm install 6.9.4`
3. Set version: `nvm alias default 6.9.4 && nvm use default`
4. Install Gulp globally: `npm install -g gulp`
5. Install Node dependencies: `npm install`
6. Run your first gulp! `gulp` for development, or `gulp --production` for production
7. (Optional) Configure PHPStorm

## Installing Node Version Manager

Please follow the [install script](https://github.com/creationix/nvm#install-script) on the nvm page to get the latest version.

```bash
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.XX.0/install.sh | bash
```

**NOTE: Even though NVM and Node.js are available on Homebrew, you should install it using the command line script instead of Homebrew.**

You must close and reopen your terminal or reset your terminal with the newly included nvm path.

Next, install Node.js. Node plans on releasing LTS versions as even numbered releases, and their shorter term, 'stable-but-short-life' versions will be released as odd numbered releases. This means that even though there are 6.x.x releases available when listing the remote repos from NVM, we want to keep on the latest LTS release in version 4. Please reference the [Node.js Long-term Support documentation](https://github.com/nodejs/LTS/) for more info.

**At the time of writing this document, Event Farm Core is using Node version 6.9.4**

```bash
$ nvm install 6.9.4
Downloading https://nodejs.org/dist/v6.9.4/node-v6.9.4-darwin-x64.tar.gz...
############################################################################### 100.0%
Now using node v6.9.4 (npm v2.15.0)
```

You'll need to tell nvm which version of node.js you'd like to use and that alias aids with that. Default terminal to use the installed node version when using the `node` alias.

```bash
# Set the alias 'default' to Node.js version 6.9.4
$ nvm alias default 6.9.4
$ nvm use default
```

Switch Node.js versions with the use directive.

```bash
$ nvm use default
$ nvm use <alias>
    $ nvm use 6.9.4
    ```

    ## Installing Node Modules

    First thing we need to do is globally install gulp with node. This can be done outside of the core project folder. This is installing node into a version folder under your ~/.nvm directory. For more NVM detail, check out [this blog post](http://blog.eventfarm.com/developers/fresh-mac-now-what-brew-install-everything) on installing Homebrew and NVM.

    ```bash
    $ npm install -g gulp
    ```

    **Note: as you change node versions, you will need to reinstall gulp globally as all global installs are on a per node version basis**

    Call `npm install` from inside the projects root folder and this will install all of the build dependencies into the `node_modules` directory.

    ```bash
    $ cd ~/path/to/project/root
    $ npm install
    ```

    **Note: the node_modules directory should be ignored in version control and should never be committed into history**

    ## Configuring Gulp with PHPStorm

    If you have already installed Node Version Manager and all node dependencies (`cd ~/path/to/core && npm install -g gulp && npm install`) configuring Gulp with PHP storm is actually super easy.

    Clear out any existing task runners loaded in such as Grunt by right clicking on them in the bottom left hand corner and then clicking 'Remove from Sidebar'.

    ![Image of Dependency List](images/2016-03-25/2016-03-25-show-gulp-tasks.png)

    In the project tab, right click on the gulpfile.babel.js in the root directory and click 'Show Gulp Tasks'. You should now see a list of all the possible tasks you can run with gulp.

    **The main task you will be using is 'default'.**

    ## Building For Production

    Building for production is super simple. All you need to do

    ```bash
    $ gulp --production
    ```

    The `--production` flag is key, this will trigger css minimizer and javascript uglifier. This will:

    * Compile and Minimize LESS
    * Concatinate and Uglify Javascript Vendor Files (this builds our 'ef.libs.core-build.js' and 'ef.libs.ng-build.js' files)
    * Compile RequireJS files, run them through Babel, and Uglify

    #### Using PHPStorm to Build for Production

    In order to use PHPStorm to build for production, we have to set up a task in our Run Configurations.

    ![Image of Dependency List](images/2016-03-25/2016-03-25-phpstorm-production-build.png)

    The first thing you need to do is in the top right hand corner of PHPStorm, there is a list of task icons, all the way on the left there is a dropdown arrow. Click `Edit Configurations...`

    ![Image of Dependency List](images/2016-03-25/2016-03-25-phpstorm-production-build-2.png)

    Next, click the (+) and add a new Gulp.js configuration.

    ![Image of Dependency List](images/2016-03-25/2016-03-25-phpstorm-production-build-3.png)

    After naming our configuration 'Production', the first thing we need to do is set our Task to 'default'. After setting the task, the next and most important piece for production building is adding the `--production` flag to the list of Arguments.

    It is also very important to make sure your *Node Interpreter* is set to the Event Farm current node version. The version of Node we are using at Event Farm during the time of writing this document is Node version 6.9.4.

    ## Gulp API

    A brief overview of what is bundled in our gulp build system.


    * [Less](#LessTask)
    * [Sass](#SassTask) (built out but not used until our Bootstrap 4 revamp)
    * [Javascript](#JavascriptTask)
    * [Requirejs](#RequirejsTask)
    * [Server (Browser Sync)](#ServerTask)

    Inside of the `./gulp` directory you will find all the individual gulp tasks and their configurations.

    ### Dependency List

    ![Image of Dependency List](images/2016-03-25/2016-03-25-gulp-dependencies.png)

    ### Tasks

    Running `gulp` alone will run the 'default' task in development mode. In order to run gulp development mode, simply pass the `--production` flag to any gulp task argument and gulp will configure for a 'production' environment.

    The main differences between 'development' and 'production' is that running in production mode will minimize and uglify your CSS and Javascript file.

    The other main difference between running gulp in development and production mode is that in production mode, we are just copying the requirejs files. Running gulp with the production flag will actually compile and optimize our requirejs dependencies.

    ##### Default Task

    ```bash
    $ gulp
    $ gulp --production
    ```
    Running `gulp` alone will run the 'default' task in development mode. This is set in our main gulpfile.babel.js and runs the tasks listed in the array:

    ```javascript
    gulp.task('default', ['less', 'javascript', 'requirejs']);
    ```

    Our default task first runs the ['less'](#LessTask) task, then the ['javascript'](#JavascriptTask) task, then the ['requirejs'](#RequirejsTask) task.

    ##### Watch Task

    ```bash
    $ gulp watch
    ```

    The watch task is perfect for working on asset files and automatically watching for changes. This will trigger either the ['less'](#LessTask) task, ['javascript'](#JavascriptTask) task, or the ['requirejs'](#RequirejsTask) task based on the dependencies that have been modified.

    The configuration for watch is in the base gulpfile.babel.js under the gulp task 'watch'. And the 'watch:<task>' tasks are defined in each respective file in the `./gulp` directory.

        ```javascript
        gulp.task('watch', ['less', 'javascript', 'requirejs'], function () {
        gulp.watch('./app/webroot/less/**/*.less', ['watch:less']);
        gulp.watch('./app/webroot/js/**/*.js', ['watch:javascript']);
        gulp.watch('./app/webroot/js/ng/**/*.js', ['watch:requirejs']);
        });
        ```

        ##### Serve Task

        Before using the `gulp serve` task, you need to set up a config.js file inside of your gulp directory. Please see the bottom of this page for instructions on [how to set up config.js](#Config.js). You need to add the following line:

        ```javascript
        // Change this to your core development domain
        config.proxy = 'core.jraimondi.ef3';
        ```

        Once you have the configuration file open, you can go ahead and run `gulp serve` from the root of the project in terminal, or from the Gulp task runner in PHPStorm.

        ```bash
        $ gulp serve
        ```
        Start a browser sync session and load the `./dist` in the default browser. Automatically watch files for changes and reload assets when they change.


        ##### Less Task

        Default run of less styles

        ```bash
        $ gulp less
        $ gulp less --production
        ```

        The browsers we are prefixing for are defined in the browsers array. The browser definitions are coming from [Browserslist](https://github.com/ai/browserslist)

        ```javascript
        browsers: [
        'last 2 versions',
        'ie >= 9',
        'and_chr >= 2.3'
        ]
        ```

        Compile less files, adds browser prefixes, and include source maps inside a 'maps' directory.

        ##### Sass Task

        Documentation for the Sass task will come when we start using it in our Bootstrap 4 revamp.

        ##### Audit Task

        The audit task is simply to analyze stylesheets. It needs to be called specifically and does not run in any other gulp task besides when it is specifically called.

        Before using the `gulp audit` task, you need to set up a config.js file inside of your gulp directory. Please see the bottom of this page for instructions on [how to set up config.js](#Config.js). You need to add the following line:

        ```javascript
        config.auditFile = './app/webroot/css/ef.css' // Path to stylesheet relative root;
        ```

        ```bash
        $ gulp audit
        ```
        Uses [Parker](https://github.com/katiefenn/parker) to audit sass files.  Parker is a stylesheet analysis tool. It runs metrics on your stylesheets and will report on their complexity.

        Try it, you'll like it.

        ##### Javascript Task

        The javascript is a traditional concat and uglify tool. Our javascript task is mostly used for our vendor file concatenation and not so much for Event Farm specific javascript files.

        ```bash
        $ gulp javascript
        $ gulp javascript --production
        ```

        Running the javascript task in development mode will not run uglify over the files.

        The `./gulp/javascript.js` file is currently configured with babel required, but not piped through our task. If in the future we want to pipe our javascript through babel simply add a pipe in the task before 'uglify()' or 'sourcemaps.write()', for example:

        ```javascript
        gulp.task('javascript:core', function () {
        return gulp.src(libs.core)
        .pipe(sourcemaps.init())
        .pipe(concat('ef.libs.core-build.js'))
        .pipe(babel()) // Add babel() in the pipe before uglify or sourcemaps.write
        .pipe(gulpif(argv.production, uglify()))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./app/webroot/js/'));
        });
        ```

        ##### Requirejs Task

        Running 'requirejs' without the production flag will only copy over the require files instead of actually running requirejs on them. This is done for development purposes because running requirejs is relatively slow, taking about 30 seconds finish processing our files.

        ```bash
        $ gulp requirejs # this simply copies over the requirejs files for development
        $ gulp requirejs --production # this actually builds out the requirejs files
        ```

        We are piping our requirejs files through [Babel](https://babeljs.io/) both in development and production so feel free to use ECMA 2015 syntax if what you are working on is being piped through the requirejs task.


        ## Config.js

        The config.js file is not required for either development or production building. The only tasks that require the config.js file would be `gulp serve` and `gulp audit`.

        To get your config.js file set up, create a new file in your projects root directory gulp (`./gulp/`) called `config.js`.

        Set the contents of config.js as follows, obviously update the proxy to your working copy address:

        ```javascript
        var config = {};

        // Proxy for 'gulp serve'
        config.proxy = 'core.jraimondi.ef3';

        // File you would like to audit with 'gulp audit'
        config.auditFile = './app/webroot/css/ef.css';

        module.exports = config;
        ```

        ## Finally

        If you can just remember the commands `gulp` and `gulp --production`, you'll go places.
