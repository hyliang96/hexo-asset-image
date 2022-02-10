'use strict';
var cheerio = require('cheerio');

// http://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
function getPosition(str, m, i) {
    return str.split(m, i).join(m).length;
}

hexo.extend.filter.register('after_post_render', function(data) {
    var config = hexo.config;
    if (config.post_asset_folder) {
        var link = data.permalink;
        var beginPos = getPosition(link, '/', 3) + 1;
        // In hexo 3.1.1, the permalink of "about" page is like ".../about/index.html".
        var endPos = link.lastIndexOf('/') + 1;
        var filename = link.substring(endPos);
        link = link.substring(beginPos, endPos);
        
        // permalink | posts/:abbrlink/ | posts/:abbrlink.html |
        // filename  | index.html       | d6d2f549             |
        // link      | posts/d6d2f549/  | post/                |
        //
        // img format| {% asset_img 20190522103754.jpg %}| ![](xxx.jpg) | ![](title/xxx.jpg) |
        // img src   | d6d2f549/xxx.jpg                  | xxx.jpg      | title/xxx.jpg      |
        
        var toprocess = ['excerpt', 'more', 'content'];
        for (var i = 0; i < toprocess.length; i++) {
            var key = toprocess[i];

            var $ = cheerio.load(data[key], {
                ignoreWhitespace: false,
                xmlMode: false,
                lowerCaseTags: false,
                decodeEntities: false
            });

            $('img').each(function() {
                let src_key = ''
                if ($(this).attr('src')) {
                    src_key = 'src'
                } else if ($(this).attr('data-src')) {
                    src_key = 'data-src'
                }
                // For windows style path, we replace '\' to '/'.
                var src = $(this).attr(src_key).replace('\\', '/');
                if (!/http[s]*.*|\/\/.*/.test(src)) {
                    // For "about" page, the first part of "src" can't be removed.
                    // In addition, to support multi-level local directory.
                    var linkArray = link.split('/').filter(function(elem) {
                        return elem != '';
                    });
                    var srcArray = src.split('/').filter(function(elem) {
                        return elem != '';
                    });
                    if (linkArray[linkArray.length - 1] == srcArray[0])
                        srcArray.shift();
                    src = srcArray.join('/');

                    var root = config.root && config.root.endsWith('/') ? config.root : '/'

                    var link_cut = link.substring(0, link.length - 1);
                    var final_dir = link_cut.substring(link_cut.lastIndexOf('/') + 1);
                    var abbrlink = data.abbrlink;
                    if (filename==abbrlink+'.html' || final_dir==abbrlink) {
                        if (src.indexOf(abbrlink) > -1) {
                            // 使用 hexo asset_img：{% asset_img 20190522103754.jpg %}

                            // root = /
                            // link = posts/
                            // abbrlink = d6d2f549
                            // src = d6d2f549/20190522103754.jpg
                            $(this).attr(src_key, root + link + src);
                        } else {
                            // 使用 markdown 标准语法：![图片](title/20190522103754.jpg)
                            // 或者 typora 其中一个用法：![图片](20190522103754.jpg)

                            // root = /
                            // link = posts/
                            // abbrlink = d6d2f549
                            // src = title/20190522103754.jpg
                            // 或者 src = 20190522103754.jpg
                            if (src.indexOf('/') > -1) {
                              src = src.substring(src.lastIndexOf('/') + 1);
                            }
                            if (final_dir == abbrlink) {
                                $(this).attr(src_key, root + link + src);
                            }
                            else {
                                $(this).attr(src_key, root + link + abbrlink + '/' + src);
                            }
                        }
                    } else {
                        $(this).attr(src_key, root + link + src);
                    }
                }
            });
            data[key] = $.html();
        }
    }
});
