/**
 * localRegister参数获取
 * 传入Register内部的相关参数以及PLC的JSON文件
 * 返回生成的需要获取的寄存器类型，寄存器名称，寄存器地址范围（数组形式）
 */
export const localRegister = {
/**
 * localRegister参数获取
 * 工业网关本地，查询本地的数据类型列表（bit，bit16）
 * registerInfo:JSON文件数据
 * return 数据类型列表(数组)
 */
  localDataTypeQue (registerInfo) {
    let dataTypeContent = []
    for (let i = 0; i < registerInfo.local.dataType.length; i++) {
      let dataType = {}
      dataType.value = registerInfo.local.dataType[i].type
      dataType.label = registerInfo.local.dataType[i].label
      dataTypeContent[i] = dataType
    }
    return dataTypeContent
  },
/**
 * localRegister参数获取
 * 工业网关本地，根据数据类型查询本地的寄存器地址类型列表（R,S）
 * dataType:数据类型（字符串）
 * registerInfo:JSON文件数据
 * return 寄存器地址类型列表(数组)包含R,M,D,X等类型
 */
  localAddressTypeQue (dataType, registerInfo) {
    let addressTypeContent = []
    for (let i = 0; i < registerInfo.local.dataType.length; i++) {
      if (registerInfo.local.dataType[i].type === dataType) {
        for (let j = 0; j < registerInfo.local.dataType[i].register.length; j++) {
          let addressType = {}
          addressType.name = registerInfo.local.dataType[i].register[j].name
          addressType.addressStart = registerInfo.local.dataType[i].register[j].addressStart
          addressType.length = registerInfo.local.dataType[i].register[j].totalLength
          addressTypeContent[j] = addressType
        }
      }
    }
    return addressTypeContent
  },
/**
 * localRegister参数获取
 * 工业网关本地，根据数据类型，寄存器类型查询本地的寄存器地址信息（R,S）
 * dataType:数据类型（字符串）
 * addressType:地址类型（字符串）
 * registerInfo:JSON文件数据
 * return 寄存器地址类型(对象)包含R,M,D,X等类型内容信息
 */
  localAddressInfoQue (dataType, addressType, registerInfo) {
    let addressInfoContent = {}
    for (let i = 0; i < registerInfo.local.dataType.length; i++) {
      if (registerInfo.local.dataType[i].type === dataType) {
        for (let j = 0; j < registerInfo.local.dataType[i].register.length; j++) {
          if (registerInfo.local.dataType[i].register[j].name === addressType) {
            let addressInfo = {}
            addressInfo.name = registerInfo.local.dataType[i].register[j].name
            addressInfo.addressStart = registerInfo.local.dataType[i].register[j].addressStart
            addressInfo.length = registerInfo.local.dataType[i].register[j].totalLength
            addressInfoContent = addressInfo
          }
        }
      }
    }
    return addressInfoContent
  },
/**
 * localRegister参数获取
 * 计算获取功能码
 * dataType:数据类型（字符串）bit,bit16
 * addressType:地址类型（字符串）M,D
 * writeRead:读写设置r，wr
 * registerInfo:JSON文件数据
 * return 功能码(数值)
 */
  calcFunctionCode (dataType, addressType, writeRead, plcDataType) {
    if (dataType === 'bit') {
      for (let i = 0; i < plcDataType.local.dataType[0].register.length; i++) {
        if (plcDataType.local.dataType[0].register[i].name === addressType) {
          if (writeRead === 'r') {
            return plcDataType.local.dataType[0].register[i].rcode
          } else {
            return plcDataType.local.dataType[0].register[i].wcode
          }
        }
      }
      return 0
    } else if (dataType === 'bit16') {
      for (let i = 0; i < plcDataType.local.dataType[1].register.length; i++) {
        if (plcDataType.local.dataType[1].register[i].name === addressType) {
          if (writeRead === 'r') {
            return plcDataType.local.dataType[1].register[i].rcode
          } else {
            return plcDataType.local.dataType[1].register[i].wcode
          }
        }
      }
      return 0
    } else if (dataType === 'bit32') {
      for (let i = 0; i < plcDataType.local.dataType[2].register.length; i++) {
        if (plcDataType.local.dataType[2].register[i].name === addressType) {
          if (writeRead === 'r') {
            return plcDataType.local.dataType[2].register[i].rcode
          } else {
            return plcDataType.local.dataType[2].register[i].wcode
          }
        }
      }
      return 0
    }
  },
/**
 * localRegister参数获取
 * 计算获取寄存器地址
 * dataType:数据类型（字符串）bit,bit16
 * addressType:地址类型（字符串）M,D
 * writeRead:读写设置r，wr
 * registerInfo:JSON文件数据
 * return 寄存器地址(数值)
 */
  calcRegisterAdr: function (dataType, addressType, address, plcDataType) {
    if (dataType === 'bit') {
      for (let i = 0; i < plcDataType.local.dataType[0].register.length; i++) {
        if (plcDataType.local.dataType[0].register[i].name === addressType) {
          if (plcDataType.local.dataType[0].register[i].split === 0) {
            return plcDataType.local.dataType[0].register[i].start + address
          } else {
            let length = 0
            for (let j = 0; j < plcDataType.local.dataType[0].register[i].address.length; j++) {
              length += plcDataType.local.dataType[0].register[i].address[j].length
              if (address < length) {
                return address + plcDataType.local.dataType[0].register[i].address[j].start + plcDataType.local.dataType[0].register[i].address[j].length - length
              }
            }
            return 0
          }
        }
      }
    } else if (dataType === 'bit16') {
      for (let i = 0; i < plcDataType.local.dataType[1].register.length; i++) {
        if (plcDataType.local.dataType[1].register[i].name === addressType) {
          if (plcDataType.local.dataType[1].register[i].split === 0) {
            return plcDataType.local.dataType[1].register[i].start + address
          } else {
            let length = 0
            for (let j = 0; j < plcDataType.local.dataType[1].register[i].address.length; j++) {
              length += plcDataType.local.dataType[1].register[i].address[j].length
              if (address > length) {
                return address + plcDataType.local.dataType[1].register[i].address[j].start + plcDataType.local.dataType[1].register[i].address[j].length - length
              }
            }
            return 0
          }
        }
      }
    } else if (dataType === 'bit32') {
      for (let i = 0; i < plcDataType.local.dataType[2].register.length; i++) {
        if (plcDataType.local.dataType[2].register[i].name === addressType) {
          if (plcDataType.local.dataType[2].register[i].split === 0) {
            return plcDataType.local.dataType[2].register[i].start + address
          } else {
            let length = 0
            for (let j = 0; j < plcDataType.local.dataType[2].register[i].address.length; j++) {
              length += plcDataType.local.dataType[2].register[i].address[j].length
              if (address > length) {
                return address + plcDataType.local.dataType[2].register[i].address[j].start + plcDataType.local.dataType[2].register[i].address[j].length - length
              }
            }
            return 0
          }
        }
      }
    }
    return 0
  }
}

