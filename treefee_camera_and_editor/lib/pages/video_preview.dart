import 'dart:io';
import 'package:flutter/material.dart';
import 'package:ffmpeg_kit_flutter/ffmpeg_kit.dart';
import 'package:flutter/services.dart';
import 'package:video_player/video_player.dart';
import 'package:path_provider/path_provider.dart';
import 'package:file_picker/file_picker.dart';
import 'package:go_router/go_router.dart';

class Preview extends StatefulWidget {
  final String? outputVideoPath;

  const Preview(this.outputVideoPath, {Key? key}) : super(key: key);

  @override
  State<Preview> createState() => _PreviewState();
}

class _PreviewState extends State<Preview> {
  late VideoPlayerController _controller;
  static const MethodChannel _channel = MethodChannel('com.treefe/dataChannel');

  String? musicPath;
  String? mixedVideoPath;

  @override
  void initState() {
    super.initState();
    _initializeVideo(widget.outputVideoPath!);
  }

  void _initializeVideo(String path) {
    _controller = VideoPlayerController.file(File(path))
      ..initialize().then((_) {
        setState(() {});
        _controller.play();
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> pickMusicAndMix() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['mp3', 'flac', 'aac']
    );

    if (result != null) {
      musicPath = result.files.single.path;
      mixAudio();
    }
  }

  void mixAudio() async {
    if (musicPath == null) return;

    Directory tempDir = await getTemporaryDirectory();
    mixedVideoPath = '${tempDir.path}/${DateTime.now().microsecondsSinceEpoch}_reel_output.mp4';

    double videoDuration = _controller.value.duration.inSeconds.toDouble();
    String ffmpegCommand = "-y -i ${widget.outputVideoPath!} -i '$musicPath' -filter_complex '[1:a]atrim=duration=$videoDuration[a];[0:a][a]amix=inputs=2:duration=shortest' -c:v copy $mixedVideoPath";

    FFmpegKit.executeAsync(ffmpegCommand, (session) async {
      final returnCode = await session.getReturnCode();
      if (returnCode != null && returnCode.isValueSuccess()) {
        print("Video mixed successfully");
        setState(() {
          _initializeVideo(mixedVideoPath!);
        });
      } else {
        print("Error occurred: ${returnCode}");
      }
    }, (log) => print(log.getMessage()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Column(
        children: [
          Expanded(
            child: AspectRatio(
              aspectRatio: _controller.value.aspectRatio,
              child: _controller.value.isInitialized
                  ? VideoPlayer(_controller)
                  : const Center(child: CircularProgressIndicator()),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              TextButton(
                onPressed: pickMusicAndMix,
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.all(Colors.green),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.music_note, color: Colors.white),
                    SizedBox(width: 8),
                    Text("Add Music", style: TextStyle(color: Colors.white)),
                  ],
                ),
              ),
              TextButton(
                onPressed: () async {
                  context.pop();
                  context.pop();
                  await _channel.invokeMethod('sendVideoToReactNative', mixedVideoPath);
                  await _channel.invokeMethod('closeFlutterActivity');

                },
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.all(Colors.green),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.done, color: Colors.white),
                    SizedBox(width: 8),
                    Text("Done", style: TextStyle(color: Colors.white)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
