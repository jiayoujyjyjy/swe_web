import Vue from 'vue'
import Router from 'vue-router'
// 登录及主页
const Login = r => require.ensure([], () => r(require('@/components/login')), 'Login')
const Home = r => require.ensure([], () => r(require('@/components/home')), 'Home')
// 设备信息
const DeviceInfo = r => require.ensure([], () => r(require('@/components/home/deviceInfo')), 'deviceInfo')
// 设备管理
const DevmanageBase = r => require.ensure([], () => r(require('@/components/home/devicemanage/devmanageBase')), 'devmanageBase')
const DeviceList = r => require.ensure([], () => r(require('@/components/home/devicemanage/deviceList')), 'deviceList')
const Datachart = r => require.ensure([], () => r(require('@/components/home/devicemanage/datachart')), 'datachart')
const DeviceAnalysisBase = r => require.ensure([], () => r(require('@/components/home/devicemanage/devAnalysis/deviceAnalysisBase')), 'deviceAnalysisBase')
const CityAna = r => require.ensure([], () => r(require('@/components/home/devicemanage/devAnalysis/cityAna')), 'cityAna')
const TagAna = r => require.ensure([], () => r(require('@/components/home/devicemanage/devAnalysis/tagAna')), 'tagAna')
// 视频监控
const CameraBase = r => require.ensure([], () => r(require('@/components/home/video/cameraBase')), 'cameraBase')
const CameraList = r => require.ensure([], () => r(require('@/components/home/video/cameraList')), 'cameraList')
const Player = r => require.ensure([], () => r(require('@/components/home/video/player')), 'player')
const EzvizCfg = r => require.ensure([], () => r(require('@/components/home/video/ezvizCfg')), 'ezvizCfg')
// 客户管理
const ClientBase = r => require.ensure([], () => r(require('@/components/home/client/clientBase')), 'clientBase')
const ClientList = r => require.ensure([], () => r(require('@/components/home/client/clientList')), 'clientList')
const ClientAnalysisBase = r => require.ensure([], () => r(require('@/components/home/client/clientAnalysis/clientAnalysisBase')), 'clientAnalysisBase')
const ClientCityAna = r => require.ensure([], () => r(require('@/components/home/client/clientAnalysis/clientCityAna')), 'clientCityAna')
const IncomeAna = r => require.ensure([], () => r(require('@/components/home/client/clientAnalysis/incomeAna')), 'incomeAna')
// 用户管理
const UserBase = r => require.ensure([], () => r(require('@/components/home/user/userBase')), 'userBase')
const UserList = r => require.ensure([], () => r(require('@/components/home/user/userList')), 'userList')
const UserAnaBase = r => require.ensure([], () => r(require('@/components/home/user/userAna/userAnaBase')), 'userAnaBase')
const UserTimeInterrval = r => require.ensure([], () => r(require('@/components/home/user/userAna/userTimeInterrval')), 'userTimeInterrval')
const PowerAna = r => require.ensure([], () => r(require('@/components/home/user/userAna/powerAna')), 'powerAna')
const ChargingRecord = r => require.ensure([], () => r(require('@/components/home/user/userAna/chargingRecord')), 'chargingRecord')
const RechargeRecord = r => require.ensure([], () => r(require('@/components/home/user/userAna/rechargeRecord')), 'rechargeRecord')
// 报警信息
const AlarmBase = r => require.ensure([], () => r(require('@/components/home/alarm/alarmBase')), 'alarmBase')
const AlarmHistory = r => require.ensure([], () => r(require('@/components/home/alarm/alarmHistory')), 'alarmHistory')
const AlarmNow = r => require.ensure([], () => r(require('@/components/home/alarm/alarmNow')), 'alarmNow')
const AlarmContact = r => require.ensure([], () => r(require('@/components/home/alarm/alarmContact')), 'alarmContact')
// 资金结算
const AccountBase = r => require.ensure([], () => r(require('@/components/home/account/accountBase')), 'accountBase')
const AccountList = r => require.ensure([], () => r(require('@/components/home/account/accountList')), 'accountList')
const TradList = r => require.ensure([], () => r(require('@/components/home/account/tradList')), 'TradList')
// 数据概况
const OverviewBase = r => require.ensure([], () => r(require('@/components/home/overView/overviewBase')), 'overviewBase')
const DeviceOverview = r => require.ensure([], () => r(require('@/components/home/overView/deviceOverview')), 'deviceOverview')
const UserOverview = r => require.ensure([], () => r(require('@/components/home/overView/userOverview')), 'userOverview')
const ClientOverview = r => require.ensure([], () => r(require('@/components/home/overView/clientOverview')), 'clientOverview')
const AccountOverview = r => require.ensure([], () => r(require('@/components/home/overView/accountOverview')), 'accountOverview')
// 系统设置
const GlobalSettingBase = r => require.ensure([], () => r(require('@/components/home/globalSetting/globalSettingBase')), 'globalSettingBase')
const SystemUserCenter = r => require.ensure([], () => r(require('@/components/home/globalSetting/systemUserCenter')), 'systemUserCenter')
const SystemUserBase = r => require.ensure([], () => r(require('@/components/home/globalSetting/systemUser/systemUserBase')), 'systemUserBase')
const SystemUserList = r => require.ensure([], () => r(require('@/components/home/globalSetting/systemUser/systemUserList')), 'systemUserList')
const SystemUserRoles = r => require.ensure([], () => r(require('@/components/home/globalSetting/systemUser/systemUserRoles')), 'systemUserRoles')
// 设备信息页面跳转刷新用空白页面
const Blank = r => require.ensure([], () => r(require('@/components/home/blank')), 'blank')

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    { path: '/home',
      component: Home,
      children: [
        { path: '', redirect: 'deviceInfo' },
        { path: 'deviceInfo', name: 'deviceInfo', component: DeviceInfo },
        { path: 'devmanage',
          component: DevmanageBase,
          children: [
            { path: '', redirect: 'deviceList' },
            { path: 'deviceList', component: DeviceList },
            { path: 'datachart', component: Datachart },
            { path: 'deviceAnalysis',
              component: DeviceAnalysisBase,
              children: [
                { path: '', redirect: 'cityAna' },
                { path: 'cityAna', component: CityAna },
                { path: 'tagAna', component: TagAna }
              ]}
          ]},
        { path: 'video',
          component: CameraBase,
          children: [
            { path: '', redirect: 'cameraList' },
            { path: 'cameraList', component: CameraList },
            { path: 'player', component: Player },
            { path: 'ezvizCfg', component: EzvizCfg }
          ]},
        { path: 'client',
          component: ClientBase,
          children: [
            { path: '', redirect: 'clientList' },
            { path: 'clientList', component: ClientList },
            { path: 'clientAnalysis',
              component: ClientAnalysisBase,
              children: [
                { path: '', redirect: 'clientCityAna' },
                { path: 'clientCityAna', component: ClientCityAna },
                { path: 'incomeAna', component: IncomeAna }
              ]}
          ]},
        { path: 'user',
          component: UserBase,
          children: [
            { path: '', redirect: 'userList' },
            { path: 'userList', component: UserList },
            { path: 'userAnalysis',
              component: UserAnaBase,
              children: [
                { path: '', redirect: 'rechargeRecord' },
                { path: 'userTimeInterrval', component: UserTimeInterrval },
                { path: 'powerAna', component: PowerAna },
                { path: 'chargingRecord', component: ChargingRecord },
                { path: 'rechargeRecord', component: RechargeRecord }
              ]}
          ]},
        { path: 'alarm',
          component: AlarmBase,
          children: [
            { path: '', redirect: 'alarmNow' },
            { path: 'alarmNow', component: AlarmNow },
            { path: 'alarmHistory', component: AlarmHistory },
            { path: 'alarmContact', component: AlarmContact }
          ]},
        { path: 'account',
          component: AccountBase,
          children: [
            { path: '', redirect: 'accountList' },
            { path: 'accountList', component: AccountList },
            { path: 'tradList', component: TradList }
          ]},
        { path: 'overview',
          component: OverviewBase,
          children: [
            { path: '', redirect: 'deviceOverview' },
            { path: 'deviceOverview', component: DeviceOverview },
            { path: 'userOverview', component: UserOverview },
            { path: 'clientOverview', component: ClientOverview },
            { path: 'accountOverview', component: AccountOverview }
          ]},
        { path: 'globalSetting',
          component: GlobalSettingBase,
          children: [
            { path: '', redirect: 'systemUser' },
            { path: 'systemUser',
              component: SystemUserBase,
              children: [
                { path: '', redirect: 'systemUserRoles' },
                { path: 'systemUserList', component: SystemUserList },
                { path: 'systemUserRoles', component: SystemUserRoles }
              ]},
            { path: 'systemUserCenter', component: SystemUserCenter }
          ]},
        { path: 'blank', name: 'blank', component: Blank }
      ]
    }
  ]
})
