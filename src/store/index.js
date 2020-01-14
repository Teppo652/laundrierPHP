import Vuex from 'vuex'
import Vue from 'vue'
import alldata from './modules/alldata'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


// Create store
export default new Vuex.Store({
  modules: {
    alldata
  },
  strict: debug
})