import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userName: 'noUser',
    userId: 123,
    userRole: 'norole',
    selectCamName: '',
    camActiveName: 'first',
    devRouter: '0',
    alarmActiveName: 'first'
  },
  mutations: {
    setUserName (state, msg) {
      state.userName = msg
    },
    setUserId (state, msg) {
      state.userId = msg
    },
    setUserRole (state, msg) {
      state.userRole = msg
    },
    setCamName (state, msg) {
      state.selectCamName = msg
    },
    setCamActiveName (state, msg) {
      state.camActiveName = msg
    },
    setDevRouter (state, msg) {
      state.devRouter = msg
    },
    setAlarmActiveName (state, msg) {
      state.alarmActiveName = msg
    }
  }
})

export default store
