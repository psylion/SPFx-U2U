'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

//custom imports
const typedoc = require("gulp-typedoc");
const spsync = require('gulp-spsync-creds').sync;

//default configuration
const deployFolder = require('./config/copy-assets.json');
//custom configuration
const spLocation = require('./config/deploy-spsite.json');
const credentials = require('./config/deploy-credentials.json');

//add custom task
addDocumentationTask();
addDeployBundleTask();
addDeployPackageTask();

//default init
build.initialize(gulp);

function addDocumentationTask() {

    const documentationSubTask = build.subTask('typedoc', (gulp, buildOptions, done) => {
        // Write the code for the documentation gulp task
        return gulp.src(["src/**/*.ts"])
            .pipe(typedoc({
                // TypeScript options (see typescript docs) 
                module: "commonjs",
                target: "es5",
                includeDeclarations: true,

                // Output options (see typedoc docs) 
                out: "./out",

                // TypeDoc options (see typedoc docs) 
                name: "SPFx web part documentation",
                experimentalDecorators: true,
                ignoreCompilerErrors: true,
                excludeExternals: true,
                "jsx": "react",
                version: true
            }));
    });

    const documentationTask = build.task('docs-generation', documentationSubTask);

    // Execute after all tasks
    build.rig.addPostBuildTask(documentationTask);
}

function addDeployBundleTask() {

    build.task('deploy-bundle', {
        execute: (config) => {
            return new Promise((resolve, reject) => {
                const folderLocation = `./${deployFolder.deployCdnPath}/**/*.js`;
                console.log(`Syncing files to ${spLocation.SitePath}/${spLocation.FolderPath}`);
                return gulp.src(folderLocation)
                    .pipe(spsync({
                        "username": credentials.UserName,
                        "password": credentials.PassWord,
                        //"site": "https://<tenant>.sharepoint.com/<relative-site-path>",
                        "site": spLocation.SitePath,
                        "libraryPath": spLocation.FolderPath,
                        "publish": true
                    }))
                    .on('finish', resolve);
            });
        }
    });
}

function addDeployPackageTask() {

    build.task('deploy-package', {
        execute: (config) => {
            return new Promise((resolve, reject) => {
                const pkgFile = require('./config/package-solution.json');
                const folderLocation = `./sharepoint/${pkgFile.paths.zippedPackage}`;
                var pass = null;
                return gulp
                    .src(folderLocation)
                    .pipe(spsync({
                        "username": credentials.UserName,
                        "password": credentials.PassWord,
                        //"site": "https://<tenant>.sharepoint.com/<relative-catalog-site>",
                        "site": spLocation.AppCatalogPath,
                        "libraryPath": "AppCatalog",
                        "publish": true
                    }))
                    .on('finish', resolve);
            });
        }
    });
}