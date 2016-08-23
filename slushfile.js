/*
 * slush-g-test
 * https://github.com/AngelZou/slush-g-test
 *
 * Copyright (c) 2016, angelzou
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || ''
    };
})();

var prompts = [{
        name: 'appName',
        message: '项目名?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: '项目描述?'
    }, {
        name: 'appVersion',
        message: '项目版本号?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: '作者名称?',
        default: defaults.authorName
    }, {
        name: 'authorEmail',
        message: '作者邮箱?',
        default: defaults.authorEmail
    }, {
        name: 'userName',
        message: 'Github用户名?',
        default: defaults.userName
    }, {
        type: 'confirm',
        name: 'moveon',
        message: '继续?'
    }];

gulp.task('default', function (done) {
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            gulp.src(__dirname + '/templates/**')
                .pipe(template(answers))
                .pipe(rename(function (file) {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});

gulp.task('op-app', function(done) {
    var pageName = gulp.args[0];
    if (!pageName) {
        console.log('op app name is required');
        done();
        return;
    }
    prompts[0] = {
        name: 'appName',
        message: '应用名?',
        default: pageName
    };
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            gulp.src(__dirname + '/modules/opapp/**')
                .pipe(template(answers))
                .pipe(rename(function (file) {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./src/' + pageName + '/'))
                .pipe(gulp.dest('./src/' + pageName + '/'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });

});