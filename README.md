# 使用Vue构建一个简易在线音乐播放器

# 一、前言

最近，在网上看到了一个叫网易云API的项目，项目大约有200个网易云的API：

首页：

![image-20210127102101548](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127102101548.png)

API（部分）：

![image-20210127102147077](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127102147077.png)



项目地址：[网易云音乐API](https://github.com/Binaryify/NeteaseCloudMusicApi)



突发奇想用它来做一个在线音乐播放器，刚好花了一天时间看了看Vue文档。

# 二、项目演示

## 1、首页推荐

进入首页，左侧歌曲列表推荐20首歌曲，中间歌曲封面以及歌词为推荐的第一首歌曲，点击开始播放就能播放，右侧为该首歌曲的热门评论（前二十条）。

![image-20210127120954335](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127120954335.png)

## 2、搜索歌曲

在搜索框输入搜索关键字，按下回车或者点击搜索图标即可搜索歌曲，歌曲搜索结果出现在左边歌曲列表。

![image-20210127121016355](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127121016355.png)

## 3、点击播放

点击左边歌曲列表中的歌曲，就可以开始播放，中间歌曲封面以及歌词变为正在播放的歌曲，右边热门评论为正在播放歌曲的热门评论。

![image-20210127121044378](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127121044378.png)



# 二、环境准备



## 1、搭建好API服务器

使用npm安装：

```shell
$ git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git

$ npm install
```

运行API服务器：

```shell
$ node app.js
```

此方式将会以默认端口3000启动，如果你想使用其他端口，可以使用以下命令：

Linux下：

```shell
$ PORT=4000 node app.js
```

windows下：

```shell
$ set PORT=4000 && node app.js
```

服务器启动默认 host 为localhost,如果需要更改, 可使用以下命令 : Mac/Linux

```shell
$ HOST=127.0.0.1 node app.js
```

windows 下使用 git-bash 或者 cmder 等终端执行以下命令 :

```shell
$ set HOST=127.0.0.1 && node app.js
```



还可以使用代理或者在Docker容器中运行，更多请看项目文档：[网易云API](https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi)



启动项目，打开浏览器，输入项目地址，测试一下：

![image-20210127103708117](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127103708117.png)

API服务器启动成功，你也可以修改启动IP地址将它部署在公网上，前提是你有一个公网IP或者有一台云服务器。



## 2、下载Vue

本项目使用Vue作为前端框架，所以首先去[Vue官网](https://cn.vuejs.org/)下载Vue。

我使用vscode作为开发工具，使用vscode打开项目文件夹，项目结构如图所示：

![image-20210127104234392](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127104234392.png)

，将刚刚下载好的Vue.js（这里使用Vue开发版）复制到js文件夹。



# 三、所有代码

下面是写好的前端页面

index.html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/index.css">
    <script src="/js/jquery-3.5.1.min.js"></script>
    <script src="/js/vue.js"></script>
    <link rel="shortcut icon" href="https://qzl-blog.oss-cn-hangzhou.aliyuncs.com/imgs/logo.ico" />
    <title>VueMusic音乐播放器</title>
</head>
<body>
    <!-- 主区域 -->
    <div id="main">
        <!-- 头部 -->
        <div id="head">
            <div id="logo">VueMusic</div>
            <div id="search">
                <input @keyup.enter="search" v-model="query" type="text" placeholder="回车搜索音乐">
                <div class="search_icon" @click="search"><svg>svg代码比较长，可以去阿里云矢量图标库复制图标。</svg></div>
            </div>
        </div>
        <!-- 中间部分 -->
        <div id="mid" >
            <!-- 歌曲列表 -->
            <div id="music_list">
                <ul v-if="isstart == 1">
                    <li v-for="music in musicList">
                        <div class="music" @click="musicPlay(music.id)">
                            <div class="play_logo"><svg>svg代码比较长，可以去阿里云矢量图标库复制图标。</svg></div>
                            <div class="music_name">{{music.name}} - {{music.ar[0].name}}</div>
                            <div v-if="music.mv > 0" class="mv_icon"><svg>svg代码比较长，可以去阿里云矢量图标库复制图标。</svg></div>
                        </div>
                    </li>
                </ul>
                <ul v-if="isstart == 0">
                    <li v-for="music in musicList">
                        <div class="music" @click="musicPlay(music.id)">
                            <div class="play_logo"><svg>svg代码比较长，可以去阿里云矢量图标库复制图标。</svg></div>
                            <div class="music_name">{{music.name}} - {{music.song.artists[0].name}}</div>
                            <div v-if="music.mv > 0" class="mv_icon"><svg>svg代码比较长，可以去阿里云矢量图标库复制图标。</svg></div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- :style="{backgroundImage:'url('+musicCover+')'}" -->
            <div id="music_cover" >
                <div class="bg bg-blur"></div>
                <div id="cover_img">
                    <div id="img">
                        <img v-bind:src="musicCover" alt="">
                    </div>
                    <div id="music_detail">
                        <span>{{musicCoverDetail}}</span>
                    </div>
                </div>
                <!-- //歌词区域 -->
                <div id="music_text">
                    <div id="now_lyric"></div>
                </div>
            </div>
            <!-- 热门评论 -->
            <div id="music_comments">
                <div id="comment_head">热门评论</div>
                <ul>
                    <li v-for="comment in commentList">
                        <div class="comment">
                            <div class="head_img">
                                <img :src="comment.user.avatarUrl" alt="">
                            </div>
                            <div class="comment_content">
                                <!-- 评论名字 -->
                                <div class="author_name">{{comment.user.nickname}}</div>
                                <!-- 评论内容 -->
                                <div class="comment_detail">
                                    {{comment.content}}
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 下面部分 -->
        <div id="foot">
            <audio id="audio" ontimeupdate="playFunction(this)" v-bind:src="musicPlayUrl" autoplay="autoplay" controls="controls" volume=0.5></audio>
        </div>
    </div>
    <div class="end">
        @Author By <a href="http://www.codeaper.cn" target="_blank">邱子林</a>
    </div>
</body>
<script src="../js/index.js"></script>
<script>
function playFunction(play){
          
          for(var i = 0;i < medisArray.length;i++){
              if(parseFloat(medisArray[i].t) <= play.currentTime && play.currentTime <= medisArray[i + 1].t && medisArray[i].c != ""){               
                $("#now_lyric").html(medisArray[i].c);
                break;
              }
          }
        }
</script>
</html>
```



注：图标我用的是阿里矢量图标库的svg图标，svg代码比较长，可以去阿里云矢量图标库复制图标。



index.css：

```css
*{
    margin: 0;
    padding: 0;
}

body{
    overflow: hidden;
    /* font-family: poppin,Tahoma,Arial,\5FAE\8F6F\96C5\9ED1,sans-serif; */
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, Arial, sans-serif;
}

audio:focus{
    outline: none;
}

input{
    border: none;
}

input:focus{
    outline: none;
}

ul{
    list-style: none;
}

/*包含以下四种的链接*/
a {
    text-decoration: none;
}
/*正常的未被访问过的链接*/
a:link {
    text-decoration: none;
}
/*已经访问过的链接*/
a:visited {
    text-decoration: none;
}
/*鼠标划过(停留)的链接*/
a:hover {
    text-decoration: none;
}
/* 正在点击的链接*/
a:active {
    text-decoration: none;
}

#main{
    width: 900px;
    height: 550px;
    margin: 200px auto;
    box-shadow: 0 0 .25rem rgba(95, 95, 95, .48);
}

/* 头部 */
#head{
    width: 100%;
    height: 60px;
    background-color: red;
}

