import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_editor_plus/image_editor_plus.dart';

class EditorScreen extends StatefulWidget {
  final String? imagePath;
  final List<String?>? imagePathList;
  final String? accessToken;

  EditorScreen({ this.imagePathList, this.imagePath, this.accessToken });

  @override
  createState() => _ImageEditorExampleState();
}

class _ImageEditorExampleState extends State<EditorScreen> {
  Uint8List? imageData;
  List<Uint8List>? imageDataList;

  Future imageFileToUint8List() async {
    if(widget.imagePath != null) {
      File imageFile = File(widget.imagePath!);
      Uint8List bytes = await imageFile.readAsBytes();
      setState(() {
        imageData = bytes;
      });
    } else {
      List<Uint8List> _imageDataList = [];

      for(var path in widget.imagePathList!) {
        if(path != null) {
          File imageFile = File(path);
          Uint8List bytes = await imageFile.readAsBytes();

          _imageDataList.add(bytes);
        }
      }

      setState(() {
        imageDataList = _imageDataList;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    imageFileToUint8List();
  }

  @override
  void dispose() {
    super.dispose();

    // saveFiles();

  }

  // Future saveFiles() async {
  //   if(widget.imagePath != null) {
  //     await ImageGallerySaver.saveImage(imageData!);
  //   } else {
  //     for(var data in imageDataList!) {
  //       await ImageGallerySaver.saveImage(data);
  //     }
  //   }
  //
  //   Utils.toast("Pictures saved");
  // }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: imageData != null || imageDataList != null ? ImageEditor(
        image: imageData,
        images: imageDataList,
        accessToken: widget.accessToken,
      ): const Center(
        child: CircularProgressIndicator(),
      )
    );
  }
}