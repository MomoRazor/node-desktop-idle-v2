
#define NOMINMAX
#include <nan.h>
#include "idle.h"

namespace desktopIdle {

using Nan::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Number;
using v8::Value;
using v8::Context;

void desktopIdleGetIdleTime(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  double idleSeconds = getTime();
  args.GetReturnValue().Set(Number::New(isolate, static_cast<double>(idleSeconds)));
}

void desktopIdleStartMonitoring(const FunctionCallbackInfo<Value>& args) {
  start();
}

void desktopIdleStopMonitoring(const FunctionCallbackInfo<Value>& args) {
  stop();
}

void init(Local<Object> exports, Local<Value> module, Local<Context> context, void* priv) {
  Nan::SetMethod(exports, "getIdleTime", desktopIdleGetIdleTime);
  Nan::SetMethod(exports, "startMonitoring", desktopIdleStartMonitoring);
  Nan::SetMethod(exports, "stopMonitoring", desktopIdleStopMonitoring);
}

NODE_MODULE_CONTEXT_AWARE(desktopIdle, init)

}  // namespace desktopIdle