#logo{
    float: left;
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    font-weight: 800;
    color: #fff;
}

/* 搜索框 */
#search{
    position: relative;
    float: right;
    width: 400px;
    height: 60px;
    
}

#search input{
    width: 200px;
    height: 30px;
    margin: 15px 100px;
    border-radius: 14px;
    padding: 0 12px;
}

.search_icon{
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 88px;
    width: 16px;
    height: 16px;
    /* border: 1px solid #000; */
}

.search_icon svg{
    width: 100%;
    margin: 0 auto;
}

/* 中间部分 */
#mid{
    width: 100%;
    height: 430px;
    /* background-color: blue; */
    display: flex;  
    align-items: stretch;
    justify-content: space-around;
    background-color: #fff;
}

#music_list{
    flex: 2;
    height: 100%;
    /* background-color: red; */
    overflow-y: scroll;
    overflow-x: hidden;
}

.music{
    cursor: pointer;
    width: 100%;
    height: 40px;
    display: flex;  
    align-items: stretch;
    justify-content: space-around;
}

.music:hover{
    background-color: #F5F5F5;
}

.play_logo{
    flex: 1;
}

.play_logo svg{
    margin: 12px 12px;
}

.music_name{
    text-align: left;
    line-height: 40px;
    font-size: 14px;
    flex: 4;
    overflow: hidden;
}

