import { character } from '@/components/config/Character'

/**
 * Modbus发送帧组帧
 * 传入帧内部的相关参数
 * 返回生成的modbusASCII帧（字符串）
 */
export const sendModbusASCII = {
/**
 * modbus通信协议中的ASCII传输协议
 * 功能码 01 02 03 04
 * deviceAddress:设备地址      int-> 2字符
 * funCode:功能码              int-> 2字符
 * registerAddress:起始地址    int-> 4字符
 * registerNum:寄存器数量      int-> 4字符
 */
  readASCIIFrame (deviceAddress, funCode, registerAddress, registerNum) {
    let start = ':'
    let frameData = character.intTostring2(deviceAddress) + character.intTostring2(funCode) +
    character.intTostring4(registerAddress) + character.intTostring4(registerNum)
    frameData = frameData.toUpperCase()
    let lrc = LRCcheck(frameData).toUpperCase()
    let frameEnd = '\r\n'
    return start + frameData + lrc + frameEnd
  },
/**
 * modbus通信协议中的ASCII传输协议
 * 功能码 05 06
 * deviceAddress:设备地址       int-> 2字符
 * funCode:功能码               int-> 2字符
 * registerAddress:起始地址     int-> 4字符
 * registerValue:输出值         int-> 4字符
 */
  writeASCIIFrameSingle (deviceAddress, funCode, registerAddress, registerValue) {
    let start = ':'
    if (funCode === 5) {
      registerValue = (registerValue === 1) ? 'FF00' : '0000'
    } else if (funCode === 6) {
      registerValue = character.intTostring4(registerValue)
    } else {
      // 其它情况（modbus）
      registerValue = character.intTostring4(registerValue)
    }
    // console.log(registerValue)
    let frameData = character.intTostring2(deviceAddress) + character.intTostring2(funCode) +
    character.intTostring4(registerAddress) + registerValue
    frameData = frameData.toUpperCase()
    let lrc = LRCcheck(frameData).toUpperCase()
    let frameEnd = '\r\n'
    return start + frameData + lrc + frameEnd
  },
/**
 * modbus通信协议中的ASCII传输协议
 * 功能码 0F 10
 * deviceAddress：设备地址       int-> 2字符
 * funCode：功能码               int-> 2字符
 * registerAddress：起始地址     int-> 4字符
 * registerNum：寄存器数量       int-> 4字符
 * datalength：数据长度          int-> 2字符
 * dataload：数据域              [int,int,,]-> 2字符 * N or 4字符 * N
 */
  writeASCIIFrameMul (deviceAddress, funCode, registerAddress, registerNum, datalength, dataload) {
    let start = ':'
    let frameData = character.intTostring2(deviceAddress) + character.intTostring2(funCode) +
    character.intTostring4(registerAddress) + character.intTostring4(registerNum)
    let data = ''
    if (funCode === 15) {
      for (let i = 0; i < dataload.length; i++) {
        data += character.intTostring2(dataload[i])
      }
    }
    if (funCode === 16) {
      for (let i = 0; i < dataload.length; i++) {
        data += character.intTostring4(dataload[i])
      }
    }
    frameData += character.intTostring2(datalength) + data
    frameData = frameData.toUpperCase()
    let lrc = LRCcheck(frameData).toUpperCase()
    let frameEnd = '\r\n'
    return start + frameData + lrc + frameEnd
  },
/**
 * modbus通信协议中的ASCII传输协议
 * 对发送帧解析
 * 功能码 01 02 03 04
 * frameData：modbus帧（字符串）
 * return frameBuild：modbus帧（JSON对象）
 */
  analyReadASCIIFrame (frameData) {
    let frameBuild = {
      start: ':',
      deviceAddress: 0,
      funCode: 0,
      registerAddress: 0,
      registerNum: 0,
      LRC: 0,
      end: '\r\n'
    }
    if (!LRCcheckCorrect(frameData.substring(1, frameData.length - 4))) {
      return frameBuild
    }
    frameBuild.start = frameData.substring(0, 1)
    frameBuild.deviceAddress = parseInt(frameData.substring(1, 3), 16)
    frameBuild.funCode = parseInt(frameData.substring(3, 5), 16)
    frameBuild.registerAddress = parseInt(frameData.substring(5, 9), 16)
    frameBuild.registerNum = parseInt(frameData.substring(9, frameData.length - 6), 16)
    frameBuild.LRC = parseInt(frameData.substring(frameData.length - 6, frameData.length - 4), 16)
    frameBuild.end = frameData.substring(frameData.length - 4, frameData.length)
    return frameBuild
  },
/**
 * modbus通信协议中的ASCII传输协议
 * 对发送帧解析
 * 功能码 05 06
 * frameData：modbus帧（字符串）
 * return frameBuild：modbus帧（JSON对象）
 */
  analyWriteASCIIFrameSingle (frameData) {
    let frameBuild = {
      start: ':',
      deviceAddress: 0,
      funCode: 0,
      registerAddress: 0,
      registerValue: 0,
      LRC: 0,
      end: '\r\n'
    }
    if (!LRCcheckCorrect(frameData.substring(1, frameData.length - 4))) {
      return frameBuild
    }
    frameBuild.start = frameData.substring(0, 1)
    frameBuild.deviceAddress = parseInt(frameData.substring(1, 3), 16)
    frameBuild.funCode = parseInt(frameData.substring(3, 5), 16)
    frameBuild.registerAddress = parseInt(frameData.substring(5, 9), 16)
    frameBuild.registerValue = parseInt(frameData.substring(9, frameData.length - 6), 16)
    frameBuild.LRC = parseInt(frameData.substring(frameData.length - 6, frameData.length - 4), 16)
    frameBuild.end = frameData.substring(frameData.length - 4, frameData.length)
    return frameBuild
  },
/**
 * modbus通信协议中的ASCII传输协议
 * 对发送帧解析
 * 功能码 0F 10
 * frameData：modbus帧（字符串）
 * return frameBuild：modbus帧（JSON对象）
 */
  analyWriteASCIIFrameMul (frameData) {
    let frameBuild = {
      start: ':',
      deviceAddress: 0,
      funCode: 0,
      registerAddress: 0,
      registerNum: 0,
      datalength: 0,
      dataload: '',
      LRC: 0,
      end: '\r\n'
    }
    if (!LRCcheckCorrect(frameData.substring(1, frameData.length - 4))) {
      return frameBuild
    }
    frameBuild.start = frameData.substring(0, 1)
    frameBuild.deviceAddress = parseInt(frameData.substring(1, 3), 16)
    frameBuild.funCode = parseInt(frameData.substring(3, 5), 16)
    frameBuild.registerAddress = parseInt(frameData.substring(5, 9), 16)
    frameBuild.registerNum = parseInt(frameData.substring(9, 13), 16)
    frameBuild.datalength = parseInt(frameData.substring(13, 15), 16)
    frameBuild.dataload = frameData.substring(15, frameData.length - 6)
    frameBuild.LRC = parseInt(frameData.substring(frameData.length - 6, frameData.length - 4), 16)
    frameBuild.end = frameData.substring(frameData.length - 4, frameData.length)
    return frameBuild
  }
}
/**
 * Modbus发送帧组帧
 * 传入帧内部的相关参数
 * 返回生成的modbusRTU帧（字符串）
 */
