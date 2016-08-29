module.exports = {
    // 项目名称
    "projectName": "<%= appName %>",
    // 作者信息
    "author": {
        "name": "<%= authorName %>",
        "email": "<%= authorEmail %>"
    },
    // 项目中某个应用名称，用于对于应用中的js，css合并时的处理，对于不同的应用
    // 使用gulp命令需要更改此字段为对应应用的名称
    "appName": "appName",
    "host": "localhost",
    "src": {
        "bower": "./bower_components",
        "css": "./css",
        "scss": "./scss/*.scss",
        "js": "./js/*.js",
        "img": "./img/**/*"
    },
    "dest": {
        "bower": "./assets/lib",
        "css": "./assets/css",
        "js": "./assets/js",
        "img": "./assets/img"
    }
};