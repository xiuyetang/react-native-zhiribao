'use strict';
var HOST = 'http://www.zhiribao.com';
var HOST_URI = HOST +　'/api/v1/';
// category
var Categories = 'categories';
var ProductList = 'products';
// 获取用户信息
var UserInfo = 'member';
function _obj2uri(obj){
    return Object.keys(obj).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
    }).join('&');
}


function _getAllCategory(){
    return HOST_URI+Categories;
}


function _getProductList(o){
    return HOST_URI + ProductList + "?" + _obj2uri(o);
}

function _getImage(source) {
    //return 'http://www.zhiribao.com/upload/' + source + "!"+ 80 * 2 + "_"+ 80 * 2 +".jpg";
    return HOST　+ '/upload/' + source;
}


module.exports = {
    getAllCategory: _getAllCategory,
    getProductList: _getProductList,
    getImage      :_getImage
};