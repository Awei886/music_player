(function(root) {
    function AudioManage() {
        this.audio = new Audio();
        this.status = 'pause'; //歌曲状态
    }

    AudioManage.prototype = {
        load(src) {
            this.audio.src = src;
            this.audio.load(); //加载音乐
        },

        play() {
            this.audio.play();
            this.status = 'play';
        },

        pause() {
            this.audio.pause();
            this.status = 'pause';
        },

        end(fn) {
            this.audio.onended = fn;
        },

        playTo(time) {
            this.audio.currentTime = time;
        }
    };

    root.music= new AudioManage();
})(window.player || (window.player = {}));