export const sendModbusRTU = {
/**
 * modbus通信协议中的RTU传输协议
 * 功能码 01 02 03 04
 * deviceAddress:设备地址      int-> 2字符
 * funCode:功能码              int-> 2字符
 * registerAddress:起始地址    int-> 4字符
 * registerNum:寄存器数量      int-> 4字符
 */
  readRTUFrame (deviceAddress, funCode, registerAddress, registerNum) {
    let frameData = character.intTostring2(deviceAddress) + character.intTostring2(funCode) +
    character.intTostring4(registerAddress) + character.intTostring4(registerNum)
    frameData = frameData.toUpperCase()
    let crc = CRCcheck(frameData).toUpperCase()
    return frameData + crc.substring(2, 4) + crc.substring(0, 2)
  },
  /**
 * modbus通信协议中的RTU传输协议
 * 功能码 05 06
 * deviceAddress:设备地址       int-> 2字符
 * funCode:功能码               int-> 2字符
 * registerAddress:起始地址     int-> 4字符
 * registerValue:输出值         int-> 4字符
 */
  writeRTUFrameSingle (deviceAddress, funCode, registerAddress, registerValue) {
    if (funCode === 5) {
      registerValue = (registerValue === 1) ? 'FF00' : '0000'
    } else if (funCode === 6) {
      registerValue = character.intTostring4(registerValue)
    } else {
      // 其它情况（modbus）
      registerValue = character.intTostring4(registerValue)
    }
    // console.log(registerValue)
    let frameData = character.intTostring2(deviceAddress) + character.intTostring2(funCode) +
    character.intTostring4(registerAddress) + registerValue
    frameData = frameData.toUpperCase()
    let crc = CRCcheck(frameData).toUpperCase()
    return frameData + crc.substring(2, 4) + crc.substring(0, 2)
  },
  /**
 * modbus通信协议中的ASCII传输协议
 * 对发送帧解析
 * 功能码 01 02 03 04
 * frameData：modbus帧（字符串）
 * return frameBuild：modbus帧（JSON对象）
 */
  analyReadRTUFrame (frameData) {
    let frameBuild = {
      deviceAddress: 0,
      funCode: 0,
      registerAddress: 0,
      registerNum: 0,
      CRC: '0000'
    }
    if (!CRCcheckCorrect(frameData.substring(0, frameData.length))) {
      return frameBuild
    }
    frameBuild.deviceAddress = parseInt(frameData.substring(0, 2), 16)
    frameBuild.funCode = parseInt(frameData.substring(2, 4), 16)
    frameBuild.registerAddress = parseInt(frameData.substring(4, 8), 16)
    frameBuild.registerNum = parseInt(frameData.substring(8, frameData.length - 4), 16)
    frameBuild.CRC = parseInt(frameData.substring(frameData.length - 4, frameData.length), 16)
    return frameBuild
  }
}
/**
 * Modbus接收帧解析
 * 传入字符串
 * 传出帧对象
 */
