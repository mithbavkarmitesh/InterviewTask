package com.treefe;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;
import java.util.Collections;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;

import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.embedding.engine.FlutterEngineCache;
import io.flutter.embedding.engine.dart.DartExecutor;
import io.flutter.plugins.GeneratedPluginRegistrant;

public class MainApplication extends Application implements ReactApplication {
    private FlutterEngine flutterEngineDefault;
    private FlutterEngine flutterEnginePage1;
    private FlutterEngine flutterEnginePage2;

    private final ReactNativeHost mReactNativeHost =
        new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            @SuppressWarnings("UnnecessaryLocalVariable")
            List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be autolinked yet can be added manually here, for example:
            packages.add(new MyReactNativePackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
            return BuildConfig.IS_HERMES_ENABLED;
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load();
        }
        ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

        // Initialize and cache Flutter engines
        flutterEngineDefault = new FlutterEngine(this);
        flutterEngineDefault.getNavigationChannel().setInitialRoute("/camera");
        flutterEngineDefault.getDartExecutor().executeDartEntrypoint(
                DartExecutor.DartEntrypoint.createDefault()
        );
        GeneratedPluginRegistrant.registerWith(flutterEngineDefault);
        FlutterEngineCache.getInstance().put("camera_engine", flutterEngineDefault);

        flutterEnginePage1 = new FlutterEngine(this);
        flutterEnginePage1.getNavigationChannel().setInitialRoute("/picker");
        flutterEnginePage1.getDartExecutor().executeDartEntrypoint(
                DartExecutor.DartEntrypoint.createDefault()
        );
        GeneratedPluginRegistrant.registerWith(flutterEnginePage1);
        FlutterEngineCache.getInstance().put("media_picker_engine", flutterEnginePage1);



        flutterEnginePage2 = new FlutterEngine(this);
        flutterEnginePage2.getNavigationChannel().setInitialRoute("/video_screen");
        flutterEnginePage2.getDartExecutor().executeDartEntrypoint(
                DartExecutor.DartEntrypoint.createDefault()
        );
        GeneratedPluginRegistrant.registerWith(flutterEnginePage2);
        FlutterEngineCache.getInstance().put("reel_engine", flutterEnginePage2);
    }

    public FlutterEngine getDefaultFlutterEngine() {
        return flutterEngineDefault;
    }

    public FlutterEngine getPage1FlutterEngine() {
        return flutterEnginePage1;
    }
}

// Define the package
class MyReactNativePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new FlutterModuleStarter(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
