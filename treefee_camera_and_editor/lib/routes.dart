import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import 'package:treefee_camera_and_editor/camera_screen.dart';
import 'package:treefee_camera_and_editor/editor_screen.dart';
import 'package:treefee_camera_and_editor/pages/trimmer_view.dart';
import 'package:treefee_camera_and_editor/pages/video_preview.dart';
import 'package:treefee_camera_and_editor/pages/video_recorder.dart';
import 'package:treefee_camera_and_editor/picker_screen.dart';

final GoRouter router = GoRouter(
  routes: <RouteBase>[
    GoRoute(
      path: '/camera',
      builder: (BuildContext context, GoRouterState state) {
        return const CameraPage();
      },
    ),
    GoRoute(
      path: '/editor',
      builder: (BuildContext context, GoRouterState state) {
        return EditorScreen(imagePath: (state.extra as dynamic)?["imagePath"], imagePathList: (state.extra as dynamic)?["imagePathList"], accessToken: (state.extra as dynamic)?["accessToken"],);
      },
    ),
    GoRoute(
      path: '/picker',
      builder: (BuildContext context, GoRouterState state) {
        return const PickerScreen();
      },
    ),
    GoRoute(
      path: '/video_screen',
      builder: (BuildContext context, GoRouterState state) {
        return const VideoRecorderScreen();
      },
    ),
    GoRoute(
      path: '/trimmer_view',
      builder: (BuildContext context, GoRouterState state) {
        return TrimmerView((state.extra as dynamic)["file"]);
      },
    ),
    GoRoute(
      path: '/preview_screen',
      builder: (BuildContext context, GoRouterState state) {
        return Preview((state.extra as dynamic)["outputPath"]);
      },
    ),
  ],
);