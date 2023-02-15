import { createApp } from '../../lib/guide-mini-vue.esm.js'
import { App } from './App.js'
console.log(123);
const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)