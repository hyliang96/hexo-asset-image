# hexo-asset-image

支持hexo5。

官方`hexo-asset-image`插件，在同时使用`hexo-abbrlink`时，会导致图片路径错误，本插件是基于官方插件的修改，为了兼容`hexo-abbrlink`插件。

支持`.textbundle`文件格式，这是一个macOS上显示为文件的文件夹，内含markdown文件和assets（图片等附件）。

# Usege

```shell
npm install https://github.com/foreveryang321/hexo-asset-image.git --save
```

# Example

> 同时使用hexo-abbrlink

```yaml
root: /
permalink: posts/:abbrlink.html # 或 posts/:abbrlink/ 或 :abbrlink.html 或 :abbrlink/ ， 只要结尾是 :abbrlink.html 或 :abbrlink/ 皆支持
abbrlink:
  alg: crc32  # 算法：crc16(default) and crc32
  rep: hex    # 进制：dec(default) and hex
```

> 目录结构

要求：`xxx.md`文件内引用的图像，必须在此md文件所在目录下与md文件同名文件夹`xxx/`内。

```shell
MacGesture2-Publish
├── apppicker.jpg
├── logo.jpg
└── rules.jpg
MacGesture2-Publish.md
```

> 用法

Make sure `post_asset_folder: true` in your `_config.yml`.

Just use `![logo](logo.jpg)` Or `![logo](MacGesture2-Publish/logo.jpg)` Or `![logo](D:/MacGesture2-Publish/logo.jpg)` Or `{% asset_img logo.jpg %}` to insert `logo.jpg`
