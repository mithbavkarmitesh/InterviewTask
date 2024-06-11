import 'package:fluttertoast/fluttertoast.dart';
import 'dart:io';
import 'package:camerawesome/camerawesome_plugin.dart';
import 'package:camerawesome/pigeon.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:path_provider/path_provider.dart';


class CameraPage extends StatefulWidget {
  const CameraPage({super.key});

  @override
  State<CameraPage> createState() => _CameraPageState();
}

class _CameraPageState extends State<CameraPage> {
  bool showGridLines = false;
  static const platformChannel = MethodChannel('com.treefe/dataChannel');

  String? _data;

  Future<void> _handleMethodCall(MethodCall call) async {
    switch (call.method) {
      case 'sendData':
        setState(() {
          _data = call.arguments;
        });
        Fluttertoast.showToast(msg:_data!);
        break;
      default:
        throw PlatformException(
          code: 'Unimplemented',
          details: 'Platform channel not implemented for method ${call.method}',
        );
    }
  }

  @override
  void initState() {
    super.initState();
    platformChannel.setMethodCallHandler(_handleMethodCall);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.white,
        child: _data != null ? CameraAwesomeBuilder.awesome(
          onMediaCaptureEvent: (event) {
            switch ((event.status, event.isPicture, event.isVideo)) {
              case (MediaCaptureStatus.capturing, true, false):
                debugPrint('Capturing picture...');
              case (MediaCaptureStatus.success, true, false):
                event.captureRequest.when(
                  single: (single) {
                    context.replace('/editor', extra: { "imagePath": single.file?.path, "accessToken": _data });
                  },
                  multiple: (multiple) {
                    multiple.fileBySensor.forEach((key, value) {
                      debugPrint('multiple image taken: $key ${value?.path}');
                    });
                  },
                );
              case (MediaCaptureStatus.failure, true, false):
                debugPrint('Failed to capture picture: ${event.exception}');
              case (MediaCaptureStatus.capturing, false, true):
                debugPrint('Capturing video...');
              case (MediaCaptureStatus.success, false, true):
                event.captureRequest.when(
                  single: (single) {
                    debugPrint('Video saved: ${single.file?.path}');
                  },
                  multiple: (multiple) {
                    multiple.fileBySensor.forEach((key, value) {
                      debugPrint('multiple video taken: $key ${value?.path}');
                    });
                  },
                );
              case (MediaCaptureStatus.failure, false, true):
                debugPrint('Failed to capture video: ${event.exception}');
              default:
                debugPrint('Unknown event: $event');
            }
          },
          saveConfig: SaveConfig.photo(
            pathBuilder: (sensors) async {
              final Directory extDir = await getTemporaryDirectory();
              final testDir = await Directory(
                '${extDir.path}/camerawesome',
              ).create(recursive: true);
              if (sensors.length == 1) {
                final String filePath = '${testDir.path}/${DateTime.now().millisecondsSinceEpoch}.jpg';
                return SingleCaptureRequest(filePath, sensors.first);
              } else {
                return MultipleCaptureRequest(
                  {
                    for (final sensor in sensors)
                      sensor:
                      '${testDir.path}/${sensor.position == SensorPosition.front ? 'front_' : "back_"}${DateTime.now().millisecondsSinceEpoch}.jpg',
                  },
                );
              }
            },
            exifPreferences: ExifPreferences(saveGPSLocation: false),

          ),
          sensorConfig: SensorConfig.single(
            sensor: Sensor.position(SensorPosition.back),
            flashMode: FlashMode.auto,
            aspectRatio: CameraAspectRatios.ratio_16_9,
            zoom: 0.0,
          ),
          enablePhysicalButton: true,
          topActionsBuilder: (state) => AwesomeTopActions(
            state: state,
            children: [
              InkWell(
                onTap: () => setState(() {
                  showGridLines = !showGridLines;
                }),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(top: 34),
                  decoration: BoxDecoration(
                      color: Colors.black26,
                      borderRadius: BorderRadius.circular(50)
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.grid_3x3, color: Colors.white,),

                    ],
                  ),
                ),
              )
            ],
          ),
          middleContentBuilder: (state) => Column(
            children: [
              const Spacer(),
              AwesomeFilterWidget(state: state),
              Builder(
                builder: (context) => Container(
                  color: AwesomeThemeProvider.of(context)
                      .theme
                      .bottomActionsBackgroundColor,
                  height: 8,
                ),
              ),
            ],
          ),
          bottomActionsBuilder: (state) => AwesomeBottomActions(
            state: state,
            left: AwesomeFlashButton(
              state: state,
            ),
            right: AwesomeCameraSwitchButton(
              state: state,
              scale: 1.1,
              onSwitchTap: (state) {
                state.switchCameraSensor(
                  aspectRatio: state.sensorConfig.aspectRatio,
                );
              },
            ),
          ),
          previewDecoratorBuilder: (state, preview) {
            return showGridLines ? AspectRatio(aspectRatio: 16/9, child: CustomPaint(
              painter: GridPainter(),
            ),) : const SizedBox();
          },
          previewAlignment: Alignment.center,
          previewFit: CameraPreviewFit.contain,
          onPreviewScaleBuilder: (state) => OnPreviewScale(
            onScale: (scale) {
              state.sensorConfig.setZoom(scale);
            },
          ),
          availableFilters: awesomePresetFiltersList,
        ) : const SizedBox(),
      ),
    );
  }
}



class GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    double gridWidth = 1; // Adjust the thickness of the grid lines
    var paint = Paint()
      ..color = Colors.white.withOpacity(0.8) // Adjust the color and opacity of the grid lines
      ..style = PaintingStyle.stroke
      ..strokeWidth = gridWidth;

    int numOfDivisions = 3; // Number of divisions per axis
    double stepX = size.width / numOfDivisions;
    double stepY = size.height / numOfDivisions;

    // Draw vertical lines
    for (int i = 1; i < numOfDivisions; i++) {
      canvas.drawLine(Offset(stepX * i, 0), Offset(stepX * i, size.height), paint);
    }

    // Draw horizontal lines
    for (int i = 1; i < numOfDivisions; i++) {
      canvas.drawLine(Offset(0, stepY * i), Offset(size.width, stepY * i), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}