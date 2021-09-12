(function(root) {
    function Index(len) {
        this.index = 0; //当前索引
        this.len = len; //数据长度
    }

    Index.prototype = {
        // 去上一个索引（上一首）
        prev() {
            return this.get(-1)
        },
        //下一个索引（下一首）
        next() {
            return this.get(1)
        },
        // 获取索引,参数为+1或-1
        get(val) {
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }

    root.controlIndex = Index;
})(window.player || (window.player = {}))