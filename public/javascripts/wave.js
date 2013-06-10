//将form转为AJAX提交
function ajaxSubmit(frm, fn) {
    var dataPara = getFormJson(frm);
    //alert(JSON.stringify(dataPara));
    $.ajax({
        url: frm.action,
        type: frm.method,
        data: dataPara,
        success: fn
    });
}

//将form中的值转换为键值对。
function getFormJson(frm) {
    var o = {};
    var a = $(frm).serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });

    return o;
}

function xhrGoodsCreate() {
    $('#form_goods_create').bind('submit', function(){
        ajaxSubmit(this, function(data) {
            var err = data['err'];
            if (err) {
                alert(data['msg']);
            } else {
                $('#res_goods_create').css({visibility:'visible'});
                $('#res_goods_create').animate({opacity:1});
                setTimeout(function() {
                    $('#res_goods_create').animate({opacity:0});
                }, 3000);
            }
            return false;
        });
        return false;
    });
}

function xhrModelAdd(counter) {
    var res_id = '#res_model_add_'+counter;
    $(res_id).attr('class', 'text-info');
    $(res_id).html('please wait...');
    $('#form_model_add_'+counter).bind('submit', function(){
        ajaxSubmit(this, function(data) {
            var err = data['err'];
            if (err) {
                $(res_id).attr('class', 'text-error');
                $(res_id).html(data['msg']);
            } else {
                location.reload(true);
                $(res_id).attr('class', 'text-success');
                $(res_id).html('success');
            }
            return false;
        });
        return false;
    });
}

function xhrModelUpdate(counter) {
    var res_id = '#res_model_update_'+counter;
    $(res_id).attr('class', 'text-info');
    $(res_id).html('please wait...');
    $('#form_model_update_'+counter).bind('submit', function(){
        ajaxSubmit(this, function(data) {
            var err = data['err'];
            if (err) {
                $(res_id).attr('class', 'text-error');
                $(res_id).html(data['msg']);
            } else {
                $(res_id).attr('class', 'text-success');
                $(res_id).html('success');
                $('#input_kucun_' + counter).val(data['new_kucun']);
            }
            return false;
        });
        return false;
    });
}

function xhrModelCreate(counter) {
    var res_id = '#res_model_create';
    $(res_id).attr('class', 'text-info');
    $(res_id).html('please wait...');
    $('#form_model_create').bind('submit', function(){
        ajaxSubmit(this, function(data) {
            var err = data['err'];
            if (err) {
                $(res_id).attr('class', 'text-error');
                $(res_id).html(data['msg']);
            } else {
                location.reload(true);
                $(res_id).attr('class', 'text-success');
                $(res_id).html('success');
            }
            return false;
        });
        return false;
    });
}

function xhrSetting(section) {
    if ('update_account' == section) {
        var new_passwd = $('#new_passwd').attr('value');
        var confirm_passwd = $('#confirm_passwd').attr('value');
        if (new_passwd != confirm_passwd) {
            alert('两次输入密码不一样');
            // avoid really submit
            $('#form_'+section).bind('submit', function(){
                return false;
            });
            return false;
        } else if (new_passwd.length == 0) {
            alert('密码不能为空');
            // avoid really submit
            $('#form_'+section).bind('submit', function(){
                return false;
            });
            return false;
        }
    }
    $('#form_'+section).bind('submit', function(){
        ajaxSubmit(this, 0, function(data) {
            var err = data['err'];
            if (err) {
                alert(data['msg']);
            } else {
                $('#res_'+section).css({visibility:'visible'});
                $('#res_'+section).animate({opacity:1});
                setTimeout(function() {
                    $('#res_'+section).animate({opacity:0});
                }, 3000);
            }
        });
        return false;
    });
}

function xhrSendMail(section, prj_info_id) {
    $('#form_'+section).bind('submit', function(){
        ajaxSubmit(this, prj_info_id, function(data) {
            var err = data['err'];
            if (err) {
                alert(data['msg']);
            } else {
                $('#close_btn_'+section).click();
            }
        });
        return false;
    });
}

function xhrFeedback(section) {
    if ('feedback_del' == section) {
        if (!confirm('Delete the feedback?')) {
            $('#form_'+section).bind('submit', function(){
                return false;
            });
            return false;
        }
    }
    $('#form_'+section).bind('submit', function(){
        ajaxSubmit(this, 0, function(data) {
            var err = data['err'];
            if (err) {
                alert(data['msg']);
            } else {
                $('#res_'+section).css({visibility:'visible'});
                $('#res_'+section).animate({opacity:1});
                setTimeout(function() {
                    $('#res_'+section).animate({opacity:0});
                }, 3000);
            }
        });
        return false;
    });
}
