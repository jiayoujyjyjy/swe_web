// import jsonp from 'jsonp'
import axios from 'axios'
import * as url from './urlConfig'
import { character } from '@/components/config/Character'

// 对onenet平台进行get请求
export const onenet = {
  //
  // ****************反向代理*****************
  //
  // 数据点
  // 查询数据点，限制查询数据点的个数
  // 传入参数：apikey，需要查询的设备id，数据流id,limit范围(0, 6000]
  // 返回所查询数据流下的所有数据点信息
  onenetHisQue (param) {
    return axios({
      url: `http://onenet.swehongshi.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId}&start=${param.startTime}&end=${param.endTime}&limit=6000&time=${character.randomWord(true, 9, 12)}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 带cursor参数的历史数据查询，当查询范围内的数据点数大于limit时，会返回cursor参数，下一次查询带上cursor可以查询剩下的数据
  onenetHisQueCur (param) {
    return axios({
      url: `http://onenet.swehongshi.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId}&start=${param.startTime}&end=${param.endTime}&limit=6000&cursor=${param.cursor}&time=${character.randomWord(true, 9, 12)}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

// 对后台进行请求
export const back = {
  // 1用户管理
  // 1.1用户注册
  userRegister (param) {
    return axios({
      url: `${url.backbasurl}/manager/user/register`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        name: param.name,
        mobile: param.mobile,
        password: param.password,
        code: param.code
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.2用户登录，手机登录
  userLogMobile (param) {
    return axios({
      url: `${url.backbasurl}/manager/user/login`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        mobile: param.mobile,
        password: param.password
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.3用户登录，邮箱登录
  userLogMail (param) {
    return axios({
      url: `${url.backbasurl}/manager/user/login`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: param.email,
        password: param.password
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.4查询用户信息
  userInfoQue (param) {
    return axios({
      url: `${url.backbasurl}/manager/user?userId=${param.userId}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
      // withCredentials: true
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.5修改用户基本信息
  userInfoMod (param) {
    return axios({
      url: `${url.backbasurl}/manager/user`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Content-Type': 'application/json',
        'Authorization': param.Authorization
      },
      data: {
        userId: param.userId,
        name: param.name,
        mobile: param.mobile,
        company: param.company,
        email: param.email
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.6修改账号密码
  passwordMod (param) {
    return axios({
      url: `${url.backbasurl}/manager/user/password?oldPass=${param.oldPassword}&newPass=${param.newPassword}`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Content-Type': 'application/json',
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.7删除鸿世用户
  userDel (param) {
    return axios({
      url: `${url.backbasurl}/manager/user`,
      method: 'delete',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        userId: param.userId
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.8 刷新邀请码
  refreshCode (param) {
    return axios({
      url: `${url.backbasurl}/manager/user/code?code=${param.oldCode}`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.1 获取充电桩地图信息
  chargingMapQue (param) {
    return axios({
      url: `${url.backbasurl}/manager/station/map`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.2 分页获取充电桩信息列表
  chargingListQue (param) {
    return axios({
      url: `${url.backbaseurl}/station/list?page=${param.currentPage}&size=${param.pagesize}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.3 获取单一充电桩信息
  chargingSnQue (param) {
    return axios({
      url: `${url.backbaseurl}/station?sn=${param.sn}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.4 获取充电桩计费规则（新）
  chargingRulesQue (param) {
    return axios({
      url: `${url.backbasurl}/manager/station/range?sn=${param.sn}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.5 修改充电桩计费规则
  chargingRulesMod (param) {
    return axios({
      url: `${url.backbasurl}/manager/station/range?sn=${param.sn}&isSend=${param.isSend}`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        ranges: param.billing
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.6 获取插座使用情况
  socketNumQue (param) {
    return axios({
      url: `${url.backbaseurl}/station/socketUse?sn=${param.sn}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {

      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.7 修改充电桩信息
  chargingInfoMod (param) {
    return axios({
      url: `${url.backbaseurl}/station`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,
        label: param.label,
        type: param.type,
        lon: param.lon,
        lat: param.lat,
        ele: param.ele
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.8 获取所有充电桩信息
  allStationQue (param) {
    return axios({
      url: `${url.backbaseurl}/device/allStation`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.9 获取充电桩下的插座状态
  socketStateQue (param) {
    return axios({
      url: `${url.backbaseurl}/station/socket/detail?sn=${param.sn}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.10 根据充电桩关键字分页查找充电桩信息
  stationKeyQue (param) {
    return axios({
      url: `${url.backbaseurl}/station/list/keyword?page=${param.currentPage}&size=${param.pagesize}&keyword=${param.keyword}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.11 根据充电桩在线离线分页获取充电桩列表
  stationStateQue (param) {
    return axios({
      url: `${url.backbaseurl}/station/list/state?page=${param.currentPage}&size=${param.pagesize}&online=${param.online}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.12 获取充电桩下的插座二维码信息
  stationQRQue (param) {
    return axios({
      url: `${url.backbaseurl}/station/socket/qrcode?sn=${param.sn}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 微信用户管理
  // 3.1 分页获取微信用户列表
  userListQue (param) {
    return axios({
      url: `${url.backbaseurl}/wxUser/list?page=${param.currentPage}&size=${param.pagesize}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.2 分页获取微信用户充值记录
  userRechargeQue (param) {
    return axios({
      url: `${url.backbaseurl}/wxUser/recharge?page=${param.currentPage_DiaRe}&size=${param.pagesize_DiaRe}&uid=${param.uid}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.3 分页获取微信用户充电记录
  userChargingQue (param) {
    return axios({
      url: `${url.backbaseurl}/wxUser/charger/history?page=${param.currentPage_DiaCha}&size=${param.pagesize_DiaCha}&uid=${param.uid}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.4 获取微信用户常用电站
  userStationsQue (param) {
    return axios({
      url: `${url.backbaseurl}/wxUser/station/usual?uid=${param.uid}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.5 根据手机号搜索用户
  userSearch (param) {
    return axios({
      url: `${url.backbaseurl}/wxUser/list/mobile?mobile=${param.mobile}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.6 获取用户的充值类型计数统计
  userRechargeTypeQue (param) {
    return axios({
      url: `${url.backbaseurl}/wxUser/recharge/type?picture=${param.picture}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.1 分页获取所有充电桩的当前报警信息
  alarmNowAllQue (param) {
    return axios({
      url: `${url.backbasurl}/manager/warn/current?page=${param.currentPage}&size=${param.pagesize}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.2 分页获取单一充电桩的当前报警信息
  alarmNowSnQue (param) {
    return axios({
      url: `${url.backbasurl}/manager/warn/current?page=${param.currentPage}&size=${param.pagesize}&name=${param.chargingName}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.3 确认当前报警
  alarmConfirm (param) {
    return axios({
      url: `${url.backbasurl}/manager/warn/current`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        time: param.time
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.4 分页获取所有充电桩的所有历史报警信息
  alarmHisAllQue (param) {
    return axios({
      url: `${url.backbasurl}/manager/warn/history?page=${param.currentPage}&size=${param.pagesize}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.5 分页获取单一充电桩的所有历史报警信息
  alarmHisSnAllQue (param) {
    return axios({
      url: `${url.backbasurl}/manager/warn/history?page=${param.currentPage}&size=${param.pagesize}&name=${param.chargingName}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.6 分页获取所有电桩的特定历史报警信息
  alarmHisDateAllQue (param) {
    return axios({
      url: `${url.backbasurl}/manager/warn/history?page=${param.currentPage}&size=${param.pagesize}&start=${param.startTime}&end=${param.endTime}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.7 分页获取单一充电桩的特定历史报警信息
  alarmHisDateSnQue (param) {
    return axios({
      url: `${url.backbasurl}/manager/warn/history?page=${param.currentPage}&size=${param.pagesize}&name=${param.chargingName}&start=${param.startTime}&end=${param.endTime}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.1 获取短信验证码
  smsCodeQue (param) {
    return axios({
      url: `${url.backbasurl}/util/smsCode?mobile=${param.mobile}`,
      method: 'get',
      headers: {
        'userId': param.userId
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.2 获取邮箱验证码（新）
  mailCodeQue (param) {
    return axios({
      url: `${url.backbasurl}/util/mailCode?email=${param.email}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.3 刷新后台请求token
  tokenQue (param) {
    return axios({
      url: `${url.backbasurl}/util/token?userId=${param.userId}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 萤石云视频监控
  // 6.1 获取视频rtmp地址
  rtmpQue (param) {
    return axios({
      url: `${url.backbaseurl}/camera/showUrl?deviceSerial=${param.deviceSerial}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.2 获取用户萤石云绑定信息
  ezvizBindQue (param) {
    return axios({
      url: `${url.backbaseurl}/camera/user/msg?userId=${param.userId}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.3 续签token
  renewToken (param) {
    return axios({
      url: `${url.backbaseurl}/camera/user/token?userId=${param.userId}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.4 开始云台控制
  ptzStart (param) {
    return axios({
      url: `${url.backbaseurl}/camera/ptz/start`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        accessToken: param.accessToken,
        deviceSerial: param.deviceSerial,
        channelNo: param.channelNo,
        direction: param.direction,
        speed: param.speed
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.5 停止云台控制
  ptzStop (param) {
    return axios({
      url: `${url.backbaseurl}/camera/ptz/stop`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        accessToken: param.accessToken,
        deviceSerial: param.deviceSerial,
        channelNo: param.channelNo,
        direction: param.direction
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.6 镜像翻转
  mirror (param) {
    return axios({
      url: `${url.backbaseurl}/camera/mirror`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        accessToken: param.accessToken,
        deviceSerial: param.deviceSerial,
        channelNo: param.channelNo,
        command: param.command
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7. 收益统计模块
  // 7.1 分页获取客户列表
  customerListQue (param) {
    return axios({
      url: `${url.backbaseurl}/operation/list?page=${param.currentPage}&size=${param.pagesize}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.2 分页获取客户下的网关列表
  customerNetListQue (param) {
    return axios({
      url: `${url.backbaseurl}/operation/station/list?userId=${param.uid}&page=${param.currentPage_DiaDev}&size=${param.pagesize_DiaDev}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.3 根据手机号分页获取某一用户一段时间内的历史转账订单列表
  customerOrderHisListQue (param) {
    return axios({
      url: `${url.backbaseurl}/operation/history?mobile=${param.mobile}&page=${param.currentPage}&size=${param.pagesize}&start=${param.start}&end=${param.end}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.4 根据手机号查找客户信息
  customerSearch (param) {
    return axios({
      url: `${url.backbaseurl}/operation/list/mobile?mobile=${param.mobile}&page=${param.currentPage}&size=${param.pagesize}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.5 分页获取客户城市分布（列表或者图表）
  customerCityListQue (param) {
    return axios({
      url: `${url.backbaseurl}/operation/city?page=${param.currentPage}&size=${param.pagesize}&picture=${param.picture}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.6 分页获取客户收入（图形或者表格）
  customerIncomeListQue (param) {
    return axios({
      url: `${url.backbaseurl}/operation/income?page=${param.currentPage}&size=${param.pagesize}&picture=${param.picture}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据概况
  // 8.1 获取充电桩城市列表（图形或者表格）
  chargingCityListQue (param) { // charging - 代表充电桩
    return axios({
      url: `${url.backbaseurl}/device/detail/city?page=${param.currentPage}&size=${param.pagesize}&picture=${param.picture}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.2 获取充电桩的标签统计（表格或者图形）
  chargingLabelListQue (param) {
    return axios({
      url: `${url.backbaseurl}/device/label?page=${param.currentPage}&size=${param.pagesize}&picture=${param.picture}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.3 获取用户的充值类型计数统计
  // 8.4 获取设备的今日统计数目
  chargingToday (param) {
    return axios({
      url: `${url.backbaseurl}/device/today`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.5 获取设备的累计统计数目
  chargingWeek (param) {
    return axios({
      url: `${url.backbaseurl}/device/week`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.6 获取用户的今日统计数目
  userToday (param) {
    return axios({
      url: `${url.backbaseurl}/wxUser/today`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.7 获取用户的累计统计数目
  userWeek (param) {
    return axios({
      url: `${url.backbaseurl}/wxUser/week`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.8 获取客户的今日统计数目
  customerToday (param) {
    return axios({
      url: `${url.backbaseurl}/customer/today`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.9 获取客户的累计统计数目
  customerWeek (param) {
    return axios({
      url: `${url.backbaseurl}/customer/week`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.10 获取资金的今日统计数目
  incomeToday (param) {
    return axios({
      url: `${url.backbaseurl}/income/today`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.11 获取资金的累计统计数目
  incomeWeek (param) {
    return axios({
      url: `${url.backbaseurl}/income/week`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
