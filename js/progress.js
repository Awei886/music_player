(function(root) {
    //进度条
    function Progress() {
        this.durTime = 0;
        this.frameId = null;
        this.startTime = 0;
        this.lastPercent = 0; // 暂停时已经走的百分比
        this.init( )
    }

    Progress.prototype = {
        init() {
            this.getDom();
            console.log("init")
        },
        getDom() {
          this.curTime = document.querySelector(".curTime");
          this.circle = document.querySelector(".circle");
          this.frontBg = document.querySelector(".frontBg");
          this.totalTime = document.querySelector(".totalTime")
        },
        renderAllTime(time) {
            this.durTime = time;
            
            this.totalTime.innerHTML = this.formate(time)
        },

        formate(time) {
            time = Math.round(time)
            var m = Math.floor(time/60);
            var s = time % 60,
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            return m + ':' + s
        },
        move(per) {
            cancelAnimationFrame(this.frameId)
            this.startTime = new Date().getTime();
            this.lastPercent = per === undefined ? this.lastPercent : per;
            var This = this;
            function frame() {
                var curTime = new Date().getTime();
                var per = This.lastPercent + (curTime - This.startTime) / (This.durTime * 1000) //走的百分比
                if(per <= 1) {
                    This.update(per)

                }else {
                    cancelAnimationFrame(This.frameId)
                }
               This.frameId = requestAnimationFrame(frame)
            }
            frame()
        },
        update(per) {
            var time = this.formate(per * this.durTime);
            this.curTime.innerHTML = time; //左侧事件

            this.frontBg.style.width = per * 100 + '%';

            var l = per * this.circle.parentNode.offsetWidth;
            this.circle.style.transform = `translateX(${l}px)`
        },
        stop() {
            cancelAnimationFrame(this.frameId);
            var stopTime = new Date().getTime();
            this.lastPercent += (stopTime - this.startTime) / (this.durTime * 1000);
            
        }
    }

    function instanceProgress() {
        return new Progress()
    }

    function Drag(obj) {
        this.obj = obj;
        this.startPointX = 0;
        this.startLeft = 0;
        this.percent = 0;
    }

    Drag.prototype = {
        init() {
            var This = this;
            this.obj.style.transform = 'translateX(0)';
            this.obj.addEventListener('touchstart', function(ev) {
                This.startPointX = ev.changedTouches[0].pageX;
                This.startLeft = parseFloat(this.style.transform.split('(')[1]);
                This.start && This.start()
            });

            this.obj.addEventListener('touchmove', function(ev) {
                This.disPointX = ev.changedTouches[0].pageX - This.startPointX;
                var l = This.startLeft + This.disPointX;
                if(l < 0) {
                    l = 0;
                }else if(l > this.offsetParent.offsetWidth) {
                    l = this.offsetParent.offsetWidth
                }

                this.style.transform = `translateX(${l}px)`;
                This.percent = l/this.offsetParent.offsetWidth;
                This.move && This.move(This.percent);
                ev.preventDefault();
            });
            
            this.obj.addEventListener('touchend',function() {
                This.end && This.end(This.percent)
            })
        }
    }

    function instanceDrag(obj) {
        return new Drag(obj)
    }

    root.progress = {
        pro: instanceProgress,
        drag: instanceDrag,
    }
    
})(window.player || (window.player = {}))