/**
 * plcRegister参数获取
 * 传入Register内部的相关参数以及PLC的JSON文件
 * 返回生成的需要获取的寄存器类型，寄存器名称，寄存器地址范围（数组形式）
 */
export const plcRegister = {
/**
 * plcRegister参数获取
 * 根据厂商名称获取该厂商下的设备名列表
 * companyName:厂商名称（字符串）
 * registerInfo:JSON文件数据
 * return 设备名列表(数组)
 */
  plcDeviceNameQue (companyName, registerInfo) {
    let deviceNameList = []
    for (let i = 0; i < registerInfo.plc.length; i++) {
      if (companyName === registerInfo.plc[i].company) {
        for (let devnum = 0; devnum < registerInfo.plc[i].deviceType.length; devnum++) {
          let obj = {}
          obj.name = registerInfo.plc[i].deviceType[devnum].name
          deviceNameList[devnum] = obj
        }
      }
    }
    return deviceNameList
  },
/**
 * plcRegister 参数获取
 * 根据厂商名称，产品名称，获取该产品下的默认通信配置参数
 * companyName: 厂商名称（字符串）
 * deviceName: 产品名称（字符串）
 * registerInfo: JSON文件数据
 * return  该产品下的默认通信配置参数（JSON对象）
 */
  plcDevDefaultParamQue (companyName, deviceName, registerInfo) {
    let deviceParam = {}
    for (let i = 0; i < registerInfo.plc.length; i++) {
      if (companyName === registerInfo.plc[i].company) {
        for (let devnum = 0; devnum < registerInfo.plc[i].deviceType.length; devnum++) {
          if (deviceName === registerInfo.plc[i].deviceType[devnum].name) {
            deviceParam = registerInfo.plc[i].deviceType[devnum].communication
          }
        }
      }
    }
    return deviceParam
  },
/**
 * plcRegister 参数获取
 * 根据厂商名称，产品名称，获取指定PLC的数据类型
 * companyName: 厂商名称（字符串）
 * deviceName: 产品名称（字符串）
 * registerInfo: JSON文件数据
 * return  该产品下的数据类型（数组）
 * plcDataTypeQue('DELTA', 'DELTA DVP', this.plcInfo)
 */
  plcDataTypeQue (companyName, deviceName, registerInfo) {
    let dataTypeContent = []
    for (let i = 0; i < registerInfo.plc.length; i++) {
      if (companyName === registerInfo.plc[i].company) {
        for (let j = 0; j < registerInfo.plc[i].deviceType.length; j++) {
          if (deviceName === registerInfo.plc[i].deviceType[j].name) {
            for (let dataTypeIndex = 0; dataTypeIndex < registerInfo.plc[i].deviceType[j].dataType.length; dataTypeIndex++) {
              let dataType = {}
              dataType.value = registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].type
              dataType.label = registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].label
              dataTypeContent[dataTypeIndex] = dataType
            }
          }
        }
      }
    }
    return dataTypeContent
  },
