var db = require('./db.js');
db.init();
var WELCOME_STR = 'JoJo Hub';

getUserId = function(req) {
    return getCookieInfo(req)['id'];
};

getCookieInfo = function(req) {
    console.log('cookie: ' + req.headers.cookie);
    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function(cookie) {  
        var parts = cookie.split('=');
        cookies[parts[0].trim()] = (parts[1] || '').trim();  
    });
    return cookies;
};

isLogin = function(req) {
    var cookies = getCookieInfo(req);
    return cookies['id'] > 0 ? true : false;
};

exports.login = function(req, res) {
    res.render('login', {});
};

exports.logout = function(req, res) {
    res.cookie('id', '', {maxAge:0});
    res.cookie('email', '', {maxAge:0});
    res.cookie('display_name', '', {maxAge:0});
    res.redirect('/login');
};

exports.doLogin = function(req, res) {
    var p = req.body;
    var email = p.email;
    var password = p.password;
    console.log(p);
    db.verifyUser([email, password], function(rows) {
        if (rows.length != 1) {
            res.render('login', {login_failed:true});
        } else {
            var row = rows[0];
            console.log(row);
            var max_age = 24*3600*1000;
            //var expire_date = (new Date(Date.now() + max_age)).toGMTString();
            //var cookie = ['id='+row.id, 'login_name='+row.login_name, 'display_name='+row.display_name];
            //res.setHeader('Set-Cookie', cookie);
            res.cookie('id', row.id, {maxAge:max_age});
            res.cookie('email', row.email, {maxAge:max_age});
            res.cookie('display_name', row.display_name, {maxAge:max_age});
            res.cookie('role', row.role, {maxAge:max_age});
            res.redirect('/');
        }
    });
};

exports.index = function(req, res) {
    if (!isLogin(req)) {
        res.redirect('/login');
        return;
    }
    res.redirect('/goods/manage');
};

exports.goodsManageDo = function(req, res) {
    if (!isLogin(req)) {
        res.redirect('/login');
        return;
    }
    var action = req.params.action;
    var p = req.body;
    console.log(p);
    if (action == 'create') {
        // 创建商品，如女圆帽
        db.goodsCreate([p.name, getUserId(req)], function(dup) {
            if (dup) {
                res.json({err:1, msg:'商品[' + p.name + ']已经存在'});
            } else {
                res.json({err:0});
            }
        });
    } else if (action == 'model_create') {
        // 创建款式，如牵牛花
        db.goodsModelCreate([p.gid, p.model_name, getUserId(req)], function(dup) {
            if (dup) {
                res.json({err:0, msg:'[' + p.model_name + '] 已经存在'});
            } else {
                res.json({err:0});
            }
        });
    } else if (action == 'model_add') {
        // 添加年龄段，如1-2Y
        if (isNaN(parseInt(p.kucun))) {
            res.json({err:1, msg:'库存必须为数字'});
            return;
        }
        if (p.key.trim().length < 1) {
            res.json({err:1, msg:'年龄段不能为空'});
            return;
        }
        db.getGoodModel([p.model_id], function(rows) {
            // TBD rows length
            var model = rows[0];
            var detail = JSON.parse(model.model_details);
            if (detail[p.key] != undefined) {
                res.json({err:1, msg:'[' + p.key + '] 已存在'});
            } else {
                detail[p.key] = parseInt(p.kucun);
                db.goodsModelUpdate([JSON.stringify(detail), getUserId(req), p.model_id], function() {
                    res.json({err:0});
                });
            }
        });
    } else if (action == 'model_update') {
        // 修改库存数量
        if (isNaN(parseInt(p.delta))) {
            res.json({err:1, msg:'库存增减值[' + p.delta + ']不是数字'});
            return;
        }
        db.getGoodModel([p.model_id], function(rows) {
            // TBD rows length
            var model = rows[0];
            var detail = JSON.parse(model.model_details);
            if (undefined == detail[p.key]) {
                res.json({err:1, msg:'[' + p.key + '] 不存在'});
            } else {
                detail[p.key] = parseInt(detail[p.key]) + parseInt(p.delta);
                db.goodsModelUpdate([JSON.stringify(detail), getUserId(req), p.model_id], function() {
                    res.json({err:0, new_kucun:detail[p.key]});
                });
            }
        });
    } else {
        res.json({err:1, msg:'Invalid action: ' + action});
    }
};

exports.goodsManage = function(req, res) {
    if (!isLogin(req)) {
        res.redirect('/login');
        return;
    }
    var action = req.params.action;
    var query = req.query;
    if (action == 'create') {
        db.getGoods(function(rows) {
            console.log(rows);
            res.render('goods_create', {goods:rows});
        });
    } else if (action == 'manage') {
        var gid = req.query['gid'];
        db.getGoods(function(goods) {
            console.log(goods);
            if (undefined == gid && goods.length > 0) {
                gid = goods[0].id;
            }
            db.getGoodModels([gid], function(models) {
                res.render('goods_manage', {goods:goods, models:models, gid:gid});
            });
        });
        /*var query = req.query;
        var type = query['type'];
        if (type != 'unfinish' && type != 'finish') {
            res.render('error', {msg:'Bad request: type is invalid.'});
            return;
        }
        db.getPrjs(type, [getUserId(req)], function(rows) {
            console.log(rows);
            var valid = false;
            var prj_id = query['prj'];
            if (rows.length) {
                if (!prj_id) {
                    prj_id = rows[0].id;
                    valid = true;
                } else {
                    rows.forEach(function(row) {
                        if (prj_id == row.id) {
                            valid = true;
                            return;
                        }
                    });
                }
            } else {
                prj_id = null;
                valid = true;
            }
            if (valid) {
                if (rows.length) {
                    db.getPrjInfo([prj_id], function(info) {
                        console.log(info);
                        db.getReviewers(function(reviewers) {
                            console.log(reviewers);
                            db.getCategories(function(categories) {
                                db.getMembers(function(members) {
                                    db.getFeedbacks([prj_id], function(feedbacks) {
                                        res.render('prj_show', {projects:rows, const_type:type, const_prj_info:info, reviewers:reviewers, categories:categories, members:members, feedbacks:feedbacks, cookie:getCookieInfo(req)});
                                    });
                                });
                            });
                        });
                    });
                } else {
                    res.render('prj_show', {projects:rows, const_type:type});
                }
            } else {
                res.render('error', {msg:'Bad request: params are invalid or no privilege'});
            }
        });*/
    } else {
        res.render('error', {msg:'404 Not Found'});
    }
};
