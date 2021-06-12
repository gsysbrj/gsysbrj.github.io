
async function getCmntList(newsid, page) {
    const url = `https://comment5.news.sina.com.cn/page/info?channel=blog&newsid=${newsid}&page=${page}&page_size=10&oe=utf-8&list=asc`
    return new Promise((resolve) => {
        $.ajax(url, {
            dataType: 'jsonp', // !!!!!!
            success: function(data) {
                resolve(data)
            }
        })
    });
}

$(document).ready(function(){
    const params = new URLSearchParams(window.location.search);
    const newsid = params.get("newsid");
    const from = params.get("from");
    // 只展示缠师回复切换
    $('#divReply').on('click', '[type="checkbox"]', function () {
        $("#divReply").toggleClass("showHostOnly");
    });
    // 调整上一篇和下一篇链接
    if (from === 'cat') {
        $(".page-prev.time, .page-next.time").css('display', 'none');
        $(".page-prev.cat, .page-next.cat").css('display', 'block');
    }

    const ReplyList = {
        data() {
            return {
                replyList: [
                ]
            }
        },
        async mounted () {
            if (newsid) {
                const data = await getCmntList(newsid, 1);
                this.replyList = data.result.cmntlist;           
            }
        }
    }

    const app = Vue.createApp(ReplyList)

    app.component('reply-item', {
        props: ['reply'],
        template: `<div class="divReplyIsHostFalse vue" style="margin:10px">
        <fieldset>
            <div style="margin:10px">
                <span class="author" style="margin-right:5px">{{reply.nick}}</span>
                <span class="pubtime">{{reply.time}}</span>
            </div>
            <div style="margin:10px" v-html="processContent(reply.content)"></div>
            </fieldset>
        </div>
        `,
        methods: {
            processContent (content) {
                content = content.replace(/\[emoticons=(.*?)\](.*?)\[\/emoticons\]/gsi, '<img src="https://www.sinaimg.cn/uc/myshow/blog/misc/gif/$1.gif" style="margin:1px;" border="0" title="$2">')
                content = content.replace(/\\n/igs, '<br>')
                return content;
            }
        },
    })

    app.mount('#divReply2')
});
