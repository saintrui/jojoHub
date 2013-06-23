var mysql = require('mysql');
var conn = null;

exports.init = function() {
    conn = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'success',
        database: 'jojo',
    });
    conn.connect();
};

exports.verifyUser = function(params, cb) {
    var sql = 'SELECT * FROM user WHERE email = ? AND password = md5(?)';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getGoods = function(cb) {
    var sql = 'SELECT * FROM goods ORDER BY substring(name,7)';
    console.log(sql);
    conn.query(sql, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getGoodModels = function(params, cb) {
    var sql = 'SELECT * FROM good_model WHERE good_id = ? ORDER BY good_model.id';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getGoodModel = function(params, cb) {
    var sql = 'SELECT * FROM good_model WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.goodsCreate = function(params, cb) {
    var sql = 'INSERT INTO goods SET name = ?, created_at = now(), created_by = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            if (err.number == mysql.ERROR_DUP_ENTRY) {
                cb(1);
                return;
            } else {
                console.log(err);
                throw err;
            }
        }
        cb(0);
    });
};

exports.goodsModelCreate = function(params, cb) {
    var sql = 'INSERT INTO good_model SET good_id = ?, model_name = ?, model_pic = ?, model_details = "{}", created_at = now(), created_by = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            if (err.number == mysql.ERROR_DUP_ENTRY) {
                cb(1);
                return;
            } else {
                console.log(err);
                throw err;
            }
        }
        cb(0);
    });
};

exports.goodsModelUpdate = function(params, cb) {
    var sql = 'UPDATE good_model SET model_details = ?, updated_at = now(), updated_by = ? WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            console.log(err);
            throw err;
        }
        cb();
    });
};

exports.getDailyChangeLogs = function(cb) {
    var sql = 'SELECT b.display_name, date_format(a.changed_at, "%Y-%m-%d") AS changed_date, a.changed_at, c.name, d.model_name, a.age, a.delta FROM kucun_change_log AS a, user AS b, goods AS c, good_model AS d WHERE date(changed_at) > date_add(curDate(), interval -7 day) AND a.good_model_id = d.id AND d.good_id = c.id AND a.changed_by = b.id ORDER BY a.changed_at DESC, b.id, c.name, d.model_name, a.age';
    console.log(sql);
    conn.query(sql, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.changeLogCreate = function(params, cb) {
    var sql = 'INSERT INTO kucun_change_log SET good_model_id = ?, age = ?, delta = ?, changed_by = ?, changed_at = now()';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            if (err.number == mysql.ERROR_DUP_ENTRY) {
                cb(1);
                return;
            } else {
                console.log(err);
                throw err;
            }
        }
        cb(0);
    });
};
// old
exports.reportByTime = function(params, cb) {
    var sql = 'SELECT a.name, DATE_FORMAT(tc_date, "%Y-%m") tc_date, version, version_type FROM product AS a, product_info AS b WHERE a.id = b.product_id AND tc_date >= ? AND tc_date < date_add(?, INTERVAL 1 MONTH) ORDER BY tc_date';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.reportQualityQA = function(start_month, end_month, product_id, cb) {
    var sql = 'SELECT a.name, DATE_FORMAT(tc_date, "%Y-%m") tc_date, version, version_type FROM product AS a, product_info AS b WHERE a.id = b.product_id AND tc_date >= ? AND tc_date < date_add(?, INTERVAL 1 MONTH) ';
    var params = [start_month, end_month];
    if (product_id) {
        sql += ' AND product_id = ? ';
        params.push(product_id);
    }
    sql += ' ORDER BY a.name, tc_date';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.reportQualityDev = function(start_month, end_month, cb) {
    var sql = 'SELECT a.name, b.id prj_id, version, version_type, reason, bugs, blocker_bugs, critical_bugs, pkg_times, pkg_reason, low_value_bugs, review_pass FROM product AS a, product_info AS b WHERE a.id = b.product_id AND tc_date >= ? AND tc_date < date_add(?, INTERVAL 1 MONTH) ';
    var params = [start_month, end_month];
    sql += ' ORDER BY version_type, name';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getUsers = function(cb) {
    var sql = 'SELECT * FROM user';
    console.log(sql);
    conn.query(sql, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getUserById = function(id, cb) {
    var sql = 'SELECT * FROM user WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};


exports.getCategories = function(cb) {
    var sql = 'SELECT * FROM feedback_category';
    console.log(sql);
    conn.query(sql, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getReviewReqs = function(params, cb) {
    var sql = 'SELECT a.name, b.*, c.display_name requester FROM product AS a, product_info AS b, user AS c WHERE a.id = b.product_id AND reviewer_id = ? AND review_pass != true AND b.requester_id = c.id';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getMembers = function(cb) {
    var sql = 'SELECT * FROM member';
    console.log(sql);
    conn.query(sql, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getFeedback = function(params, cb) {
    var sql = 'SELECT * FROM feedback WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getFeedbacks = function(params, cb) {
    var sql = 'SELECT id, subject FROM feedback WHERE product_info_id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getReviewers = function(cb) {
    var sql = 'SELECT * FROM user WHERE role in ("tl", "admin")';
    console.log(sql);
    conn.query(sql, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.updatePasswd = function(params, cb) {
    var sql = 'UPDATE user SET password = md5(?) WHERE password = md5(?) AND id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
                throw err;
        }
        cb(info.affectedRows);
    });
};

exports.updateFeedback = function(params, cb) {
    var sql = 'UPDATE feedback SET subject = ?, description = ? WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
                throw err;
        }
        cb(info.affectedRows);
    });
};

exports.delFeedback = function(params, cb) {
    var sql = 'DELETE FROM feedback WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
                throw err;
        }
        cb(info.affectedRows);
    });
};

exports.updateProduct = function(params, cb) {
    var sql = 'UPDATE product SET name = ?, receiver = ?, prefix = ?, trac_name = ? WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            if (err.number == mysql.ERROR_DUP_ENTRY) {
                cb(1);
            } else {
                throw err;
            }
        }
        cb(0);
    });
};