/**
 * plcRegister 参数获取
 * 根据厂商名称，产品名称，获取指定PLC的某一数据类型下的地址类型
 * companyName: 厂商名称（字符串）
 * deviceName: 产品名称（字符串）
 * dataType：数据类型（字符串）
 * registerInfo: JSON文件数据
 * return  该产品下的包含R,M,D,X等类型的数组，包含地址类型的地址范围信息（数组）
 * plcAddressTypeQue('DELTA', 'DELTA DVP', 'bit32', this.plcInfo)
 */
  plcAddressTypeQue (company, deviceName, dataType, registerInfo) {
    let addressTypeContent = []
    for (let i = 0; i < registerInfo.plc.length; i++) {
      if (company === registerInfo.plc[i].company) {
        for (let j = 0; j < registerInfo.plc[i].deviceType.length; j++) {
          if (deviceName === registerInfo.plc[i].deviceType[j].name) {
            for (let dataTypeIndex = 0; dataTypeIndex < registerInfo.plc[i].deviceType[j].dataType.length; dataTypeIndex++) {
              if (registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].type === dataType) {
                for (let addressTypeIndex = 0; addressTypeIndex < registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].register.length; addressTypeIndex++) {
                  let addressType = {}
                  addressType.name = registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].register[addressTypeIndex].name
                  addressType.addressStart = registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].register[addressTypeIndex].addressStart
                  addressType.length = registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].register[addressTypeIndex].totalLength
                  addressTypeContent[addressTypeIndex] = addressType
                }
              }
            }
          }
        }
      }
    }
    return addressTypeContent
  },
/**
 * plcRegister 参数获取
 * 根据厂商名称，产品名称，获取指定PLC的某一数据类型下的地址类型
 * companyName: 厂商名称（字符串）
 * deviceName: 产品名称（字符串）
 * dataType：数据类型（字符串）
 * addressType: 地址类型（字符串）
 * registerInfo: JSON文件数据
 * return  该产品下的包含R,M,D,X等类型的地址信息，包含地址类型的地址范围信息（对象）
 * plcAddressTypeQue('DELTA', 'DELTA DVP', 'bit32', 'D', this.plcInfo)
 */
  plcAddressInfoQue (company, deviceName, dataType, addressType, registerInfo) {
    let addressInfoContent = {}
    for (let i = 0; i < registerInfo.plc.length; i++) {
      if (company === registerInfo.plc[i].company) {
        for (let j = 0; j < registerInfo.plc[i].deviceType.length; j++) {
          if (deviceName === registerInfo.plc[i].deviceType[j].name) {
            for (let dataTypeIndex = 0; dataTypeIndex < registerInfo.plc[i].deviceType[j].dataType.length; dataTypeIndex++) {
              if (registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].type === dataType) {
                for (let addressTypeIndex = 0; addressTypeIndex < registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].register.length; addressTypeIndex++) {
                  if (registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].register[addressTypeIndex].name === addressType) {
                    addressInfoContent = registerInfo.plc[i].deviceType[j].dataType[dataTypeIndex].register[addressTypeIndex]
                    return addressInfoContent
                  }
                }
              }
            }
          }
        }
      }
    }
    return addressInfoContent
  },
  /**
 * plcRegister参数获取
 * 计算获取功能码
 * deviceType:plc产品厂商
 * deviceName:plc产品类型名称
 * dataType:数据类型（字符串）bit,bit16
 * addressType:地址类型（字符串）M,D
 * writeRead:读写设置r，wr
 * registerInfo:JSON文件数据
 * return 功能码(数值)
 */
  calcFunctionCode (deviceType, deviceName, dataType, addressType, writeRead, plcDataType) {
    // console.log('calc' + deviceType)
    // console.log('calc' + deviceName)
    // console.log('calc' + dataType)
    // console.log('calc' + addressType)
    // console.log('calc' + writeRead)
    // console.log(plcDataType)
    for (let deTypeIndex = 0; deTypeIndex < plcDataType.plc.length; deTypeIndex++) {
      if (deviceType === plcDataType.plc[deTypeIndex].company) {
        for (let deNameIndex = 0; deNameIndex < plcDataType.plc[deTypeIndex].deviceType.length; deNameIndex++) {
          if (deviceName === plcDataType.plc[deTypeIndex].deviceType[deNameIndex].name) {
            if (dataType === 'bit') {
              for (let i = 0; i < plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register.length; i++) {
                if (plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register[i].name === addressType) {
                  if (writeRead === 'r') {
                    return plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register[i].rcode
                  } else {
                    return plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register[i].wcode
                  }
                }
              }
              return 0
            } else if (dataType === 'bit16') {
              for (let i = 0; i < plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register.length; i++) {
                if (plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register[i].name === addressType) {
                  if (writeRead === 'r') {
                    return plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register[i].rcode
                  } else {
                    return plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register[i].wcode
                  }
                }
              }
              return 0
            } else if (dataType === 'bit32') {
              for (let i = 0; i < plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register.length; i++) {
                if (plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register[i].name === addressType) {
                  if (writeRead === 'r') {
                    return plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register[i].rcode
                  } else {
                    return plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register[i].wcode
                  }
                }
              }
              return 0
            }
          }
        }
      }
    }
  },
