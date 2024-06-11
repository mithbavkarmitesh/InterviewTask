import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:insta_assets_picker/insta_assets_picker.dart';
import 'package:go_router/go_router.dart';

class PickerScreen extends StatefulWidget {
  const PickerScreen({super.key});

  @override
  State<PickerScreen> createState() => _PickerScreenState();
}

class _PickerScreenState extends State<PickerScreen> {
  static const platformChannel = MethodChannel('com.treefe/dataChannel');

  String? _data;

  Future<void> _handleMethodCall(MethodCall call) async {
    switch (call.method) {
      case 'sendData':
        setState(() {
          _data = call.arguments;
        });

        InstaAssetPicker.pickAssets(
          context,
          maxAssets: 10,
          gridCount: 3,
          // pickerTheme: widget.getPickerTheme(context),
          actionsBuilder: (
            BuildContext context,
            ThemeData? pickerTheme,
            double height,
            VoidCallback unselectAll,
          ) => [
            InstaPickerCircleIconButton.unselectAll(
              onTap: unselectAll,
              theme: pickerTheme,
              size: height,
            ),
          ],
          // specialItemBuilder: (BuildContext context, _, __) {
          //   // return a button that open the camera
          //   return ElevatedButton(
          //     onPressed: () {
          //       Navigator.pop(context);
          //       context.push('/camera');
          //     },
          //     style: ElevatedButton.styleFrom(
          //       shape: const RoundedRectangleBorder(),
          //       foregroundColor: Colors.white,
          //       backgroundColor: Colors.transparent,
          //     ),
          //     child: const Column(
          //       mainAxisAlignment: MainAxisAlignment.center,
          //       children: [
          //         Icon(
          //           Icons.camera_alt,
          //           color: Colors.white,
          //           size: 24,
          //         ),
          //         SizedBox(height: 4,),
          //         Text(
          //           "Open Camera",
          //           style: TextStyle(
          //             color: Colors.white,
          //             fontSize: 10,
          //           ),
          //           textAlign: TextAlign.center,
          //         ),
          //       ],
          //     ),
          //   );
          // },
          // since the list is revert, use prepend to be at the top
          specialItemPosition: SpecialItemPosition.prepend,
          closeOnComplete: false,
          onCompleted: (cropStream) {
            cropStream.listen((event) {
              if(event.progress == 1) {
                Navigator.pop(context);
                context.push('/editor', extra: { "imagePathList": event.croppedFiles.map<String?>((e) => e.path).toList(), "accessToken": _data });
              }
            });
          },
        );

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
    return const Scaffold();
  }
}
