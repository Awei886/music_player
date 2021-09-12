//渲染功能：图片，音乐信息，喜欢
;(function(root) {
    //渲染图片
    function renderImg(src) {
        root.blurImg(src); //给body添加背景图片

        var img = document.querySelector('.songImg img');
        img.src = src
    }

    //渲染音乐信息
    function renderInfo(data) {
        var songInfoChildren = document.querySelector('.songInfo').children;
        songInfoChildren[0].innerHTML = data.name;
        songInfoChildren[1].innerHTML = data.singer;
        songInfoChildren[2].innerHTML = data.album
    }

    //渲染是否喜欢

    function renderIsLike(isLike) {
        var lis = document.querySelectorAll('.control li');
        lis[0].className = isLike ? 'liking' : '';
    }

    root.render = function(data) {  //data: 请求的数据，必须
        renderImg(data.image); 
        renderInfo(data);
        renderIsLike(data.isLike)
    }

})(window.player || (window.player = {}));