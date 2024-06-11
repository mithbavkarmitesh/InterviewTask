#
# Generated file, do not edit.
#

Pod::Spec.new do |s|
  s.name             = 'FlutterPluginRegistrant'
  s.version          = '0.0.1'
  s.summary          = 'Registers plugins with your Flutter app'
  s.description      = <<-DESC
Depends on all your plugins, and provides a function to register them.
                       DESC
  s.homepage         = 'https://flutter.dev'
  s.license          = { :type => 'BSD' }
  s.author           = { 'Flutter Dev Team' => 'flutter-dev@googlegroups.com' }
  s.ios.deployment_target = '12.0'
  s.source_files =  "Classes", "Classes/**/*.{h,m}"
  s.source           = { :path => '.' }
  s.public_header_files = './Classes/**/*.h'
  s.static_framework    = true
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
  s.dependency 'Flutter'
  s.dependency 'camerawesome'
  s.dependency 'device_info_plus'
  s.dependency 'emoji_picker_flutter'
  s.dependency 'ffmpeg_kit_flutter'
  s.dependency 'file_picker'
  s.dependency 'flutter_image_compress_common'
  s.dependency 'fluttertoast'
  s.dependency 'image_editor_common'
  s.dependency 'image_gallery_saver'
  s.dependency 'image_picker_ios'
  s.dependency 'insta_assets_crop'
  s.dependency 'path_provider_foundation'
  s.dependency 'permission_handler_apple'
  s.dependency 'photo_manager'
  s.dependency 'rive_common'
  s.dependency 'shared_preferences_foundation'
  s.dependency 'vibration'
  s.dependency 'video_player_avfoundation'
  s.dependency 'video_thumbnail'
end
