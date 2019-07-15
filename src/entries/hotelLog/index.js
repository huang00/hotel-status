import 'babel-polyfill'
import Vue from 'vue';
import httpRequestor from 'common_libs/http_requestor';
import {checkeNvironmentVariable} from 'url-config'
import App from './app.vue';

/** *****************全局变量****************** */
window.httpRequestor = httpRequestor;
window.gBaseURL = checkeNvironmentVariable();

/** ***************全局变量 end****************** */

new Vue(App).$mount('#app');