exports.getSubscribe = function(cb) {
    var sql = 'SELECT * FROM product_subscribe';
    console.log(sql);
    conn.query(sql, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getPrjs = function(type, params, cb) {
    var sql = 'SELECT a.name, b.id, b.version, c.role FROM product AS a, product_info AS b, product_subscribe AS c WHERE a.id = b.product_id AND c.user_id = ? AND c.product_id = b.product_id AND (review_pass is NULL OR review_pass = false) ORDER BY b.product_id, b.version';
    if (type == 'finish')
        sql = 'SELECT a.name, b.id, b.product_id, b.version, c.role FROM product AS a, product_info AS b, product_subscribe AS c WHERE a.id = b.product_id AND c.user_id = ? AND c.product_id = b.product_id AND review_pass = true ORDER BY b.product_id, b.version';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.burnTaskConfirm = function(params, cb) {
    var sql = 'UPDATE burn_disk SET status = "confirm" WHERE prj_id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            throw err;
        }
        cb();
    });
};

exports.burnTaskDone = function(params, cb) {
    var sql = 'UPDATE burn_disk SET status = "done" WHERE prj_id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            throw err;
        }
        cb();
    });
};

exports.getToBurn = function(params, cb) {
    var sql = 'SELECT a.name, b.id, b.version, c.role FROM product AS a, product_info AS b, product_subscribe AS c WHERE a.id = b.product_id AND c.user_id = ? AND c.product_id = b.product_id AND review_pass = true AND b.id NOT IN (SELECT prj_id FROM burn_disk) AND tc_date > "2013-03-31" ORDER BY b.product_id, b.version';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getBurnTasks = function(all, params, cb) {
    var sql = 'SELECT a.name, b.id, b.version, d.status, d.update_time, e.display_name FROM product AS a, product_info AS b, product_subscribe AS c, burn_disk AS d, user AS e WHERE a.id = b.product_id AND b.id = d.prj_id AND c.user_id = ? AND c.product_id = b.product_id AND e.id = d.user_id ORDER BY b.product_id, b.version';
    if (all)
        sql = 'SELECT a.name, b.id, b.version, d.status, d.update_time, e.display_name FROM product AS a, product_info AS b, burn_disk AS d, user AS e WHERE a.id = b.product_id AND b.id = d.prj_id AND e.id = d.user_id ORDER BY b.product_id, b.version';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getBurnTask = function(params, cb) {
    var sql = 'SELECT * FROM burn_disk WHERE prj_id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.prepareBurnInfo = function(params, cb) {
    var sql = 'SELECT * FROM product_info WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results);
    });
};

exports.getPrjInfo = function(params, cb) {
    var sql = 'SELECT a.name, a.receiver, b.* FROM product AS a, product_info AS b WHERE a.id = b.product_id AND b.id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results[0]);
    });
};

exports.getUserProductInfo = function(params, cb) {
    var sql = 'SELECT c.name from product_subscribe AS a, product_info AS b, product AS c WHERE user_id = ? AND a.product_id = b.product_id AND b.product_id = c.id';
    console.log(sql);
    conn.query(sql, params, function(err, results, fields) {
        if (err) {
            throw err;
        }
        cb(results[0]);
    });
};

exports.addProduct = function(params, cb) {
    var sql = 'INSERT INTO product SET name = ?, receiver = ?, prefix = ?, trac_name = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            if (err.number == mysql.ERROR_DUP_ENTRY) {
                cb(1);
                return;
            } else {
                console.log(err);
                throw err;
            }
        }
        cb(0);
    });
};

exports.addBurnTask = function(params, cb) {
    var sql = 'INSERT INTO burn_disk SET prj_id = ?, user_id = ?, status = "new", er_tags = ?, doc_url = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            if (err.number == mysql.ERROR_DUP_ENTRY) {
                cb(1);
                return;
            } else {
                console.log(err);
                throw err;
            }
        }
        cb(0);
    });
};

exports.addSubscribe = function(params, cb) {
    var sql = 'INSERT INTO product_subscribe SET user_id = ?, product_id = ?, role = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            if (err.number == mysql.ERROR_DUP_ENTRY) {
                cb(1);
                return;
            } else {
                console.log(err);
                throw err;
            }
        }
        cb(0);
    });
};

