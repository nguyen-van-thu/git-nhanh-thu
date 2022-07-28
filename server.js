const http = require('http');
const fs = require('fs');
const url = require('url')
const qs = require('qs');
// const LoginController = require('./controller/login-controller.js')
const UserController = require('./controller/user-controller')
const HomeController = require('./controller/home-controller')
const TagsController = require('./controller/Tags-controller')
const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css",
    "min.js": "text/javascript",
    "js.map": "text/javascript",
    "css.map": "text/css",
    "min.css": "text/css",
    "jpg": "image/jpg",
    "png": "image/png",
    "gif": "image/gif",
    "woff": "text/html",
    "ttf": "text/html",
    "woff2": "text/html",
    "eot": "text/html",
};

// let loginController = new LoginController();
let usercontroller = new UserController();
let homeController = new HomeController();
let tagsController = new TagsController();

let server = http.createServer((req, res) => {
    let urlParse = url.parse(req.url);
    let urlPart = urlParse.pathname;
    let method = req.method;

    let filesDefences = req.url.match(/\.js|.css|.jpg|.png|.gif|min.js|js.map|min.css|.css.map|.woff|.ttf|.woff2|.eot/);
    if (filesDefences) {
        let filePath = filesDefences[0].toString();
        let extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        // console.log(extension);
        if (filePath.includes('/')){
            extension = mimeTypes[filesDefences[0].toString().split('/')[1]];
        }
        if (extension.includes('?')){
            extension = extension.split('?')[0];

        }

        res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + '/template/' + req.url).pipe(res);
    }else {
    switch (urlPart) {
        case 'dasda' :
            homeController.showHomePage(req,res);
            break;
        case '/login' :
            if(method === 'GET'){
                usercontroller.showLoginForm(req, res);
            }else {
                usercontroller.login(req, res);
            }
            break;
        case '/register':
            if (method === 'GET'){
                usercontroller.showResisterForm(req, res);

            }else {
                usercontroller.createUser(req, res);
            }
            break;
        case '/admin':
            usercontroller.showAdminPage(req, res);
            break;
        case '/ctv':
            usercontroller.showCTVPage(req, res);
            break;
        case '/':
            tagsController.showTangs(req,res);
            break;
        case '/creattag':
            if(method === 'GET'){
                tagsController.showaddTags(req,res);
            }else {
                tagsController.createTags(req,res);
            }
            break;
        case '/delete':
            if(method ==='GET'){
                let query1 = qs.parse(urlParse.query);
                let idDelete = query1.id;
                tagsController.deleteTags(req,res,idDelete)
                res.end()
            }
            break;

    }
}});

server.listen(8080, () => {
    console.log('server running is localhost:8080 ');
})
