const fs = require('fs')

class HomeController {
    constructor() {
    }

    //Show trang chủ
    showHomePage (req, res) {
        fs.readFile('template/home.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    };

    //Show trang lỗi
    show404Page(req, res) {
        fs.readFile('template/404.html', 'utf-8', (err, data) => {
            if(err) {
                console.log('show 404 error: ' + err);
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    }
}
module.exports = HomeController;