const User = require('../model/user');
const HomeController = require('../controller/home-controller')
const qs = require('qs');
const fs = require('fs');
const {raw} = require("mysql");

class UserController {
    constructor() {
        this.user = new User();
        this.home = new HomeController();
    }
    //show form đăng nhập
    showLoginForm (req, res) {
        fs.readFile('template/login.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    };
    //lấy dữ liệu nhập vào để đối chiếu với database
    login(req, res) {
        let success = false;
        let data = '';
        req.on('data', chuck => {
            data += chuck
        });
        req.on('end', async () => {
            let userInfo = qs.parse(data);
            let dataUser = await this.user.getUser();
            // console.log('dataUser: ' + dataUser)
            for (let user of dataUser) {
                if (userInfo.email === user.email && userInfo.password === user.password) {
                    let role = await this.user.checkRole(user);
                    console.log(role);
                    if (role[0].idrole === 0) {
                        res.writeHead(301, {
                            location: '/admin'
                        });
                        return res.end();
                    } else if (role[0].idrole === 1 && role[1].idrole === 2) {
                        res.writeHead(301, {
                            location: '/ctv'
                        });
                        return res.end();
                    }else if (role[0].idrole === 2){
                        res.writeHead(301, {
                            location: '/'
                        });
                        return res.end();
                    };
                    success = true;
                    break;
                }
            }
            if (success === false){
                console.log('tài khoản không tồn tại!');
            }
        })
    };

    //show form đăng kí
    showResisterForm(req, res) {
        fs.readFile('template/register.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
                this.home.show404Page(req, res);
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        });
    };

    // tạo tài khoản mới
    createUser(req, res) {
        let data = '';
        req.on('data', (chuck) => {
            data += chuck;
        });
        req.on('end', async () => {
            let success = true;
            let user = qs.parse(data);
            let regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!regexPassword.test(user.password)){
                console.log('Mật khẩu phải có hơn 8 kí tự và ít nhất 1 số!');
            }else if(!regexEmail.test(user.email)) {
                console.log('Email chưa đúng định dạng!');
            } else {
                if(user.password !== user.passwordConfirm){
                    console.log('Mật khẩu xác nhận không đúng!');
                }else {
                    let dataUser = await this.user.getUser();
                    for (let users of dataUser) {
                        if(user.email === users.email) {
                            console.log('email đã tồn tại!')
                            success = false;
                        }else if (user.phone === users.phone) {
                            console.log('Số điện thoại đã tồn tại')
                            success = false;
                        }
                    };
                    if (success === true) {
                        this.user.createUser(user);
                        this.user.createRole(user.email);
                        res.writeHead(301, {
                            location: '/register'
                        });
                        return res.end();
                    }
                }
            }
        })
    };

    //Mở trang admin
    showAdminPage(req, res) {
        fs.readFile('template/views/admin.html', 'utf-8', (err, data) => {
            if (err) {
                console.log('show admin page err' + err);
                this.home.show404Page(req, res);
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        });
    };

    //Mở trang cộng tác viên
    showCTVPage(req, res, user) {
        fs.readFile('template/views/ctv.html', 'utf-8', (err, data) => {
            if (err) {
                console.log('show admin page err' + err);
                this.home.show404Page(req, res);
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        });

    }




}
module.exports = UserController;