export const recModbusASCII = {
/**
 * modbus通信协议中的ASCII传输协议
 * 功能码 01 02 03 04
 * frameData：modbus帧（字符串）
 * return frameBuild：modbus帧（JSON对象）
 */
  reReadASCIIFrame (frameData) {
    let frameBuild = {
      start: ':',
      deviceAddress: 0,
      funCode: 0,
      datalength: 0,
      dataload: '',
      LRC: 0,
      end: '\r\n'
    }
    if (!LRCcheckCorrect(frameData.substring(1, frameData.length - 4))) {
      return frameBuild
    }
    frameBuild.start = frameData.substring(0, 1)
    frameBuild.deviceAddress = parseInt(frameData.substring(1, 3), 16)
    frameBuild.funCode = parseInt(frameData.substring(3, 5), 16)
    frameBuild.datalength = parseInt(frameData.substring(5, 7), 16)
    frameBuild.dataload = frameData.substring(7, frameData.length - 6)
    frameBuild.LRC = parseInt(frameData.substring(frameData.length - 6, frameData.length - 4), 16)
    frameBuild.end = frameData.substring(frameData.length - 4, frameData.length)
    return frameBuild
  },
/**
 * modbus通信协议中的ASCII传输协议
 * 功能码 05 06
 * frameData：modbus帧（字符串）
 * return frameBuild：modbus帧（JSON对象）
 */
  reWriteASCIIFrameSingle (frameData) {
    let frameBuild = {
      start: ':',
      deviceAddress: 0,
      funCode: 0,
      registerAddress: 0,
      registerValue: 0,
      LRC: 0,
      end: '\r\n'
    }
    if (!LRCcheckCorrect(frameData.substring(1, frameData.length - 4))) {
      return frameBuild
    }
    frameBuild.start = frameData.substring(0, 1)
    frameBuild.deviceAddress = parseInt(frameData.substring(1, 3), 16)
    frameBuild.funCode = parseInt(frameData.substring(3, 5), 16)
    frameBuild.registerAddress = parseInt(frameData.substring(5, 9), 16)
    frameBuild.registerValue = parseInt(frameData.substring(9, 13), 16)
    frameBuild.LRC = parseInt(frameData.substring(13, 15), 16)
    frameBuild.end = frameData.substring(15, 19)
    return frameBuild
  },
/**
 * modbus通信协议中的ASCII传输协议
 * 功能码 0F 10
 * frameData：modbus帧（字符串）
 * return frameBuild：modbus帧（JSON对象）
 */
  reWriteASCIIFrameMul (frameData) {
    let frameBuild = {
      start: ':',
      deviceAddress: 0,
      funCode: 0,
      registerAddress: 0,
      registerNum: 0,
      LRC: 0,
      end: '\r\n'
    }
    if (!LRCcheckCorrect(frameData.substring(1, frameData.length - 4))) {
      return frameBuild
    }
    frameBuild.start = frameData.substring(0, 1)
    frameBuild.deviceAddress = parseInt(frameData.substring(1, 3), 16)
    frameBuild.funCode = parseInt(frameData.substring(3, 5), 16)
    frameBuild.registerAddress = parseInt(frameData.substring(5, 9), 16)
    frameBuild.registerNum = parseInt(frameData.substring(9, 13), 16)
    frameBuild.LRC = parseInt(frameData.substring(13, 15), 16)
    frameBuild.end = frameData.substring(15, 19)
    return frameBuild
  }
}
/**
 * LRC计算
 * 计算该帧数据的LRC
 * str： 需要计算的数据内容
 * return： 校验结果（2个字符）
 */
