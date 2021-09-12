(function($,player) {
    function MusicPlayer(dom) {
        this.wrap = dom; //播放器的容器
        this.dataList = []; //存储获取的数据
        // this.now = 1; //歌曲索引
        this.indexObj = null; //索引值对象（用于切歌）
        this.rotateTimer = null;
        this.curIndex = 0; //当前播放歌曲的索引值
        this.list = null;
        this.progress = player.progress.pro();

    }
    MusicPlayer.prototype = {
        init() { //初始化
            this.getDom();
            this.getData('../mock/data.json')
        },
        getDom() { // 获取页面元素
            this.record = document.querySelector(".songImg img");
            this.controlBtns = document.querySelectorAll('.control li');
        },
        getData(url) {
            var This = this;
            $.ajax({
                url:url,
                method: 'get',
                success: function(data) {  
                    This.dataList = data;
                    This.listPlay();
                    This.indexObj = new player.controlIndex(data.length);
                    This.loadMusic(This.indexObj.index); //加载音乐
                    This.musicControl(); // 添加音乐操作功能
                    This.dragProgrss();
                    console.log(data)
                },
                error: function() {
                    console.log('数据请求失败')
                }
            })
        },
        loadMusic(index) {  //加载音乐
            var This = this
            player.render(this.dataList[index]);
            player.music.load(this.dataList[index].audioSrc);
            this.progress.renderAllTime(this.dataList[index].duration)
            //播放音乐
            if(player.music.status === 'play') {
                player.music.play();
                this.controlBtns[2].className = 'playing';
                this.imgRotate(0);
                this.progress.move(0)
            }
            this.list.changeSelect(index)
            this.curIndex = index;

            player.music.end(function() {
                This.loadMusic(This.indexObj.next())
            })
        },
        musicControl() {
            var This = this;
            //上一首
            this.controlBtns[1].addEventListener('touchend', function() {
                player.music.status = 'play';
                This.loadMusic(This.indexObj.prev())
            });

            this.controlBtns[2].addEventListener('touchend',function() {
                if(player.music.status == 'play') {
                    player.music.pause();
                    this.className = '';
                    This.imgStop();
                    This.progress.stop()
                }else {
                    player.music.play();
                    this.className = 'playing';
                    var deg = This.record.dataset.rotate || 0;
                    This.imgRotate(deg);
                    This.progress.move()

                }
            })


            this.controlBtns[3].addEventListener('touchend', function() {
                player.music.status = 'play';
                This.loadMusic(This.indexObj.next())
            })
        },
        imgRotate(deg) {
            var This = this;
            clearInterval(this.rotateTimer);
            this.rotateTimer = setInterval(function() {
                deg = +deg + 0.2;
                This.record.style.transform = 'rotate(' + deg + 'deg)';
                This.record.dataset.rotate = deg;
            },1000 / 60)
        },
        imgStop() {
            clearInterval(this.rotateTimer)
        },
        listPlay() {
            var This = this
            this.list = player.listControl(this.dataList, this.wrap);
            this.controlBtns[4].addEventListener('touchend',function() {
                This.list.slideUp();
            });

            // 歌曲列表添加事件
            this.list.musicList.forEach(function(item,index) {
                item.addEventListener('touchend', function() {
                    if(This.curIndex == index) {
                        return;
                    }
                    player.music.status = 'play';
                    This.indexObj.index = index;
                    This.loadMusic(index);
                    This.list.slideDown()

                })
            })

        },
        dragProgrss() {
            var This = this;
            var circle = player.progress.drag(document.querySelector('.circle'));
            circle.init();
            circle.start = function() {
                This.progress.stop()
            }
            circle.move = function(per) {
                This.progress.update(per);
            }
            circle.end=function(per) {
                var curTime = per*This.dataList[This.indexObj.index].duration;
                player.music.playTo(curTime);
                player.music.play();
                This.progress.move(per);
                var deg = This.record.dataset.rotate || 0;
                This.imgRotate(deg);
                This.controlBtns[2].className = 'playing';
                if(curTime == This.dataList[This.indexObj.index].duration) {
                    player.music.status = 'play';
                    This.loadMusic(This.indexObj.next())
                }
            }
        }
    
    }

    var musicPlayer = new MusicPlayer(document.getElementById('wrap'));
    console.log(musicPlayer)
    musicPlayer.init()
})(window.Zepto,window.player);