.mv_icon{
    flex: 1;
}

.mv_icon svg{
    margin: 10px 10px;
}



#music_cover{
    flex: 3;
    /* background-color: gray; */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    /* z-index: 1; */
}

#cover_img{
    width: 100%;
    height: 50%;
}

#img{
    width: 100%;
    height: 150px;
    overflow:hidden
}

#img img{
    display: block;
    width: 120px;
    height: 120px;
    margin: 15px auto;
}

#music_detail{
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    padding: 0 12px;
}

#music_text{
    width: 100%;
    height: 50%;
}

/* 歌词 */
#now_lyric{
    width: 100%;
    height: 100%;
    font-size: 14px;
    text-align: center;
    line-height: 40px;
    margin: 0 auto;
}

#music_comments{
    flex: 3;
    /* background-color: yellow; */
    overflow-y: scroll;
    overflow-x: hidden;
}

#comment_head{
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: 800;
    padding-left: 18px;
    padding-top: 2px;
    line-height: 40px;
}


/* 每个评论 */
.comment{
    position: relative;
    width: 100%;
    min-height: 80px;
    display: flex;
    align-items: stretch;
}

.head_img{
    float: left;
    flex: 1;
}

.head_img img{
    width: 40px;
    height: 40px;
    margin: 6px 6px;
    border-radius: 50%;
}

.comment_content{
    flex: 5;
    padding: 12px;
}

.author_name{
    width: 100%;
    height: 20px;
    font-size: 14px;
    font-weight: 600;
}

.comment_detail{
    width: 100%;
    font-size: 12px;
    padding-bottom: 12px;
    padding-top: 12px;
}



/* 下面部分 */
#foot{
    width: 100%;
    height: 60px;
    background-color: rgb(241, 243, 244);
}

#foot audio{
    width: 100%;
    margin: 3px auto;
    background-color: rgb(241, 243, 244);

}

/* 滚动条样式 */
#music_list::-webkit-scrollbar,#music_comments::-webkit-scrollbar{
    width: 4px;

}

#music_list::-webkit-scrollbar-track ,#music_comments::-webkit-scrollbar-track{
    background-color: rgba(0, 0, 0,0);
} /* 滚动条的滑轨背景颜色 */

#music_list::-webkit-scrollbar-thumb ,#music_comments::-webkit-scrollbar-thumb{
    background-color: rgba(0, 0, 0, 0.2); 
} /* 滑块颜色 */

#music_list::-webkit-scrollbar-corner ,#music_comments::-webkit-scrollbar-corner{
    background-color: black;
} /* 横向滚动条和纵向滚动条相交处尖角的颜色 */


/* 歌词高亮 */
.lineheight{
    font-size: 20xp;
    color: red;
}

.end{
    position: absolute;
    bottom: 20px;
    width: 100%;
    height: 80px;
    text-align: center;
    line-height: 80px;
}

a{
    color: #409eff;
    
}

a:hover{
    border-bottom: 1px solid #409eff;
}
```



index.js:

```javascript
var medisArray;   // 定义一个新的数组

