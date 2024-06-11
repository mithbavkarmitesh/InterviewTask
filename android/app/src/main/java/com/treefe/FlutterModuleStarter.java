package com.treefe;

import android.content.Intent;
import android.os.Handler;
import android.os.Looper;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;

import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.embedding.engine.FlutterEngineCache;
import io.flutter.plugin.common.MethodChannel;

public class FlutterModuleStarter extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;
    private MethodChannel methodChannel;

    FlutterModuleStarter(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "FlutterModuleStarter";
    }

    public static void sendDataToReactNative(ArrayList<String> data) {
        if (reactContext != null) {
            WritableArray writableArray = new WritableNativeArray();
            for (String item : data) {
                writableArray.pushString(item);
            }
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("FlutterData", writableArray);
        }
    }

    public static void sendVideoToReactNative(String data) {
        if (reactContext != null) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("FlutterData", data);
        }
    }

    @ReactMethod
    public void startFlutterCameraScreen(String accessToken, Callback callback) {
        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(reactContext, MyFlutterActivity.class);
                intent.putExtra("cached_engine_id", "camera_engine");
                if (intent.resolveActivity(reactContext.getPackageManager()) != null) {
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    reactContext.startActivity(intent);
                }

                new Handler(Looper.getMainLooper()).post(() -> {
                    FlutterEngine flutterEngine = FlutterEngineCache.getInstance().get("camera_engine");
                    methodChannel = new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), "com.treefe/dataChannel");
                    methodChannel.invokeMethod("sendData", accessToken, new MethodChannel.Result() {
                        @Override
                        public void success(Object result) {
                            callback.invoke("Data sent successfully");
                        }

                        @Override
                        public void error(String errorCode, String errorMessage, Object errorDetails) {
                            callback.invoke("Error sending data: " + errorMessage);
                        }

                        @Override
                        public void notImplemented() {
                            callback.invoke("Method not implemented on Flutter side");
                        }
                    });
                });
            }
        });
    }


    @ReactMethod
    public void startFlutterMediaPickerScreen(String accessToken, Callback callback) {
        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(reactContext, MyFlutterActivity.class);
                intent.putExtra("cached_engine_id", "media_picker_engine");
                if (intent.resolveActivity(reactContext.getPackageManager()) != null) {
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    reactContext.startActivity(intent);
                }

                new Handler(Looper.getMainLooper()).post(() -> {
                    FlutterEngine flutterEngine = FlutterEngineCache.getInstance().get("media_picker_engine");
                    methodChannel = new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), "com.treefe/dataChannel");
                    methodChannel.invokeMethod("sendData", accessToken, new MethodChannel.Result() {
                        @Override
                        public void success(Object result) {
                            callback.invoke("Data sent successfully");
                        }

                        @Override
                        public void error(String errorCode, String errorMessage, Object errorDetails) {
                            callback.invoke("Error sending data: " + errorMessage);
                        }

                        @Override
                        public void notImplemented() {
                            callback.invoke("Method not implemented on Flutter side");
                        }
                    });
                });
            }
        });
    }

    @ReactMethod
    public void startFlutterVideoScreen(Callback callback) {
        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(reactContext, MyFlutterActivity.class);
                intent.putExtra("cached_engine_id", "reel_engine");
                if (intent.resolveActivity(reactContext.getPackageManager()) != null) {
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    reactContext.startActivity(intent);
                }
            }
        });
    }


}
