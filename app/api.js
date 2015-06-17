'use strict';
var HOST_URI = 'http://www.zhiribao.com/api/v1/';
// category
var Categories = 'categories';
var ProductList = 'products?offset=20';
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
    return HOST_URI + ProductList + _obj2uri(o);
}


module.exports = {
    getAllCategory: _getAllCategory,
    getProductList: _getProductList,
};