/**
* localRegister参数获取
* 计算获取寄存器地址
* deviceType:plc产品厂商
* deviceName:plc产品类型名称
* dataType:数据类型（字符串）bit,bit16
* addressType:地址类型（字符串）M,D
* writeRead:读写设置r，wr
* registerInfo:JSON文件数据
* return 寄存器地址(数值)
*/
  calcRegisterAdr: function (deviceType, deviceName, dataType, addressType, address, plcDataType) {
    // console.log('lc' + deviceType)
    // console.log('lc' + deviceName)
    // console.log('lc' + dataType)
    // console.log('lc' + addressType)
    // console.log('lc' + address)
    // console.log(plcDataType)
    for (let deTypeIndex = 0; deTypeIndex < plcDataType.plc.length; deTypeIndex++) {
      if (deviceType === plcDataType.plc[deTypeIndex].company) {
        for (let deNameIndex = 0; deNameIndex < plcDataType.plc[deTypeIndex].deviceType.length; deNameIndex++) {
          if (deviceName === plcDataType.plc[deTypeIndex].deviceType[deNameIndex].name) {
            if (dataType === 'bit') {
              for (let i = 0; i < plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register.length; i++) {
                if (plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register[i].name === addressType) {
                  if (plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register[i].split === 0) {
                    return plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register[i].start + address
                  } else {
                    let length = 0
                    for (let j = 0; j < plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register[i].address.length; j++) {
                      length += plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register[i].address[j].length
                      if (address < length) {
                        return address + plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register[i].address[j].start + plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[0].register[i].address[j].length - length
                      }
                    }
                    return 0
                  }
                }
              }
            } else if (dataType === 'bit16') {
              for (let i = 0; i < plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register.length; i++) {
                if (plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register[i].name === addressType) {
                  if (plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register[i].split === 0) {
                    return plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register[i].start + address
                  } else {
                    let length = 0
                    for (let j = 0; j < plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register[i].address.length; j++) {
                      length += plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register[i].address[j].length
                      if (address > length) {
                        return address + plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register[i].address[j].start + plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[1].register[i].address[j].length - length
                      }
                    }
                    return 0
                  }
                }
              }
            } else if (dataType === 'bit32') {
              for (let i = 0; i < plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register.length; i++) {
                if (plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register[i].name === addressType) {
                  if (plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register[i].split === 0) {
                    return plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register[i].start + address
                  } else {
                    let length = 0
                    for (let j = 0; j < plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register[i].address.length; j++) {
                      length += plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register[i].address[j].length
                      if (address > length) {
                        return address + plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register[i].address[j].start + plcDataType.plc[deTypeIndex].deviceType[deNameIndex].dataType[2].register[i].address[j].length - length
                      }
                    }
                    return 0
                  }
                }
              }
            }
          }
        }
      }
    }
    return 0
  }
}
