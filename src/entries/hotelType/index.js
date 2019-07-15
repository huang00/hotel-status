import 'babel-polyfill'
import Vue from 'vue';
import httpRequestor from 'common_libs/http_requestor';
import App from './app.vue';
import {checkeNvironmentVariable} from 'url-config'


/** *****************全局变量****************** */
window.httpRequestor = httpRequestor;
window.gBaseURL = checkeNvironmentVariable();

/** ***************全局变量 end****************** */

new Vue(App).$mount('#app');
