// 先天八卦
var xt8guaData = [
    {name: "乾", alias: "天", tag: "q", pstxt: "south", pstcn: "南", pstht: "northwest", psthtcn: "西北", code: "111"},       // 0
    {name: "坤", alias: "地", tag: "ku", pstxt: "north", pstcn: "北", pstht: "southwest", psthtcn: "西南", code: "000"},      // 1

    {name: "兑", alias: "泽", tag: "d", pstxt: "southeast", pstcn: "东南", pstht: "west", psthtcn: "西", code: "011"},        // 2
    {name: "艮", alias: "山", tag: "g", pstxt: "northwest", pstcn: "西北", pstht: "northeast", psthtcn: "东北", code: "100"}, // 3

    {name: "巺", alias: "风", tag: "x", pstxt: "southwest", pstcn: "西南", pstht: "southeast", psthtcn: "东南", code: "110"}, // 4
    {name: "震", alias: "雷", tag: "z", pstxt: "northeast", pstcn: "东北", pstht: "east", psthtcn: "东北", code: "001"},      // 5

    {name: "离", alias: "火", tag: "l", pstxt: "east", pstcn: "东", pstht: "south", psthtcn: "南", code: "101"},              // 6
    {name: "坎", alias: "水", tag: "ka", pstxt: "west", pstcn: "西", pstht: "north", psthtcn: "北", code: "010"}              // 7
]

