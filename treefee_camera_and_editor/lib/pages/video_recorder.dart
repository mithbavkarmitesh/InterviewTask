// import 'dart:developer';
// import 'dart:io';
// import 'package:camerawesome/camerawesome_plugin.dart';
// import 'package:camerawesome/pigeon.dart';
// import 'package:flutter/material.dart';
// import 'package:go_router/go_router.dart';
// import 'package:path_provider/path_provider.dart';
// import 'package:treefee_camera_and_editor/pages/trimmer_view.dart';

// class VideoRecorderScreen extends StatelessWidget {
//   const VideoRecorderScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Container(
//         color: Colors.white,
//         child: CameraAwesomeBuilder.awesome(
//           onMediaCaptureEvent: (event) {
//             switch ((event.status)) {
//               case (MediaCaptureStatus.capturing):
//               case (MediaCaptureStatus.success):
//                 event.captureRequest.when(
//                   single: (single) {
//                     if(single.file?.path != null) {
//                       context.push('/trimmer_view', extra: { "file": File(single.file!.path) });
//                     }
//                   },
//                 );
//               case (MediaCaptureStatus.failure):
//                 log('NEW: Failed to capture video: ${event.exception}');
//               default:
//                 log('NEW: Unknown event: ${event.status}, isVideo: ${event.isVideo}');
//             }
//           },
//           saveConfig: SaveConfig.video(
//             pathBuilder: (sensors) async {
//               final Directory extDir = await getTemporaryDirectory();
//               final testDir = await Directory(
//                 '${extDir.path}/camerawesome',
//               ).create(recursive: true);
//               if (sensors.length == 1) {
//                 final String filePath =
//                     '${testDir.path}/${DateTime.now().millisecondsSinceEpoch}.jpg';
//                 return SingleCaptureRequest(filePath, sensors.first);
//               }
//               // Separate pictures taken with front and back camera
//               return MultipleCaptureRequest(
//                 {
//                   for (final sensor in sensors)
//                     sensor:
//                     '${testDir.path}/${sensor.position == SensorPosition.front ? 'front_' : "back_"}${DateTime.now().millisecondsSinceEpoch}.jpg',
//                 },
//               );
//             },
//             videoOptions: VideoOptions(
//               enableAudio: true,
//               ios: CupertinoVideoOptions(
//                 fps: 10,
//               ),
//               android: AndroidVideoOptions(
//                 bitrate: 6000000,
//                 fallbackStrategy: QualityFallbackStrategy.lower,
//               ),
//             ),
//           ),
//           sensorConfig: SensorConfig.single(
//             sensor: Sensor.position(SensorPosition.back),
//             flashMode: FlashMode.auto,
//             aspectRatio: CameraAspectRatios.ratio_4_3,
//             zoom: 0.0,
//           ),
//           enablePhysicalButton: true,
//           previewAlignment: Alignment.center,
//           previewFit: CameraPreviewFit.contain,
//           availableFilters: awesomePresetFiltersList,
//         ),
//       ),
//     );
//   }
// }

import 'dart:developer';
import 'dart:io';
import 'package:camerawesome/camerawesome_plugin.dart';
import 'package:camerawesome/pigeon.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:path_provider/path_provider.dart';
import 'package:treefee_camera_and_editor/pages/trimmer_view.dart';

class VideoRecorderScreen extends StatefulWidget {
  const VideoRecorderScreen({super.key});

  @override
  State<VideoRecorderScreen> createState() => _VideoRecorderScreenState();
}

class _VideoRecorderScreenState extends State<VideoRecorderScreen> {
  bool isLoaded = false;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    Future.delayed(
        const Duration(seconds: 3),
        () => {
              setState(() {
                isLoaded = true;
              })
            });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: isLoaded
          ? Container(
              color: Colors.white,
              child: CameraAwesomeBuilder.awesome(
                onMediaCaptureEvent: (event) {
                  switch ((event.status)) {
                    case (MediaCaptureStatus.capturing):
                      log('NEW: Capturing video...');
                    case (MediaCaptureStatus.success):
                      event.captureRequest.when(
                        single: (single) {
                          log('NEW: Video saved: ${single.file?.path}');
                          if (single.file?.path != null) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    TrimmerView(File(single.file!.path)),
                              ),
                            );
                          }
                        },
                        multiple: (multiple) {
                          multiple.fileBySensor.forEach((key, value) {
                            log('NEW: multiple video taken: $key ${value?.path}');
                          });
                        },
                      );
                    case (MediaCaptureStatus.failure):
                      log('NEW: Failed to capture video: ${event.exception}');
                    default:
                      log('NEW: Unknown event: ${event.status}, isVideo: ${event.isVideo}');
                  }
                },
                saveConfig: SaveConfig.video(
                  pathBuilder: (sensors) async {
                    final Directory extDir = await getTemporaryDirectory();
                    final testDir = await Directory(
                      '${extDir.path}/camerawesome',
                    ).create(recursive: true);
                    if (sensors.length == 1) {
                      final String filePath =
                          '${testDir.path}/${DateTime.now().millisecondsSinceEpoch}.jpg';
                      return SingleCaptureRequest(filePath, sensors.first);
                    }
                    // Separate pictures taken with front and back camera
                    return MultipleCaptureRequest(
                      {
                        for (final sensor in sensors)
                          sensor:
                              '${testDir.path}/${sensor.position == SensorPosition.front ? 'front_' : "back_"}${DateTime.now().millisecondsSinceEpoch}.jpg',
                      },
                    );
                  },
                  videoOptions: VideoOptions(
                    enableAudio: true,
                    ios: CupertinoVideoOptions(
                      fps: 10,
                    ),
                    android: AndroidVideoOptions(
                      bitrate: 6000000,
                      fallbackStrategy: QualityFallbackStrategy.lower,
                    ),
                  ),
                ),
                sensorConfig: SensorConfig.single(
                  sensor: Sensor.position(SensorPosition.back),
                  flashMode: FlashMode.auto,
                  aspectRatio: CameraAspectRatios.ratio_4_3,
                  zoom: 0.0,
                ),
                enablePhysicalButton: true,
                previewAlignment: Alignment.center,
                previewFit: CameraPreviewFit.contain,
                availableFilters: awesomePresetFiltersList,
              ),
            )
          : const Center(
              child: Text("Debugger by Gurkaran, Please wait"),
            ),
    );
  }
}
