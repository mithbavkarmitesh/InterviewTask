package com.treefe;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

import java.util.ArrayList;

import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.embedding.engine.FlutterEngineCache;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugins.GeneratedPluginRegistrant;

public class MyFlutterActivity extends FlutterActivity {

   @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        GeneratedPluginRegistrant.registerWith(flutterEngine);
        new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), "com.treefe/dataChannel")
        .setMethodCallHandler(
            (call, result) -> {
                if (call.method.equals("sendDataToNative")) {
                    ArrayList<String> data = call.arguments();
                    sendDataToReactNative(data);
                    result.success("Data sent to React Native");
                } else if (call.method.equals("closeFlutterActivity")) {
                    finish();
                    result.success("Flutter activity closed");
                } else if(call.method.equals("sendVideoToReactNative")) {
                    String data = call.arguments();
                    sendVideoToReactNative(data);
                } else {
                    result.notImplemented();
                }
            }
        );
    }

    private void sendDataToReactNative(ArrayList<String> data) {
        FlutterModuleStarter.sendDataToReactNative(data);
    }

    private void sendVideoToReactNative(String data) {
        FlutterModuleStarter.sendVideoToReactNative(data);
    }


    @Override
    public String getCachedEngineId() {
        return getIntent().getStringExtra("cached_engine_id");
    }

    @Override
    public FlutterEngine provideFlutterEngine(@NonNull Context context) {
        return FlutterEngineCache.getInstance().get("my_engine_id");
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}
