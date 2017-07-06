export function getPlatform() {
  if (process.env.TARGET === 'electron') {
    return require('os').platform()
  }

  if (process.env.TARGET === 'cordova') {
    if (window._cordovaNative) {
      return 'android'
    } else if (window._nativeReady) {
      return 'ios'
    } else {
      // TODO: blackberry, windows phone...
      return 'cordova'
    }
  }

  return 'browser'
}