// 周易六十四卦
var zy64guaData = [
    {
        name: "乾",
        code: "00",
        desc: "元亨利贞",
        rows: [
            "潜龙 勿用",
            "见龙在田 利见大人",
            "君子终日乾乾 夕惕若 厉无咎",
            "或跃在渊 无咎",
            "飞龙在天 利见大人",
            "亢龙 有悔"
        ],
        img: "static/images/qian.png"
    },
    {
        name: "坤",
        code: "11",
        desc: "元亨 利牝马之贞 君子有攸往 先迷 后得主 利 西南得朋 东北丧朋 安贞吉",
        rows: [
            "履霜 坚冰至",
            "直方大 不习 无不利",
            "含章可贞 或从王事 无成有终",
            "括囊 无咎无誉",
            "黄裳 元吉",
            "龙战于野 其血玄黄"
        ],
        img: "static/images/kun1.jpg"
    },
    
    {
        name: "屯",
        code: "75",
        desc: "元亨利贞 勿用有攸往 利建侯",
        rows: [
            "盘桓 利居贞 利建候",
            "屯如 遣如 乘马班如 匪寇婚媾 女子贞不字 十年乃字",
            "即鹿无虞 惟入于林中 君子几 不如舍 往吝",
            "乘马班如 求婚媾 往吉 无不利",
            "屯其膏 小 贞吉 大 贞吉",
            "乘马班如 泣血涟如"
        ],
        img: "static/images/zhun.png"
    },
    {
        name: "蒙",
        code: "37",
        desc: "亨 匪我求童蒙 童蒙求我 初筮告 再三渎 渎则不告 利贞",
        rows: [
            "发蒙 利用刑人 用说桎梏 以往吝",
            "包蒙 吉 纳妇 吉 子克家",
            "勿用取女 见金夫 不有躬 无攸利",
            "困蒙 吝",
            "童蒙 吉",
            "击蒙 不利为寇 利御寇"
        ],
        img: "static/images/meng.png"
    },

    {
        name: "需",
        code: "70",
        desc: "有孚 光亨 贞吉 利涉大川",
        rows: [
            "需于郊 利用恒 无咎",
            "需于沙 小有言 终吉",
            "需于泥 致寇至",
            "需于血 出自穴",
            "需于酒食 贞吉",
            "入于穴 有不速之客三人来 敬之终吉"
        ],
        img: "static/images/xu.png"
    },
    {
        name: "讼",
        code: "07",
        desc: "有孚窒惕 中吉 终凶 利见大人 不利涉大川",
        rows: [
            "不永所事 小有言 终吉",
            "不克讼 归而逋 其邑人三百户 无眚",
            "食旧德 贞厉 终吉 或從王事 无成",
            "不克讼 复既命渝 安贞吉",
            "讼 元吉",
            "或锡之鞶带 终朝三褫之"
        ],
        img: "static/images/song.png"
    },

    {
        name: "师",
        code: "17",
        desc: "贞丈人吉 无咎",
        rows: [
            "师出以律 否臧凶",
            "在师中吉 无咎 天三锡命",
            "师或舆尸 凶",
            "师左次 无咎",
            "田有禽 利执言 无咎 长子帅师 弟子舆尸 贞凶",
            "大君有命 开国承家 小人勿用"
        ],
        img: "static/images/shi.png"
    },
    {
        name: "比",
        code: "71",
        desc: "吉 原筮 元 永贞 无咎 不宁方来 后夫凶",
        rows: [
            "有孚比之 无咎 有孚盈缶 终来有它 吉",
            "比之自内 贞吉",
            "比之匪人",
            "外比之 贞吉",
            "显比 王用三驱 失前禽 邑人不诫 吉",
            "比之无首 凶"
        ],
        img: "static/images/bi.png"
    },
    
    {
        name: "小畜",
        code: "40",
        desc: "亨 密云不雨 自我西郊",
        rows: [
            "复自道 何其咎 吉",
            "牵复 吉",
            "舆说辐 夫妻反目",
            "有孚 血去 惕出无咎",
            "有孚挛如 富以其邻",
            "既雨既处 尚德载 妇贞厉 月几望 君子征凶"
        ],
        img: "static/images/xiaoxu.png"
    },
    {
        name: "履",
        code: "02",
        desc: "履虎尾 不咥人 亨",
        rows: [
            "素履往 无咎",
            "履道坦坦 幽人贞吉",
            "眇能视 跛能履 履虎尾 咥人 凶 武人为于大君",
            "履虎尾 愬愬 终吉",
            "夬履 贞厉",
            "视履考祥 其旋元吉"
        ],
        img: "static/images/lu.png"
    },

    {
        name: "泰",
        code: "10",
        desc: "小往大来 吉 亨",
        rows: [
            "拔茅茹以其汇 征吉",
            "包荒 用冯河 不遐遗 朋亡 得尚于中行",
            "无平不陂 无往不复 艰贞无咎 勿恤其孚 于食有福",
            "翩翩 不富以其邻 不戒以孚",
            "帝乙归妹 以祉元吉",
            "城复于隍 勿用师 自邑告命 贞吝"
        ],
        img: "static/images/tai.png"
    },
    {
        name: "否",
        code: "01",
        desc: "否之匪人 不利君子贞 大往小来",
        rows: [
            "拔茅茹以其汇 贞吉 亨",
            "包承 小人吉 大人否 亨",
            "包羞",
            "有命 无咎 畴离祉",
            "休否 大人吉 其亡其亡 系于包桑",
            "倾否 先否后喜"
        ],
        img: "static/images/pi.png"
    },

    {
        name: "同人",
        code: "06",
        desc: "同人于野 亨 利涉大川 利君子贞",
        rows: [
            "同人于门 无咎",
            "同人于宗 吝",
            "伏戎于莽 升其高陵 三岁不兴",
            "乘其墉 弗克攻 吉主",
            "同人先号咷而后笑 大师克 相遇",
            "同人于郊 无悔"
        ],
        img: "static/images/tongren.png"
    },
    {
        name: "大有",
        code: "60",
        desc: "元亨",
        rows: [
            "无交害匪咎 艰则无咎",
            "大车以载 有攸往 无咎",
            "公用亨于天子 小人弗克",
            "匪其彭 无咎",
            "厥孚交如威如 吉",
            "自天佑之 吉 无不利"
        ],
        img: "static/images/dayou.png"
    },
    {
        name: "谦",
        code: "13",
        desc: "亨 君子有终",
        rows: [
            "谦谦君子 用涉大川 吉",
            "鸣谦 贞吉",
            "劳谦君子 有终 吉",
            "无不利 捴谦",
            "不富以其邻 利用侵伐 无不利",
            "鸣谦 利用行师征邑国"
        ],
        img: "static/images/qian1.png"
    },
    {
        name: "豫",
        code: "51",
        desc: "利建侯行师",
        rows: [
            "鸣豫 凶",
            "介于石 不终日 贞吉",
            "盱豫 悔 迟有悔",
            "由豫 大有得 勿疑 朋盍簪",
            "贞疾 恒不死",
            "冥豫 成有渝 无咎"
        ],
        img: "static/images/yu.png"
    },

    {
        name: "随",
        code: "25",
        desc: "元亨 利贞 无咎",
        rows: [
            "官有渝 贞吉 出门交有功",
            "系小子 失丈夫",
            "系丈夫 失小子 随有求 得 利居贞",
            "随有获 贞凶 有孚在道 以明 何咎",
            "孚于嘉 吉",
            "拘系之 乃从维之 王用亨于西山"
        ],
        img: "static/images/sui.png"
    },
    {
        name: "蛊",
        code: "34",
        desc: "元亨 利涉大川 先甲三日 后甲三日",
        rows: [
            "干父之蛊 有子 考无咎 厉 终吉",
            "干母之蛊 不可贞",
            "干父之蛊 小有悔 无大咎",
            "裕父之蛊 往见咎",
            "干父之蛊 用誉",
            "不事王侯 高尚其事"
        ],
        img: "static/images/gu.png"
    },

    {
        name: "临",
        code: "12",
        desc: "元亨 利贞 至于八月有凶",
        rows: [
            "咸临 贞吉",
            "咸临 吉 无不利",
            "甘临 无攸利 既忧之 无咎",
            "至临 无咎",
            "知临 大君之宜 吉",
            "敦临 吉 无咎"
        ],
        img: "static/images/lin.png"
    },
    {
        name: "观",
        code: "41",
        desc: "盥而不荐 有孚顒若",
        rows: [
            "童观 小人无咎 君子咎",
            "窥观 利女贞",
            "观我生 进退",
            "观国之光 利用宾于王",
            "观我生 君子无咎",
            "观其生 君子无咎"
        ],
        img: "static/images/guan.png"
    },

    {
        name: "噬嗑",
        code: "65",
        desc: "亨 利用狱",
        rows: [
            "履校灭趾 无咎",
            "噬肤灭鼻 无咎",
            "噬腊肉遇毒 小吝 无咎",
            "噬乾胏 得金矢 利艰贞 吉",
            "噬干肉得黄金 贞厉 无咎",
            "何校灭耳 凶"
        ],
        img: "static/images/shike.png"
    },
    {
        name: "贲",
        code: "36",
        desc: "亨 小利有攸往",
        rows: [
            "贲其趾 舍车而徒",
            "贲其须",
            "贲如 濡如 永贞吉",
            "贲如皤如 白马翰如 匪寇 婚媾",
            "贲于丘园 束帛戋戋 吝 终吉",
            "自贲 无咎"
        ],
        img: "static/images/ben.png"
    },

    {
        name: "剥",
        code: "31",
        desc: "不利有攸往",
        rows: [
            "剥床以足 蔑贞凶",
            "剥床以辨 蔑贞凶",
            "剥之 无咎",
            "剥床以肤 凶",
            "贯鱼以宫人宠 无不利",
            "硕果不食 君子得舆 小人剥庐"
        ],
        img: "static/images/bo.png"
    },
    {
        name: "复",
        code: "15",
        desc: "亨 出入无疾 朋来无咎 反复其道 七日来复 利有攸往",
        rows: [
            "不远复 无祗悔 元吉",
            "休复 吉",
            "频复 厉 无咎",
            "中行独复",
            "敦复 无悔",
            "迷复 凶灾眚 用行师 终有大败 以其国君凶 至于十年不克征 "
        ],
        img: "static/images/fu.png"
    },

    {
        name: "无妄",
        code: "05",
        desc: "元亨 利贞 其匪正有眚 不利有攸往",
        rows: [
            "无妄往 吉",
            "不耕获 不菑畲 则利用有望",
            "无妄之灾 或系之牛 行人之得 邑人之灾",
            "可贞 无咎",
            "无妄之疾 勿药有喜",
            "无妄行 有眚 无攸利"
        ],
        img: "static/images/wuwang.png"
    },
    {
        name: "大畜",
        code: "30",
        desc: "利贞 不家食吉 利涉大川",
        rows: [
            "有厉 利己",
            "舆说輹",
            "良马逐 利艰贞 曰闲舆卫 利有攸往",
            "童牛之牿 元吉",
            "豮豕之牙 吉",
            "何天之衢 亨"
        ],
        img: "static/images/daxu.png"
    },

    {
        name: "颐",
        code: "35",
        desc: "贞吉 观颐 自求口实",
        rows: [
            "舍尔灵龟 观我朵颐 凶",
            "颠颐拂经于丘颐 征凶",
            "拂颐 贞凶 十年勿用 无攸利",
            "颠颐 吉 虎视眈眈 其欲逐逐 无咎",
            "拂经 居贞吉 不可涉大川",
            "由颐 厉 吉 利涉大川"
        ],
        img: "static/images/yi.png"
    },
    {
        name: "大过",
        code: "24",
        desc: "栋挠 利有攸往 亨",
        rows: [
            "藉用白茅 无咎",
            "枯杨生稊 老夫得其女妻 无不利",
            "栋桡 凶",
            "栋隆 吉 有它 吝",
            "枯杨生华 老妇得其士夫 无咎无誉",
            "过涉灭顶 凶 无咎"
        ],
        img: "static/images/daguo.png"
    },

    {
        name: "坎",
        code: "77",
        desc: "有孚维心 亨 行有尚",
        rows: [
            "习坎 入于坎 窞 凶",
            "坎有险 求小德",
            "来之坎 坎险且枕 入于坎 窞 勿用",
            "樽酒簋贰用缶 纳约自牖 终无咎",
            "坎不盈 祗既平 无咎",
            "系用徽纆 窴于丛棘 三岁不得 凶"
        ],
        img: "static/images/kan.png"
    },
    {
        name: "离",
        code: "66",
        desc: "利贞 亨 畜牝牛吉",
        rows: [
            "履错然 敬之无咎",
            "黄离 元吉",
            "日昃之离 不鼓缶而歌 则大耋之嗟 凶",
            "突如 其来如 焚如 死如 弃如",
            "出涕沱若 戚嗟若 吉",
            "王用出征 有嘉折首 获匪其丑 无咎"
        ],
        img: "static/images/li.png"
    },

    {
        name: "咸",
        code: "23",
        desc: "亨 利贞 取女吉",
        rows: [
            "咸其拇",
            "咸其腓 凶 居吉",
            "咸其股 执其随 往吝",
            "贞吉 悔亡 憧憧往来 朋從尔思",
            "咸其脢 无悔",
            "限期附加"
        ],
        img: "static/images/xian.png"
    },
    {
        name: "恒",
        code: "54",
        desc: "亨 无咎 利贞 利有攸往",
        rows: [
            "浚恒 贞凶 无攸利",
            "悔亡",
            "不恒其德 或承之羞 贞吝",
            "田无禽",
            "恒其德 贞 妇人吉 夫子凶",
            "振恒 凶"
        ],
        img: "static/images/heng.png"
    },

    {
        name: "遁",
        code: "03",
        desc: "亨 小利贞",
        rows: [
            "遁尾 厉 勿用有攸往",
            "执之用黄牛之革 莫之胜说",
            "系遁 有疾厉 畜臣妾吉",
            "好遁 君子吉 小人否",
            "嘉遁 贞吉",
            "肥遁 无不利"
        ],
        img: "static/images/dun.png"
    },
    {
        name: "大壮",
        code: "50",
        desc: "利贞",
        rows: [
            "壮于趾 征凶 有孚",
            "贞吉",
            "小人用壮 君子用罔 贞厉 羝羊触藩 羸其角",
            "贞吉 悔亡 藩决不羸 壮于大舆之輹",
            "丧羊于易 无悔",
            "羝羊触藩 不能退 不能遂 无攸利 艰则吉"
        ],
        img: "static/images/dazhuang.png"
    },

    {
        name: "晋",
        code: "61",
        desc: "康侯用锡马蕃庶 昼日三接",
        rows: [
            "晋如摧如 贞吉 罔孚 裕无咎",
            "晋如 愁如 贞吉 受兹介福于 其王母",
            "众允 悔亡",
            "晋如鼫鼠 贞厉",
            "悔亡 失得 勿恤 往吉 无不利",
            "晋其角 维用伐邑 厉吉 无咎 贞吝"
        ],
        img: "static/images/jin.png"
    },
    {
        name: "明夷",
        code: "16",
        desc: "利艰贞",
        rows: [
            "明夷 于飞垂其翼 君子于行 三日不食 有攸往 主人有言",
            "明夷夷于左股 用拯马壮 吉",
            "明夷于南狩 得其大首 不可疾贞",
            "入于左腹 获明夷之心 于出门庭",
            "箕子之明夷 利贞",
            "不明 晦 初登于天 后入于地"
        ],
        img: "static/images/mingyi.png"
    },

    {
        name: "家人",
        code: "46",
        desc: "利女贞",
        rows: [
            "闲有家 悔亡",
            "无忧遂 在中馈 贞吉",
            "家人嗃嗃 悔 厉 吉 妇子嘻嘻 终吝",
            "富家 大吉",
            "王假有家 勿恤 吉",
            "有孚 威如 终吉"
        ],
        img: "static/images/jiaren.png"
    },
    {
        name: "睽",
        code: "62",
        desc: "小事吉",
        rows: [
            "悔亡 丧马 勿逐 自复 见恶人 无咎",
            "遇主于巷 无咎",
            "见舆曳 其牛掣 其人天且劓 无初有终",
            "睽孤 遇元夫 交孚 厉 无咎",
            "悔亡 厥宗噬夫 往何咎",
            "睽孤 见豕负涂 载鬼一车 先张之弧 后说之弧 匪寇 婚媾 往遇雨则吉"
        ],
        img: "static/images/kui.png"
    },

    {
        name: "蹇",
        code: "73",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/jian.png"
    },
    {
        name: "解",
        code: "57",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/jie.png"
    },

    {
        name: "损",
        code: "32",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/sun.png"
    },
    {
        name: "益",
        code: "45",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/yi4.png"
    },

    {
        name: "夬",
        code: "20",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/que.png"
    },
    {
        name: "姤",
        code: "04",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/gou.png"
    },

    {
        name: "萃",
        code: "21",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/cui.png"
    },
    {
        name: "升",
        code: "14",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/sheng.png"
    },

    {
        name: "困",
        code: "27",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/kun.png"
    },
    {
        name: "井",
        code: "74",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/jing.png"
    },

    {
        name: "革",
        code: "26",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/ge.png"
    },
    {
        name: "鼎",
        code: "64",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/ding.png"
    },

    {
        name: "震",
        code: "55",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/zhen.png"
    },
    {
        name: "艮",
        code: "33",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/gen.png"
    },

    {
        name: "渐",
        code: "43",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/jian.png"
    },
    {
        name: "归妹",
        code: "52",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/guimei.png"
    },

    {
        name: "丰",
        code: "56",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/feng.png"
    },
    {
        name: "旅",
        code: "63",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/lv.png"
    },

    {
        name: "巽",
        code: "44",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/xun.png"
    },
    {
        name: "兑",
        code: "22",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/dui.png"
    },

    {
        name: "涣",
        code: "47",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/huan.png"
    },
    {
        name: "节",
        code: "72",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/jie.png"
    },

    {
        name: "中孚",
        code: "42",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/zhongfu.png"
    },
    {
        name: "小过",
        code: "53",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/xiaoguo.png"
    },

    {
        name: "既济",
        code: "76",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/jiji.png"
    },
    {
        name: "未济",
        code: "67",
        desc: "",
        rows: [
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        img: "static/images/weiji.png"
    }
]