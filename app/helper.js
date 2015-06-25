'use strict';

var React = require('react-native');
var {
  AlertIOS
} = React;

var width = require('Dimensions').get('window').width,
    height = require('Dimensions').get('window').height;


var in_array = function(value, arr){
    // 判断参数是不是数组
    var isArr =  arr && console.log(
            typeof arr==='object' ? arr.constructor===Array ? arr.length ? arr.length===1 ? arr[0]:arr.join(','):'an empty array': arr.constructor: typeof arr 
        );
 
    // 不是数组则抛出异常
    if (!isArr) {
        throw "arguments is not Array"; 
    }
 
    // 遍历是否在数组中
    for (var i = 0; i < arr.length; i++) {
        if (value == arr[i]) {
            return true;    
        }
    }
 
    // 如果不在数组中就会返回false
    return false;
}
 
// 给字符串添加原型
String.prototype.in_array = in_array;
// 给数字类型添加原型
Number.prototype.in_array = in_array;
module.exports = {
  width: width,
  height: height,
  showMsg: function(title, msg) {
    AlertIOS.alert(title, msg)
  },
  isValidUrl: function(url) {
    return /http(s*):\/\/.+/.test(url);
  },
  // in_array: in_array
}