// var lrc;
// var oLRC = {
//   ti: "", //歌曲名
//   ar: "", //演唱者
//   al: "", //专辑名
//   by: "", //歌词制作人
//   offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
//   ms: [] //歌词数组{t:时间,c:歌词}
// };

var medisArray;   // 定义一个新的数组
//解析歌词


// function createLrcObj(lrc) {
//   if(lrc.length==0) return;
//     var lrcs = lrc.split('\n');//用回车拆分成数组
//     for(var i in lrcs) {//遍历歌词数组
//       lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
//         var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
//         var s = t.split(":");//分离:前后文字
//         if(isNaN(parseInt(s[0]))) { //不是数值
//             for (var i in oLRC) {
//                 if (i != "ms" && i == s[0].toLowerCase()) {
//                     oLRC[i] = s[1];
//                 }
//             }
//         }else { //是数值
//             var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
//             var start = 0;
//             for(var k in arr){
//                 start += arr[k].length; //计算歌词位置
//             }
//             var content = lrcs[i].substring(start);//获取歌词内容
//             for (var k in arr){
//                 var t = arr[k].substring(1, arr[k].length-1);//取[]间的内容
//                 var s = t.split(":");//分离:前后文字
//                 oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
//                     t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
//                     c: content
//                 });
//             }
//         }
//     }
//     oLRC.ms.sort(function (a, b) {//按时间顺序排序
//         return a.t-b.t;
//     });
    
//     for(var i in oLRC){ //查看解析结果
//         console.log(i,":",oLRC[i]);
//     }
//   }


//   function showLRC() {
//     var s="";
//     for(var i in oLRC.ms){//遍历ms数组，把歌词加入列表
//       var time =  oLRC.ms[i].t;
//       console.log("time="+time);
//         s+='<li id=lyc'+parseInt(time)+'>'+oLRC.ms[i].c+'</li>';
//     }
//     document.getElementById("lyric").innerHTML = s;
// }



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

        
        
    },
    methods:{
        //音乐查询
        search:function(){
          console.log("search运行");
            var that = this;
            $.get("http://112.124.23.56:3000/cloudsearch?keywords="+this.query+"?type=1",
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
            $.get("http://112.124.23.56:3000/song/url?id="+id,
            "",
            function(data){
                playthat.musicPlayUrl = data.data[0].url;
                $.get("http://112.124.23.56:3000/song/detail?ids="+id,
                function(data){
                    playthat.musicCover = data.songs[0].al.picUrl;
                    playthat.musicCoverDetail = data.songs[0].name+" - "+data.songs[0].ar[0].name;
                },"json")
                
                
            },"json")

            // 获取歌词
            $.get("http://112.124.23.56:3000/lyric?id="+id,
            "",function(data){
                playthat.lyric = data.lrc.lyric;
                var lrc = playthat.lyric;
                createLrc(lrc);
            },"json")

            //获取评论
            $.get("http://112.124.23.56:3000/comment/new?type=0&id="+id+"&sortType=2&pageSize=20&pageNo=1",
            "",function(data){
                playthat.commentList = data.data.comments;
            },"json")
        }
    }
})



// function playFunction(play){
//   for(var i = 0;i < medisArray.length;i++){
//       if(parseFloat(medisArray[i].t) <= play.currentTime && play.currentTime <= medisArray[i + 1].t){
//           gechi = medisArray[i].c;
//           break;
//       }
//   }
// }