function LRCcheck (str) {
  // console.log(str)
  let c
  let len = str.length
  let lrc, sum
  sum = 0
  if (len % 2 !== 0) {
    return 'error'
  }
  for (let i = 0; i < (len / 2); i++) {
    c = str.substring(i * 2, i * 2 + 2)
    sum += parseInt(c, 16)
    // console.log(c)
  }
  // console.log(sum)
  lrc = 256 - sum % 256
  return character.intTostring2(lrc)
  // return lrc.toString(16)
}
/**
 * LRC校验
 * 验证该帧数据LRC校验是否正确
 * str： 需要计算的数据内容
 * return： 校验结果
 */
function LRCcheckCorrect (str) {
  let c
  let len = str.length
  let lrc, sum
  sum = 0
  if (len % 2 !== 0) {
    return false
  }
  for (let i = 0; i < (len / 2) - 1; i++) {
    c = str.substring(i * 2, i * 2 + 2)
    sum += parseInt(c, 16)
  }
  lrc = 256 - sum % 256
  if (lrc === parseInt(str.substring(str.length - 2, str.length), 16)) {
    return true
  }
  return false
}
/**
 * CRC计算
 * 计算该帧数据的CRC
 * str： 需要计算的数据内容
 * return： 校验结果（2个字符）
 */
function CRCcheck (str) {
  let c
  let len = str.length
  let crc = 65535
  if (len % 2 !== 0) {
    return '0000'
  }
  for (let i = 0; i < (len / 2); i++) {
    c = str.substring(i * 2, i * 2 + 2)
    crc ^= parseInt(c, 16)
    // console.log(crc)
    for (let j = 0; j < 8; j++) {
      if ((crc % 2) !== 0) {
        crc /= 2
        crc ^= 40961
      } else {
        crc /= 2
      }
    }
  }
  crc = character.intTostring4(crc)
  return crc
}
/**
 * LRC校验
 * 验证该帧数据LRC校验是否正确
 * str： 需要计算的数据内容
 * return： 校验结果
 */
function CRCcheckCorrect (str) {
  let c
  let len = str.length
  let crc = 65535
  if (len % 2 !== 0) {
    return false
  }
  for (let i = 0; i < (len / 2) - 2; i++) {
    c = str.substring(i * 2, i * 2 + 2)
    crc ^= parseInt(c, 16)
    for (let j = 0; j < 8; j++) {
      if ((crc % 2) !== 0) {
        crc /= 2
        crc ^= 40961
      } else {
        crc /= 2
      }
    }
  }
  // 字母转换为大写
  crc = character.intTostring4(crc).toUpperCase()
  // CRC低位在前，调换顺序
  crc = crc.substring(2, 4) + crc.substring(0, 2)
  if (crc === str.substring(str.length - 4, str.length)) {
    return true
  }
  return false
}
