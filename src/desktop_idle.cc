
#define NOMINMAX
#include <node_api.h>
#include "idle.h"

namespace desktopIdle {

napi_value desktopIdleGetIdleTime(napi_env env, napi_callback_info info) {
  double idleSeconds = getTime();
  napi_value result;
  napi_create_double(env, idleSeconds, &result);
  return result;
}

napi_value desktopIdleStartMonitoring(napi_env env, napi_callback_info info) {
  start();
  return nullptr;
}

napi_value desktopIdleStopMonitoring(napi_env env, napi_callback_info info) {
  stop();
  return nullptr;
}

napi_value init(napi_env env, napi_value exports) {
  napi_value fn;
  
  napi_create_function(env, "getIdleTime", NAPI_AUTO_LENGTH, 
                       desktopIdleGetIdleTime, nullptr, &fn);
  napi_set_named_property(env, exports, "getIdleTime", fn);
  
  napi_create_function(env, "startMonitoring", NAPI_AUTO_LENGTH, 
                       desktopIdleStartMonitoring, nullptr, &fn);
  napi_set_named_property(env, exports, "startMonitoring", fn);
  
  napi_create_function(env, "stopMonitoring", NAPI_AUTO_LENGTH, 
                       desktopIdleStopMonitoring, nullptr, &fn);
  napi_set_named_property(env, exports, "stopMonitoring", fn);
  
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace desktopIdle