function createLrc (medis) {
    medisArray = new Array();
    var medises = medis.split("\n");    // 用换行符拆分获取到的歌词

    $.each(medises, function (i, item) {    // 遍历medises，并且将时间和文字拆分开，并push进自己定义的数组，形成一个对象数组
      var t = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
      var a = (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(3);
      var b = item.substring(item.indexOf("]") + 1, item.length);
      medisArray.push({

        t: a,
        c: b
      });
      // console.log(a,b);
    });
}
var app = new Vue({
    el:"#main",
    data:{
        isstart:0,
        startId:"",
        query:"",
        musicList:[],
        musicPlayUrl:"",
        musicCover:"",
        musicCoverDetail:"",
        //评论
        commentList:[],
        //歌词
        lyric:"",
        nowLyric:"歌词"
    },
    //初始化数据
    created:function(){
      console.log("初始化开始");
        var start = this;
        //初始化正在播放
        $.get("http://127.0.0.1:3000/personalized/newsong?limit=1",
        "",function(data){
          //初始化封面
          start.musicCover = data.result[0].picUrl;
          start.musicCoverDetail = data.result[0].song.name+" "+data.result[0].song.album.alias[0]+" - "+data.result[0].song.album.artists[0].name;
          
          start.startId = data.result[0].id;
          console.log("start.startId = "+start.startId);
          //播放
        //获取播放url
        $.get("http://127.0.0.1:3000/song/url?id="+start.startId,
              function(data){
                start.musicPlayUrl = data.data[0].url;
        },"json")
        
        // 获取歌词
        $.get("http://127.0.0.1:3000/lyric?id="+start.startId,
        "",function(data){
          start.lyric = data.lrc.lyric;
            var lrc = start.lyric;
            createLrc(lrc);
        },"json")

        //查找评论
          $.get("http://127.0.0.1:3000/comment/new?type=0&id="+start.startId+"&sortType=2&pageSize=20&pageNo=1",
          "",function(data){
          start.commentList = data.data.comments;
          },"json")

        //推荐歌曲
        $.get("http://127.0.0.1:3000/personalized/newsong?limit=20",
            function(data){
              start.musicList = data.result;
            },"json")
        console.log("初始化结束");
      },"json")

        
        
    },
    methods:{
        //音乐查询
        search:function(){
          console.log("search运行");
            var that = this;
            $.get("http://127.0.0.1:3000/cloudsearch?keywords="+this.query+"?type=1",
            "",
            function(data){
                that.musicList = data.result.songs;
            },"json")
            that.isstart=1;
        },

        //音乐播放
        musicPlay:function(id){
            var playthat = this;
            //获取播放url
            $.get("http://127.0.0.1:3000/song/url?id="+id,
            "",
            function(data){
                playthat.musicPlayUrl = data.data[0].url;
                // // 设置封面信息
                // for(var i = 0;i < playthat.musicList.length;i++){
                //     if(playthat.musicList[i].id == id){
                //         playthat.musicCover = playthat.musicList[i].al.picUrl;
                //         playthat.musicCoverDetail = playthat.musicList[i].name+"---"+playthat.musicList[i].ar[0].name;
                //         break;
                //     }
                // }
                $.get("http://127.0.0.1:3000/song/detail?ids="+id,
                function(data){
                    playthat.musicCover = data.songs[0].al.picUrl;
                    playthat.musicCoverDetail = data.songs[0].name+" - "+data.songs[0].ar[0].name;
                },"json")
                
                
            },"json")


            // 获取歌词
            $.get("http://127.0.0.1:3000/lyric?id="+id,
            "",function(data){
                playthat.lyric = data.lrc.lyric;
                var lrc = playthat.lyric;
                createLrc(lrc);
            },"json")

            //获取评论
            $.get("http://127.0.0.1:3000/comment/new?type=0&id="+id+"&sortType=2&pageSize=20&pageNo=1",
            "",function(data){
                playthat.commentList = data.data.comments;
            },"json")
        }
    }
})
```



# 四、功能分析

下面开始功能开发。

## 1、搜索歌曲

**这里使用的API如下：**

说明 : 调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 , 关键词可以多个 , 以空格隔开 , 如 " 周杰伦 搁浅 "( 不需要登录 ), 搜索获取的 mp3url 不能直接用 , 可通过 `/song/url` 接口传入歌曲 id 获取具体的播放链接

**必选参数 :** `keywords` : 关键词

**可选参数 :** `limit` : 返回数量 , 默认为 30 `offset` : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0

`type`: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合

**接口地址 :** `/search` 或者 `/cloudsearch`(更全)

**调用例子 :** `/search?keywords= 海阔天空` `/cloudsearch?keywords= 海阔天空`



**本项目中使用的是`/cloudsearch?keywords= `**

首先分析需求，在输入框输入关键字后，回车或者点击搜索图标，开始搜索，并将搜索结果展示在左边的歌曲列表。



具体步骤如下：

1、回车或者点击搜索图标，触发search方法

2、search方法向搜索API发送ajax请求，参数为v-model="query"：

*搜索框html如下：*

```
<input @keyup.enter="search" v-model="query" type="text" placeholder="回车搜索音乐">
```

*search方法代码如下：*

![image-20210127111434947](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127111434947.png)

3、API返回数据，数据如下：

![image-20210127105945773](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127105945773.png)

*songs数组就是我们要的歌曲列表。*

4、在search方法中，获取的响应数据中的songs复制给app.musicList（Vue实例变量）

*app.musicList在这里：*

![musicList](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/musicList.jpg)

，之后，将搜索结果渲染到歌曲列表：

![搜索](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/搜索.jpg)

使用v-for命令遍历将数据渲染成无序列表，使用`{{music.name}} - {{music.ar[0].name}}`将歌曲名字-歌手名字显示出来。



渲染的歌曲列表：

![image-20210127115425624](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127115425624.png)

## 2、点击播放



播放功能使用到的API如下：

**1、查询音乐url**

**必选参数 :** `id` : 音乐 id

**可选参数 :** `br`: 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推

**接口地址 :** `/song/url`

**调用例子 :** `/song/url?id=33894312` `/song/url?id=405998841,33894312`

**2、获取歌曲详细信息**

**必选参数 :** `ids`: 音乐 id, 如 `ids=347230`

**接口地址 :** `/song/detail`

**调用例子 :** `/song/detail?ids=347230`,`/song/detail?ids=347230,347231`

**3、获取歌词**

**必选参数 :** `id`: 音乐 id

**接口地址 :** `/lyric`

**调用例子 :** `/lyric?id=33894312`

**4、获取评论**

**必选参数 :** `id`: 音乐 id

**可选参数 :** `limit`: 取出评论数量 , 默认为 20

`offset`: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值

`before`: 分页参数,取上一页最后一项的 `time` 获取下一页数据(获取超过5000条评论的时候需要用到)

**接口地址 :** `/comment/music`

**调用例子 :** `/comment/music?id=186016&limit=1` 对应晴天评论





**分析：**点击要播放的歌曲，歌曲开始播放，封面变成播放歌曲的封面，歌词变成播放歌曲的歌词，右侧显示热门评论。



点击播放，触发musicPlay(id)方法，该方法如下：

![image-20210127112951893](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127112951893.png)



该功能使用到的几个Vue实例属性:musicPlayUrl、musicCover、musicCoverDetail、commentList、lyric,

![bof](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/bof.jpg)



首先获取歌曲播放url，然后将url赋值给app.musicPlayUrl，改变后播放组件audio的src将会同步改变：

![image-20210127113620187](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127113620187.png)

然后音乐开始播放，

接下来，将歌曲封面url赋值给musicPlayUrl，musicPlayUrl改变后，封面图片的src将会改变：

![image-20210127115028981](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127115028981.png)

然后将歌曲名字、歌手赋值给musicCoverDetail，musicCoverDetail改变后，正在播放歌曲信息将会改变：

![image-20210127115206757](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127115206757.png)



改变的封面和封面信息：

![image-20210127115350657](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127115350657.png)



接下来获取歌词，赋值给lyric，调用createLrc方法，该方法作用是解析歌词文件，解析成一个数组，createLrc方法代码如下：

```javascript
function createLrc (medis) {
    medisArray = new Array();
    var medises = medis.split("\n");    // 用换行符拆分获取到的歌词

    $.each(medises, function (i, item) {    // 遍历medises，并且将时间和文字拆分开，并push进自己定义的数组，形成一个对象数组
      var t = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
      var a = (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(3);
      var b = item.substring(item.indexOf("]") + 1, item.length);
      medisArray.push({
        t: a,
        c: b
      });
      // console.log(a,b);
    });
}
```

这是解析前的歌词：

![image-20210127114057910](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127114057910.png)

createLrc方法将歌词解析成一个数组medisArray，medisArray[0].t是第一行歌词的时间（秒），

medisArray[0].c是第一行歌词的内容。



之后获取评论，将评论赋值给评论列表commentList，评论响应数据如下：

![image-20210127114505532](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127114505532.png)

comments就是要赋值给的commentList数组的内容。其中`user.avatarUrl`

是评论人头像，`user.nickname`是评论人的昵称，`comment.content`是评论内容，

commentList数组更新后，评论将会同步渲染，使用v-for命令将评论数组中的内容渲染出来：

![image-20210127114740234](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127114740234.png)



渲染的评论效果：

![image-20210127115302362](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127115302362.png)



## 3、歌词滚动

歌曲正在播放时，歌词应该滚动，

前面已经将歌词放进了一个歌词数组medisArray，在播放的时候，我们遍历这个数组，如果第i句歌词时间小于等于当前播放进度且当前播放进度小于等于第i+1句歌词时间，那么说明当前正在播放第i句歌词。

获取播放进度可以使用audio主键的ontimeupdate属性，给它绑定一个方法，并传入参数this，this.currentTime就是当前播放进度。

ontimeupdate属性的用法：[ontimeupdate用法](https://www.w3cschool.cn/jsref/event-ontimeupdate.html)

歌词滚动方法如下：

![image-20210127120029634](https://img-picgo.oss-cn-hangzhou.aliyuncs.com/img/image-20210127120029634.png)

使用JQuery改变歌词内容，即可实现歌词滚动。



## 4、页面初始化

在页面刚刚载入时，应该初始化歌曲列表、当前歌曲、热门评论等信息。

这里我们使用Vue生命周期中的created钩子将初始化函数挂载。

初始化函数如下：

```javascript
//初始化数据
    created:function(){
      console.log("初始化开始");
        var start = this;
        //初始化正在播放
        $.get("http://112.124.23.56:3000/personalized/newsong?limit=1",
        "",function(data){
          //初始化封面
          start.musicCover = data.result[0].picUrl;
          start.musicCoverDetail = data.result[0].song.name+" "+data.result[0].song.album.alias[0]+" - "+data.result[0].song.album.artists[0].name;
          
          start.startId = data.result[0].id;
          console.log("start.startId = "+start.startId);
          //播放
        //获取播放url
        $.get("http://112.124.23.56:3000/song/url?id="+start.startId,
              function(data){
                start.musicPlayUrl = data.data[0].url;
        },"json")
        
        // 获取歌词
        $.get("http://112.124.23.56:3000/lyric?id="+start.startId,
        "",function(data){
          start.lyric = data.lrc.lyric;
            var lrc = start.lyric;
            createLrc(lrc);
        },"json")

        //查找评论
          $.get("http://112.124.23.56:3000/comment/new?type=0&id="+start.startId+"&sortType=2&pageSize=20&pageNo=1",
          "",function(data){
          start.commentList = data.data.comments;
          },"json")

        //推荐歌曲
        $.get("http://112.124.23.56:3000/personalized/newsong?limit=20",
            function(data){
              start.musicList = data.result;
            },"json")
        console.log("初始化结束");
      },"json")
```



# 五、项目地址

github：[github](https://github.com/userqzl/VueMusic)