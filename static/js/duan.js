(function () {
    function parseQuery() {
        var raw = location.search.replace(/^\?/, '');
        var params = {};
        if (!raw) return params;
        raw.split('&').forEach(function (item) {
            var parts = item.split('=');
            if (parts.length === 2) {
                params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            }
        });
        return params;
    }

    function parsePayload() {
        var params = parseQuery();
        if (params.data) {
            try { return JSON.parse(params.data); } catch (e) { return null; }
        }
        var saved = localStorage.getItem('duan_payload');
        if (!saved) return null;
        try { return JSON.parse(saved); } catch (e) { return null; }
    }

    function findTrigram(code) {
        var target = String(code || '');
        if (!window.xt8guaData || !window.xt8guaData.length) return null;
        for (var i = 0; i < window.xt8guaData.length; i++) {
            var entry = window.xt8guaData[i] || {};
            if ((entry.code || '') === target || (entry.root || '') === target) {
                return entry;
            }
        }
        return null;
    }

    /**
     * 八卦纳甲五行（先天八卦取象）
     * 乾兑金、震巽木、坎水、离火、坤艮土
     */
    function getElement(name) {
        var map = {
            '乾': '金', '天': '金',
            '兑': '金', '泽': '金',
            '震': '木', '雷': '木',
            '巽': '木', '巺': '木', '风': '木',
            '坎': '水', '水': '水',
            '离': '火', '火': '火',
            '坤': '土', '地': '土',
            '艮': '土', '山': '土'
        };
        return map[String(name || '').trim()] || '未知';
    }

    // 五行相生：我生者为「泄」；生我者为「生」
    var WX_SHENG = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' };
    // 五行相克：我克者为「耗/克」；克我者为「受制」
    var WX_KE = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' };

    /**
     * 体用（或上下）生克
     * @param {string} body 体卦名（互卦场景下视为「上」）
     * @param {string} use  用卦名（互卦场景下视为「下」）
     * @returns {'比和'|'体生用'|'用生体'|'体克用'|'用克体'|'未知'}
     *
     * 梅花断法口径：
     * - 比和：同五行，气场相合
     * - 用生体：外生我，得助（最吉向）
     * - 体克用：我克彼，劳而有功（主动）
     * - 体生用：我生彼，付出/泄气
     * - 用克体：彼克我，受压（最凶向）
     */
    function resolveRelation(body, use) {
        var bodyEl = getElement(body);
        var useEl = getElement(use);
        if (bodyEl === '未知' || useEl === '未知') return '未知';
        if (bodyEl === useEl) return '比和';
        if (WX_SHENG[bodyEl] === useEl) return '体生用';
        if (WX_SHENG[useEl] === bodyEl) return '用生体';
        if (WX_KE[bodyEl] === useEl) return '体克用';
        if (WX_KE[useEl] === bodyEl) return '用克体';
        return '未知';
    }

    function getRelation(body, use) {
        return resolveRelation(body, use);
    }

    /** 将体用关系改写为上下关系文案（互卦用） */
    function toShangXiaRel(tiYongRel) {
        return String(tiYongRel || '')
            .replace(/体生用/g, '上生下')
            .replace(/用生体/g, '下生上')
            .replace(/体克用/g, '上克下')
            .replace(/用克体/g, '下克上')
            .replace(/比和/g, '比和');
    }

    /**
     * 九维场景模板
     * 1投资 2事业 3健康 4感情 5出行 6置业 7学业 8官非 9合作
     */
    function scenes9(a, b, c, d, e, f, g, h, i) {
        return '<br><br>' +
            '📈【投资金融】' + a + '<br>' +
            '💼【事业工作】' + b + '<br>' +
            '🩺【健康求医】' + c + '<br>' +
            '❤️【感情人际】' + d + '<br>' +
            '🚗【出行往来】' + e + '<br>' +
            '🏠【家宅置业】' + f + '<br>' +
            '📚【考试学业】' + g + '<br>' +
            '⚖️【官非合约】' + h + '<br>' +
            '🤝【合作谈判】' + i;
    }

    function normalizeRel(str) {
        if (typeof str !== 'string') return '';
        var s = str.trim();
        // 已是标准五类则直接返回
        if (/^(比和|体生用|用生体|体克用|用克体|未知)$/.test(s)) return s;
        if (/比肩|同气|和合/.test(s)) return '比和';
        if (/用克|克我|受制/.test(s)) return '用克体';
        if (/体克|我克/.test(s)) return '体克用';
        if (/用生|生我|得助/.test(s)) return '用生体';
        if (/体生|我生|泄气/.test(s)) return '体生用';
        return s;
    }

    /**
     * 本卦体用 × 变卦体用 → 断语
     * 五行五关系 × 五关系 = 25 组合，下列分支已全覆盖（经验证无漏网）
     * 场景：九维（在原五维上扩展）
     */
    function getDuanText(benRel, bianRel) {
        if (!benRel || !bianRel) {
            return {
                title: '⚪【暂无断语 · 乾坤未定】',
                line1: '乾坤未定，变数丛生。',
                line2: '未能获取完整生克关系，请重新起卦。'
            };
        }

        benRel = normalizeRel(benRel);
        bianRel = normalizeRel(bianRel);

        // =========================================================================
        // 第一档：🟢 顶级大吉
        // =========================================================================
        if (benRel === '比和' && bianRel === '比和') {
            return {
                title: '🟢【大吉 · 乾坤生扶】比肩同气',
                line1: '挚友相扶，同气连枝；强强联手，固若金汤。',
                line2: '最稳固的同盟格局，主大吉。你与环境、团队气场相投，资源主动靠拢，做事顺风顺水。' +
                    scenes9(
                        '利好合作盘与中长线，伙伴助力明显，易利滚利。',
                        '团队默契高，谈判签约顺，易遇神队友。',
                        '状态平稳，小恙易对症，恢复较快。',
                        '高度同频，关系自然升温，易长久和谐。',
                        '一路顺遂，在外易结识同道。',
                        '选房落户气场相合，邻里少争执，产权过户也省心。',
                        '发挥平稳，适合团体项目与联考协同，不易失常。',
                        '文书往来顺畅，对方配合，少节外生枝。',
                        '席间气场合拍，共赢条款容易落定。'
                    )
            };
        }

        if ((benRel === '用生体' && bianRel === '用生体') || (benRel === '比和' && bianRel === '用生体')) {
            return {
                title: '🟢【大吉 · 乾坤生扶】锦上添花',
                line1: '始遇知己，终获大奖；顺水推舟，造化无穷。',
                line2: '顶级生扶局。开局自带红利，越往后外部资源越主动输血，好上加好。' +
                    scenes9(
                        '大势相助，宜积极布局，易获波段或政策红利。',
                        '升职开拓佳期，贵人铺路，方案易过。',
                        '得滋养，久病易遇良医，恢复迅速。',
                        '对方愿主动付出，关系升温快。',
                        '在外多得照顾，出差办事超预期。',
                        '中介、长辈愿意搭把手，租售信息比你预期的更对口。',
                        '名师与好资料送上门，同样时间提分更明显。',
                        '权威或中间人肯出面，调解更有分量。',
                        '对方案让步空间大，适合敲长期合作。'
                    )
            };
        }

        if (benRel === '用生体' && bianRel === '比和') {
            return {
                title: '🟢【次吉 · 渐入佳境】贵人铺路',
                line1: '知己收尾，万事皆顺；顺水推舟，造化无穷。',
                line2: '通关丝滑。开局贵人带路，后期融合无内耗，从头顺到尾。' +
                    scenes9(
                        '消息或资金托一把，利润曲线更稳。',
                        '入职/新项目有人带，磨合期短。',
                        '见效快，巩固靠日常作息即可。',
                        '从生疏到默契很快，关系对等。',
                        '办事效率高，路上常有人搭把手。',
                        '网签过户不卡壳，住进去也容易处得来。',
                        '一点就通，发挥不飘，成绩托底。',
                        '有人居中说和，局面不易再起波澜。',
                        '贵人牵线靠谱，磨合成本低。'
                    )
            };
        }

        // =========================================================================
        // 第二档：强控与和解
        // =========================================================================
        if (benRel === '体克用' && bianRel === '体克用') {
            return {
                title: '🟡【中吉 · 劳心有成】稳操胜券',
                line1: '运筹帷幄，主权在我；虽需劳心，终必有成。',
                line2: '硬实力胜局。主动权在你，费心推进，结局可成。' +
                    scenes9(
                        '靠策略与纪律硬赚，忌盲目跟风。',
                        '你是主导，量大但可控，耕耘有获。',
                        '需主动坚持调理，虽苦可胜。',
                        '你掌握节奏，多付可得稳固关系。',
                        '行程在计划内，劳顿但可达标。',
                        '定价、验收、合同细节宜你亲自拍板。',
                        '刷题量与分数大致成正比，别指望运气。',
                        '证据链要自己理清，别全交给别人。',
                        '议程在你手里，关键句务必自己敲定。'
                    )
            };
        }

        if (benRel === '体克用' && bianRel === '比和') {
            return {
                title: '🟢【次吉 · 渐入佳境】群援相随',
                line1: '先苦后甜，越做越顺；孤军奋战，终得群援。',
                line2: '开拓者剧本。前期独攻，啃下后众人响应。' +
                    scenes9(
                        '独自扛过风险段，才等得来跟风资金。',
                        '适合开荒：你打前站，队伍慢慢聚齐。',
                        '方案要自己找，体质才会一点点抬起来。',
                        '真诚在前，回应会来，只是不在当下。',
                        '出发时手忙脚乱，抵达时人齐事圆。',
                        '跑断腿办手续那段最累，家人支持会晚一点到。',
                        '薄弱科得自己啃，同伴帮衬是加分项不是救命草。',
                        '应诉初期形单影只，证人声援往往不在第一场。',
                        '你破开僵局，联盟才会愿意站到你这边。'
                    )
            };
        }

        if (benRel === '用克体' && bianRel === '比和') {
            return {
                title: '🟡【平吉 · 苦尽甘来】化敌为友',
                line1: '始图艰难，终能言和；历尽波折，化敌为友。',
                line2: '触底反弹。开局压力大，挺住后化干戈为玉帛。' +
                    scenes9(
                        '浮亏别慌着割，扛住往往等得到回暖。',
                        '挑剔与竞争刺耳，挺过去可能变成同事或伙伴。',
                        '来势汹时别慌，正规治疗仍有转机。',
                        '口角难免，说开了关系反而更实。',
                        '出门不顺时放慢节奏，柳暗花明常见。',
                        '价码来回拉锯正常，别被第一口价吓退。',
                        '模考砸了一次不代表终局，稳住心态最要紧。',
                        '对立只是过程，调解窗口还在。',
                        '僵持不等于破裂，各退半步就能签字。'
                    )
            };
        }

        if (benRel === '体生用' && bianRel === '比和') {
            return {
                title: '🟡【平吉 · 苦尽甘来】因祸得福',
                line1: '始虽吃亏，终得回报；以诚相待，化作知交。',
                line2: '先付后获。真诚打动环境，终达共赢。' +
                    scenes9(
                        '适合慢钱：熬得住寂寞，收益才托得住。',
                        '替人挡过事的人，机会往往记在账上。',
                        '调理虽闷，隐患清掉比吃药痛快。',
                        '多付出一阵子，关系会回到对等。',
                        '路上小插曲别计较，终点常有惊喜。',
                        '该花的装修/中介费别抠太死，住进去才省心。',
                        '基础打得闷，分数却最认这个。',
                        '条款上略让一步，日后扯皮会少很多。',
                        '示一次诚，换来的是可续约的信任。'
                    )
            };
        }

        // =========================================================================
        // 第三档：转化博弈
        // =========================================================================
        if (benRel === '用克体' && bianRel === '用生体') {
            return {
                title: '🟡【平吉 · 苦尽甘来】苦尽甘来',
                line1: '先逆后顺，迎刃而解；中途转机，贵人提携。',
                line2: '逆风翻盘。开局极压，挺过后强力转机。' +
                    scenes9(
                        '回撤段别砍在地板上，利好往往迟到不缺席。',
                        '打压最猛时咬牙，贵人多半在拐点附近出现。',
                        '吓人的多半是表象，对症后恢复可以很快。',
                        '缘分卡壳时别硬推，转角常有新局面。',
                        '折腾一阵别急着取消行程，中途会有人拉一把。',
                        '前几套不对眼很正常，对的那套往往不在首看。',
                        '一次模考失利说明不了什么，关键点打通会忽然提分。',
                        '暂时被动也别慌，证据或调解人会补位。',
                        '压价刺耳时稳住，第三方一进场局面就活。'
                    )
            };
        }

        if (benRel === '体生用' && bianRel === '用生体') {
            return {
                title: '🟡【平吉 · 苦尽甘来】投桃报李',
                line1: '始虽奉献，终获厚报；投桃报李，舍得之间。',
                line2: '功不唐捐。先让利，结局双倍回流。' +
                    scenes9(
                        '定投思维：舍得出本金，才等得到主升段。',
                        '替组织拆过炸弹的人，重用通常不会太远。',
                        '排毒期难受，熬过去元气会回来。',
                        '真心不亏，回应可能慢但分量足。',
                        '出门带诚意，回程收获往往超预期。',
                        '装修心力花到位，居住体验会天天提醒你。',
                        '题海枯燥，分数却认认真真记账。',
                        '配合调查别躲，结果面通常更干净。',
                        '你愿让渡一点资源，对方才有空间回馈。'
                    )
            };
        }

        if (benRel === '体克用' && bianRel === '用生体') {
            return {
                title: '🟡【中吉 · 劳心有成】先控后助',
                line1: '主动开局，善始善终；掌控之后，更得助力。',
                line2: '高级控盘循环。你先强势破局，后外部力量主动来助。' +
                    scenes9(
                        '仓位自己控稳，抬轿资金才肯进场。',
                        '实力摆上台面，资源才会跟着你走。',
                        '作息药物配合好，疗效会突然放大。',
                        '主动权在你时，对方回应会变得积极。',
                        '你带队时，路上反而更常碰到方便。',
                        '大条款谈死，银行中介才肯加速跑。',
                        '重点章节撕开，点拨才会听得进。',
                        '主张清晰有力，支持票才容易聚拢。',
                        '框架立住，对方追加投入才有理由。'
                    )
            };
        }

        // =========================================================================
        // 第四档：辛苦与风险
        // =========================================================================
        if (benRel === '比和' && bianRel === '体克用') {
            return {
                title: '🟠【消耗 · 前顺后耗】和而后战',
                line1: '开局和谐，后需主动攻坚；先顺后苦，辛苦得成。',
                line2: '有底气的辛苦胜局。开局基础好，后期需你亲自死磕。' +
                    scenes9(
                        '开头顺只是热身，洗盘段才要定力。',
                        '合同好签，落地全靠加班啃。',
                        '底子不差，小毛病仍要管住嘴和作息。',
                        '甜蜜过后是柴米油盐，一起扛才算数。',
                        '上半场轻松，下半场精神不能散。',
                        '意向热络不代表完事，交房收尾最碎。',
                        '氛围再好也代替不了冲刺周的汗。',
                        '调解桌上好说话，执行阶段仍要盯。',
                        '大纲好商量，细则才是硬仗。'
                    )
            };
        }

        if ((benRel === '体生用' && bianRel === '体克用') || (benRel === '用生体' && bianRel === '体克用')) {
            return {
                title: '🟠【消耗 · 谨防波动】险中求胜',
                line1: '虽有波折，仍需亲为；掌控全局，多劳多得。',
                line2: '硬仗格局。收尾需你全力主导，辛苦但可成。' +
                    scenes9(
                        '波动大时死盯纪律，比赌方向更重要。',
                        '总攻夜突发多，关键节点你得在场。',
                        '这是攻坚期，苦一点换根治划算。',
                        '关系要过关卡才算牢。',
                        '行程碎事不断，协调能力比体力重要。',
                        '验房、维权别假手他人，漏一项都麻烦。',
                        '临门一脚最耗神，节奏乱了前功尽弃。',
                        '庭审与执行必须亲力，代理只能辅助。',
                        '终局看细节：一个数字就能改写结果。'
                    )
            };
        }

        if (benRel === '用生体' && bianRel === '用克体') {
            return {
                title: '🟠【消耗 · 前顺后耗】虎头蛇尾',
                line1: '初时顺遂，切莫大意；防人掀桌，晚节不保。',
                line2: '高危组合。开头极顺，结局易剧变，务必留后手。' +
                    scenes9(
                        '账面好看时最危险，落袋为安优先。',
                        '开场顺利不代表收官，合同与备份要留好。',
                        '症状轻了≠痊愈，停药听医嘱。',
                        '甜蜜期别上头，突变往往来得突然。',
                        '回程比去程更要小心冲突与违章。',
                        '看中后别锁死自己，合同退路写清楚。',
                        '模考飘红时最忌飘，收心比刷题还重要。',
                        '口头和解别当真，落字之前都可能反水。',
                        '口头利好当不得数，签约前再对一遍条款。'
                    )
            };
        }

        // =========================================================================
        // 第五档：消耗、内耗
        // =========================================================================
        if (benRel === '比和' && (bianRel === '体生用' || bianRel === '用克体')) {
            return {
                title: '🟠【消耗 · 前顺后耗】先顺后耗',
                line1: '开局投缘，后劲需防；守成不易，切勿松懈。',
                line2: '前半场好、后半场需谨慎。基础佳，后期易耗或承压，宜设止损。' +
                    scenes9(
                        '利润好看时更要防回吐，止盈规则写死。',
                        '气氛好不等于预算够，落地最易被加塞。',
                        '现在没大碍，小耗积起来才可怕。',
                        '投缘只是门票，经营不好一样散。',
                        '去时顺畅不代表回得顺，B计划备好。',
                        '房子本身可以，水电物业等隐性开销别低估。',
                        '状态起伏大，用节奏管理自己，别硬拼。',
                        '桌上和气，纸上条款却可能越谈越苛。',
                        '热络之后对方会加条件，你的底线别松。'
                    )
            };
        }

        if ((benRel === '体生用' && bianRel === '体生用') || (benRel === '体生用' && bianRel === '用克体')) {
            return {
                title: '🔴【凶局 · 宜守不宜动】无底深渊',
                line1: '泥牛入海，前路茫茫；断尾求生，及早止损。',
                line2: '持续亏空。建议立即止损，勿盲目追加。' +
                    scenes9(
                        '资产承压，保本优先于面子。',
                        '项目只抽血不输血，越早抽身越好。',
                        '元气见底就别硬扛，换思路比硬顶强。',
                        '付出没有回声，继续只会更空。',
                        '此行不宜，取消比硬撑划算。',
                        '资金链绷着时别上车，一套房能拖垮全局。',
                        '方法不对再勤奋也慢，先改路径。',
                        '缠讼最耗，能谈拢就别耗在程序里。',
                        '你一直在输血，这场合作该停或重谈。'
                    )
            };
        }

        if ((benRel === '用克体' && bianRel === '用克体') || (benRel === '用克体' && bianRel === '体克用') || (benRel === '体克用' && bianRel === '用克体')) {
            return {
                title: '🔴【凶局 · 宜守不宜动】两败俱伤',
                line1: '针尖麦芒，内耗极强；龙争虎斗，两败俱伤。',
                line2: '硬对抗。长期拉锯伤身伤财，宜和解或退出。' +
                    scenes9(
                        '场外噪音太大，空仓观望最干净。',
                        '内卷到伤人，低调或换赛道保命。',
                        '旧疾炎症容易翻，治法宜和不宜猛。',
                        '越吵越远，降温比赢一句重要。',
                        '路上火气大，能不出门就别出门。',
                        '邻里墙根、产权边界都是雷区，慎碰。',
                        '心态比知识点先崩，保节奏才活得下去。',
                        '对峙再升一级就难收，调解窗口要抢。',
                        '硬碰只会散场，留一点余地给彼此。'
                    )
            };
        }

        // =========================================================================
        // 第六档：结局泄气
        // =========================================================================
        if ((benRel === '用生体' && bianRel === '体生用') ||
            (benRel === '用克体' && bianRel === '体生用') ||
            (benRel === '体克用' && bianRel === '体生用')) {
            return {
                title: '🔴【滞纳 · 宜守不宜动】竹篮打水',
                line1: '喧嚣散尽，利归大盘；雷声大作，雨点全无。',
                line2: '后劲不足。开头热闹，结局成果易回归环境，小周期套利易白忙。' +
                    scenes9(
                        '盘面热闹不代表袋里有钱，强做多半空转。',
                        '你在给别人抬轿，功劳簿上不一定有你。',
                        '表面好转也可能是透支，静养比折腾强。',
                        '只有你在输出时，缘分撑不久。',
                        '路反复折返，心比脚更累。',
                        '中介带看很热闹，真能下手的盘却少。',
                        '短期鸡血有，续航不够，别只靠冲刺。',
                        '程序走了一圈，结论可能还是原地。',
                        '席间说得漂亮，落章时往往缩水。'
                    )
            };
        }

        // 兜底（正常五行关系下不应触发）
        return {
            title: '🟠【低迷 · 谨防波动】劳而需慎',
            line1: '全局波动低迷，阻力与内耗并存。',
            line2: '磁场低迷，盲目推进易内耗，宜静待再进。' +
                scenes9(
                    '多看少动，防守为上。',
                    '低调准备，勿强出头。',
                    '亚健康，慢养为主。',
                    '沟通不畅，勿急定终身。',
                    '平淡或有小麻烦，非必要少出。',
                    '不是不能买，是眼下信息还不够下决心。',
                    '基础分最实在，花活少碰。',
                    '能坐下来谈就别闹大。',
                    '条款没看清之前，笔可以先放下。'
                )
        };
    }





    function buildTrigramText(code, alias) {
        var entry = findTrigram(code) || {};
        var name = entry.name || code || '卦';
        var aliasText = entry.alias || alias || '';
        return name + (aliasText ? '（' + aliasText + '）' : '');
    }

    function getMutualTrigrams(bits) {
        var arr = String(bits || '').split('');
        if (arr.length < 6) return { upper: null, lower: null };
        var lowerBits = arr[2] + arr[3] + arr[4];
        var upperBits = arr[1] + arr[2] + arr[3];
        return { upper: upperBits, lower: lowerBits };
    }

    function findTrigramIndex(code) {
        var target = String(code || '');
        for (var i = 0; i < xt8guaData.length; i++) {
            var entry = xt8guaData[i] || {};
            if ((entry.code || '') === target || (entry.root || '') === target) {
                return i;
            }
        }
        return null;
    }

    function findHexagramByTrigrams(upCode, downCode) {
        var upIndex = findTrigramIndex(upCode);
        var downIndex = findTrigramIndex(downCode);
        if (upIndex === null || downIndex === null || !window.zy64guaData) return null;
        for (var i = 0; i < zy64guaData.length; i++) {
            var entry = zy64guaData[i] || {};
            var code = String(entry.code || '');
            if (code.length >= 2 && code[0] === String(upIndex) && code[1] === String(downIndex)) {
                return entry;
            }
        }
        return null;
    }

    function render(payload) {
        if (!payload) {
            document.getElementById('panel-ben').innerHTML = '<div class="empty">暂无卦象数据。</div>';
            document.getElementById('panel-hu').innerHTML = '<div class="empty">暂无卦象数据。</div>';
            document.getElementById('panel-bian').innerHTML = '<div class="empty">暂无卦象数据。</div>';
            return;
        }

        // bits / bianbits：上卦3位 + 下卦3位（自上爻→初爻）
        var bits = (payload.upCode || '') + (payload.downCode || '');
        var bianbits = (payload.bianUpCode || '') + (payload.bianDownCode || '');
        var changeYao = Number(payload.changeYao || 0);

        // 梅花体用：动爻所在卦为「用」，另一卦为「体」
        // 动爻 4–6 在上卦 → 上用下体；动爻 1–3 在下卦 → 下用上体
        var bodyCode = '';
        var useCode = '';
        var bianBodyCode = '';
        var bianUseCode = '';
        if (changeYao >= 4) {
            bodyCode = bits.slice(3, 6);
            useCode = bits.slice(0, 3);
            bianBodyCode = bianbits.slice(3, 6);
            bianUseCode = bianbits.slice(0, 3);
        } else {
            bodyCode = bits.slice(0, 3);
            useCode = bits.slice(3, 6);
            bianBodyCode = bianbits.slice(0, 3);
            bianUseCode = bianbits.slice(3, 6);
        }

        // 名称以二进制反查八卦为准（勿混用 payload 上下别名）
        var bodyName = buildTrigramText(bodyCode, '');
        var useName = buildTrigramText(useCode, '');
        var benRel = getRelation(
            bodyName.replace(/（.*?）/g, ''),
            useName.replace(/（.*?）/g, '')
        );

        var bianBodyName = buildTrigramText(bianBodyCode, '');
        var bianUseName = buildTrigramText(bianUseCode, '');
        var bianRel = getRelation(
            bianBodyName.replace(/（.*?）/g, ''),
            bianUseName.replace(/（.*?）/g, '')
        );

        // 互卦：上互=2–4爻(自上)，下互=3–5爻(自上)
        var mut = getMutualTrigrams(bits);
        var huUpName = buildTrigramText(mut.upper, '');
        var huDownName = buildTrigramText(mut.lower, '');
        var huRelRaw = getRelation(
            huUpName.replace(/（.*?）/g, ''),
            huDownName.replace(/（.*?）/g, '')
        );
        var huRel = toShangXiaRel(huRelRaw);

        // 本卦/变卦六爻象：必须用「真上+真下」，不能用体用置换后的组合
        var benUp = bits.slice(0, 3);
        var benDown = bits.slice(3, 6);
        var bianUp = bianbits.slice(0, 3);
        var bianDown = bianbits.slice(3, 6);
        var benHex = findHexagramByTrigrams(benUp, benDown);
        var huHex = findHexagramByTrigrams(mut.upper, mut.lower);
        var bianHex = findHexagramByTrigrams(bianUp, bianDown);
        var duan = getDuanText(benRel, bianRel);

        function pureName(full) {
            return String(full || '').replace(/（.*?）/g, '').trim();
        }

        function escHtml(s) {
            return String(s == null ? '' : s)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        function openGuaIntroFromHex(hex) {
            if (!hex || !window.zy64guaData) return;
            var idx = -1;
            for (var i = 0; i < zy64guaData.length; i++) {
                if (zy64guaData[i] && (zy64guaData[i].name === hex.name || zy64guaData[i].code === hex.code)) {
                    idx = i;
                    break;
                }
            }
            if (idx < 0) return;
            try {
                var entry = zy64guaData[idx];
                var code = String(entry.code || '');
                var upIndex = code.length >= 1 ? Number(code[0]) : null;
                var downIndex = code.length >= 2 ? Number(code[1]) : null;
                var upObj = (upIndex != null && xt8guaData[upIndex]) ? xt8guaData[upIndex] : null;
                var downObj = (downIndex != null && xt8guaData[downIndex]) ? xt8guaData[downIndex] : null;
                var upBits = upObj ? (upObj.code || upObj.root || '') : '';
                var downBits = downObj ? (downObj.code || downObj.root || '') : '';
                localStorage.setItem('gua_intro', JSON.stringify({
                    entry: entry,
                    listIndex: idx,
                    upIndex: upIndex,
                    downIndex: downIndex,
                    upObj: upObj,
                    downObj: downObj,
                    hexBits: String(upBits).slice(0, 3) + String(downBits).slice(0, 3)
                }));
                window.location.href = 'guaintro.html';
            } catch (e) {
                console.error(e);
            }
        }

        /** mode: 'tiyong' | 'shangxia' */
        function renderGuaCard(name1, name2, rel, hex, mode) {
            var n1 = pureName(name1);
            var n2 = pureName(name2);
            var el1 = getElement(n1);
            var el2 = getElement(n2);
            var lab1 = mode === 'shangxia' ? '上卦' : '体卦';
            var lab2 = mode === 'shangxia' ? '下卦' : '用卦';
            var relLab = mode === 'shangxia' ? '上下关系' : '体用关系';

            var html = '';
            if (hex && hex.name) {
                html += '<div class="hex-name"><a href="javascript:void(0)" class="hex-link" data-hex-name="' +
                    escHtml(hex.name) + '" title="查看详细介绍">' + escHtml(hex.name) + '</a></div>';
            } else {
                html += '<div class="hex-name" style="color:#666;letter-spacing:0.1em;">—</div>';
            }

            html += '<div class="kv-list">';
            html += '<div class="kv-row"><span class="k">' + lab1 + '</span><span class="v">' +
                escHtml(name1) + ' <span class="wx-tag">' + escHtml(el1) + '</span></span></div>';
            html += '<div class="kv-row"><span class="k">' + lab2 + '</span><span class="v">' +
                escHtml(name2) + ' <span class="wx-tag">' + escHtml(el2) + '</span></span></div>';
            html += '<div class="kv-row"><span class="k">' + relLab + '</span><span class="v"><span class="rel-badge">' +
                escHtml(rel || '—') + '</span></span></div>';
            html += '</div>';

            if (hex && hex.desc) {
                html += '<div class="desc-mini">' + escHtml(hex.desc) + '</div>';
            }
            if (hex && hex.img) {
                html += '<img class="gua-thumb" src="' + escHtml(hex.img) + '" alt="' + escHtml(hex.name || '') +
                    '" loading="lazy" decoding="async">';
            }
            return html;
        }

        /**
         * 拆分 line2：总述 intro + 场景卡片 scenes
         * 总述与 line1 同框显示；场景单独成卡
         */
        function parseDuanLine2(line2) {
            var raw = String(line2 || '');
            var parts = raw.split(/<br\s*\/?>/i).map(function (s) { return s.trim(); }).filter(Boolean);
            var intro = [];
            var scenes = [];
            // 场景行：📈【投资金融】正文（含扩展九维图标）
            var sceneRe2 = /^(📈|💼|🩺|❤️|🚗|🏠|📚|⚖️|🤝)\s*【([^】]+)】\s*(.*)$/;

            parts.forEach(function (p) {
                var m = p.match(sceneRe2);
                if (m) {
                    scenes.push({ icon: m[1], title: m[2], text: m[3] });
                } else {
                    intro.push(p);
                }
            });
            return { intro: intro, scenes: scenes };
        }

        function renderDuanQuote(line1, introLines) {
            var html = '<div class="duan-quote">';
            html += '<div class="duan-quote-main">' + escHtml(line1 || '') + '</div>';
            if (introLines && introLines.length) {
                html += '<div class="duan-quote-sub">' +
                    introLines.map(function (p) { return escHtml(p); }).join('<br>') +
                    '</div>';
            }
            html += '</div>';
            return html;
        }

        function renderDuanScenes(scenes) {
            if (!scenes || !scenes.length) return '';
            var html = '<div class="duan-body"><div class="duan-scenes">';
            scenes.forEach(function (s) {
                html += '<div class="duan-scene"><div class="scene-h">' +
                    escHtml(s.icon + ' ' + s.title) + '</div>' + escHtml(s.text) + '</div>';
            });
            html += '</div></div>';
            return html;
        }

        document.getElementById('panel-ben').innerHTML = renderGuaCard(
            bodyName, useName, benRel, benHex, 'tiyong'
        );
        document.getElementById('panel-hu').innerHTML = renderGuaCard(
            huUpName, huDownName, huRel, huHex, 'shangxia'
        );
        document.getElementById('panel-bian').innerHTML = renderGuaCard(
            bianBodyName, bianUseName, bianRel, bianHex, 'tiyong'
        );

        var parsed = parseDuanLine2(duan.line2);
        document.getElementById('panel-duan').innerHTML = [
            '<div class="duan-title">' + escHtml(duan.title) + '</div>',
            renderDuanQuote(duan.line1, parsed.intro),
            renderDuanScenes(parsed.scenes) ||
                (parsed.intro.length ? '' : '<div class="empty">暂无解析</div>')
        ].join('');

        // 卦名跳转介绍
        document.querySelectorAll('.hex-link').forEach(function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                var name = a.getAttribute('data-hex-name');
                var hex = null;
                if (name && window.zy64guaData) {
                    for (var i = 0; i < zy64guaData.length; i++) {
                        if (zy64guaData[i] && zy64guaData[i].name === name) {
                            hex = zy64guaData[i];
                            break;
                        }
                    }
                }
                if (hex) openGuaIntroFromHex(hex);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        render(parsePayload());
    });
})();
