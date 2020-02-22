(function (global) {
    let pageNum = 1;
    const pageSize = 50;
    let totalPage;
    //设置小球的滚动数组
    const topPosition = [
        {
            'top':'90px'
        },
        {
            'top':'70px',
            'left':'70px'
        },
        {
            'top':'15px',
            'left':'90px'
        },
        {
            'top':'-40px',
            'left':'70px'
        },
        {
            'bottom':'90px'
        },
        {
            'top':'-40px',
            'left':'-40px'
        }
    ];
    $.ajaxSetup({
        beforeSend: () => {
            NProgress.start()
        },
        error: () => {
            NProgress.done()
        },
        complete: () => {
            NProgress.done()
        }
    })
    //加载内容
    let searchHeros = function(){
        $.ajax({
            type:'get',
            url:'https://autumnfish.cn/api/cq/page',
            data:{
                pageNum:`${pageNum}`,
                pageSize:`${pageSize}`
            },
            success:res=>{
                totalPage = res.totalPage;
                $('.pageNumber').val(`${pageNum}/${totalPage}`);
                $('.heroList').html(template('t1', res));
            }
        })
    }
    searchHeros();
    // 上一页
    $('.prevBtn').on('click', () => {
        if (pageNum > 1) {
            pageNum--;
        }
        $('.heroBtn').click();
        $('.pageNumber').val(`${pageNum}/${totalPage}`);
    })
    // 下一页
    $('.nextBtn').on('click', () => {
        if (pageNum < totalPage) {
            pageNum++;
        }
        $('.heroBtn').click();
        $('.pageNumber').val(`${pageNum}/${totalPage}`);
    })
    //查询接口
    $('.heroSearch').on('keyup',(e)=>{
        if(e.keyCode == 13){
            $('.heroBtn').click();
        }
    })
    $('.heroBtn').on('click', () => {
        if ($('.heroSearch').val() != '') {
            $.ajax({type:'get',url:'https://autumnfish.cn/api/cq',
                data:{
                    query:`${$('.heroSearch').val().trim()}`
                },
                success:res=>{
                    if(res.list.length >0){
                        $('.pageNumber').val(`1/1`);
                        $('.heroList').html(template('t1', res));
                    }else{
                        $('.heroList').html(
                            `<li style="width: 360px;">
                                <img src="./img/fengjing.png" style="width: 100%;">
                                <p class="noContent">‘ 孤舟蓑笠翁，独钓寒江雪 ’</p>
                                <p class="noContent2">未查询到内容，换个关键词再找找哦 =。=</p>
                            </li>`
                        )
                    }
                }
            })
        } else {
            searchHeros();
        }
        $('.heroSearch').val('');
    })
    //返回首页事件
    $('.goToTop').on('click', () => {
        $('html,body').animate({
            'scrollTop': 0
        }, 1000)
    })
    //监测滚动条事件
    $(window).scroll(() => {
        if ($(window).scrollTop() >= 80) {
            $('.goToTop').fadeIn(500);
        } else {
            $('.goToTop').fadeOut(500);
        }
    })
    //清空所有
    $('.delBtn').on('click', () => {
        $('.heroSearch').val('');
    })
    //菜单浮动事件
    $('.searchMenu').on('dblclick',(e)=>{
        if(e.target.tagName == 'DIV' || e.target.tagName == 'I'){
            if($('.searchMenu ul').attr('data-online') == 'false'){
                $('.searchMenu ul li').each((index,item)=>{
                    $(item).show().animate(topPosition[index],250,'swing');
                })
                $('.searchMenu ul').attr('data-online','true');
            }else{
                let arr = Array.from($('.searchMenu ul li'));
                arr.forEach((item,index)=>{
                    if(index == 0){
                        $(item).animate({'top':'15px'},250,'swing').fadeOut();
                    }else if(index == 4){
                        $(item).animate({'bottom':'15px'},250,'swing').fadeOut();
                    }else{
                        $(item).animate({'top':'15px','left':'15px'},250,'swing').fadeOut();
                    }
                })
                $('.searchMenu ul').attr('data-online','false');
            }
        }
    })
    //设置所有的ul点且切换类型击事件
    $('.menuList').on('click',(e)=>{
        if(e.target.tagName == 'LI'){
            let heroType = $(e.target).text();
            $.ajax({
                type:'get',
                url:'https://autumnfish.cn/api/cq/category',
                data:{
                    type:`${heroType}`
                },
                success:res =>{
                    $('.heroList').html(template('t2',res.data));
                    $('.pageNumber').val(`1/1`);    
                }
            })
        }
    })
    //设置查看技能图点击事件
    $('.heroList').on('click','.heroName',(e)=>{
        let name = $(e.target).text();
        $('.mask').show()
        $.ajax(
            {            
                beforeSend:()=>{
                    $('.mask img').attr('src','./img/loading01.gif');
                },
                type:'get',
                url:`https://autumnfish.cn/api/cq/gif`,
                data:{
                    'name':name
                },
                dataType:'json',
                success:(res)=>{
                    console.log(res);
                    $('.mask img').attr('src',res.data.skillGif);
                }
            }
        )
    })
    //清除遮罩层
    $('.mask').on('click',(e)=>{
        $('.mask').fadeOut();
    })
    //设置拖动菜单框
    let x = 0;
    let y = 0;
    let flag = false;
    $('.searchMenu').hover((e)=>{
        if($('.taskMask').attr('data-show') == 'false') $('.taskMask').attr('data-show','true').fadeIn(1000);
        $('.searchMenu').stop().animate({
            'border-radius':'50%'
        })
        flag=false;
    })
    $('.searchMenu').mouseleave((e)=>{
        $('.taskMask').fadeOut(1000);
        $('.searchMenu').stop().animate({
            'border-radius':'10%'
        })
        flag=false;
    })
    $('.searchMenu').on('mousedown',(e)=>{
        x = e.pageX - $('.searchMenu')[0].offsetLeft;
        y = e.pageY - $('.searchMenu')[0].offsetTop;
        flag = true;
    })
    $('.searchMenu').on('mousemove',(e)=>{
        if(flag){
            $('.searchMenu')[0].style.left = (e.pageX - x) + 'px';
            $('.searchMenu')[0].style.top = (e.pageY - y) + 'px';
        }
    })
    $('.searchMenu').on('mouseup',(e)=>{
        flag = false;
    })
})(window)