exports.addUser = function(params, cb) {
    var sql = 'INSERT INTO user SET login_name = ?, password = md5(?), display_name = ?, role = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            if (err.number == mysql.ERROR_DUP_ENTRY) {
                cb(1);
                return;
            } else {
                console.log(err);
                throw err;
            }
        }
        cb(0);
    });
};

exports.prjNew = function(params, cb) {
    var sql = 'INSERT INTO product_info SET product_id = ?, version = ?, version_type = ?';
    console.log(sql);
    console.log(params);
    conn.query(sql, params, function(err, info) {
        if (err) {
            if (err.number == mysql.ERROR_DUP_ENTRY) {
                cb(1, 0);
                return;
            } else {
                console.log(err);
                throw err;
            }
        }
        cb(0, info.insertId);
    });
};

exports.prjUpdateKickoff = function(params, cb) {
    var sql = 'UPDATE product_info SET member_pm_id = ?, member_arch_id = ?, member_dl_id = ?, plan_cc_date = ?, plan_tc_date = ? WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.prjUpdatePC = function(params, cb) {
    var sql = 'UPDATE product_info SET prd_url = ?, prd_signoff_url = ?, prd_review = ? WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.prjUpdateDC = function(params, cb) {
    var sql = 'UPDATE product_info SET ui_design_url = ?, arch_design_url = ?, detail_design_url = ?, db_design_url = ?, db_design_signoff_url = ?, ui_design_signoff_url = ?, arch_design_signoff_url = ?, design_signoff_url = ?, design_review = ? WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.prjUpdateCC = function(cc_date, params, cb) {
    var sql = 'UPDATE product_info SET test_plan_url = ?, case_cross_review_url = ?, case_review_url = ?, case_signoff_url = ?';
    if (cc_date != undefined)
        sql += ' ,cc_date = "' + cc_date + '"';
    sql += ' WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.prjUpdateTC = function(tc_date, params, cb) {
    var sql = 'UPDATE product_info SET bugs = ?, blocker_bugs = ?, critical_bugs = ?, low_value_bugs = ?, pkg_times = ?, pkg_reason = ?, rnd_1st_end_date = ?, rnd_2nd_end_date = ?, rnd_3rd_end_date = ?, bug_review_url = ?, test_report_url = ?, report_signoff_url = ? ';
    // the normal user can't change tc_date, so it is undefined
    if (tc_date != undefined)
        sql += ', tc_date = "' + tc_date + '"';
    sql += ' WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.prjUpdateTDR = function(params, cb) {
    var sql = 'UPDATE product_info SET tdr_mail = ? WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.prjUpdatePatchTC = function(tc_date, test_case, prj_id, params, cb) {
    var sql = 'UPDATE product_info SET bugs = ?, blocker_bugs = ?, critical_bugs = ?, low_value_bugs = ?, prd_url = ?, pkg_times = ?, pkg_reason = ?, test_report_url = ?, reason = ? ';
    if (tc_date != undefined) {
        sql += ', tc_date = ?';
        params.push(tc_date);
    }
    if (test_case != undefined) {
        sql += ', test_case = ?';
        params.push(test_case);
    }
    sql += ' WHERE id = ?';
    params.push(prj_id);
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.prjAddFeedback = function(params, cb) {
    var sql = 'INSERT INTO feedback SET subject = ?, description = ?, product_info_id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        var dup = 0;
        if (err) {
            if (err.number == mysql.ERROR_DUP_ENTRY) {
                dup = 1;
            } else {
                console.log(err);
                throw err;
            }
        }
        cb(dup);
    });
};

exports.reviewRequest = function(params, cb) {
    var sql = 'UPDATE product_info SET reviewer_id = ?, review_req_date = now() WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.reviewConfirm = function(params, cb) {
    var sql = 'UPDATE product_info SET reviewer_id = ?, review_pass = ?, remark = ?, review_date = now() WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.prjUpdateCCPassMail = function(params, cb) {
    var sql = 'UPDATE product_info SET cc_date = now(), cc_pass_mail = ? WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.prjUpdateTCMail = function(params, cb) {
    var sql = 'UPDATE product_info SET tc_date = now(), tc_mail = ? WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.prjUpdateCCBackMail = function(params, cb) {
    var sql = 'UPDATE product_info SET cc_back_mail = ? WHERE id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err)
            throw err;
        cb();
    });
};

exports.getNewBurnTask = function(cb) {
    var sql = 'SELECT c.name, c.prefix, c.trac_name, a.prj_id, a.er_tags, a.doc_url, b.* FROM burn_disk a, product_info b, product c WHERE a.prj_id = b.id AND b.product_id = c.id AND status = "new"';
    console.log(sql);
    conn.query(sql, function(err, info) {
        if (err)
            throw err;
        cb(info);
    });
};

exports.burnTaskProcessing = function(params, cb) {
    var sql = 'UPDATE burn_disk SET status = "download" WHERE prj_id = ?';
    console.log(sql);
    conn.query(sql, params, function(err, info) {
        if (err) {
            throw err;
        }
        cb();
    });
};
