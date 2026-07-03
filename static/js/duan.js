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

    function getElement(name) {
        var map = {
            '乾': '金',
            '兑': '金',
            '震': '木',
            '巽': '木',
            '巺': '木',
            '坎': '水',
            '离': '火',
            '坤': '土',
            '艮': '土'
        };
        return map[name] || '未知';
    }


    /**
     * 核心生克决断函数
     * @param {string} body Gua名 (体卦)
     * @param {string} use Gua名 (用卦)
     * @returns {string} 体用五行关系：'比和' | '体生用' | '用生体' | '体克用' | '用克体'
     */
    function resolveRelation(body, use) {
        var bodyEl = getElement(body);
        var useEl = getElement(use);

        if (bodyEl === '未知' || useEl === '未知') return '未知';

        // 1. 同气比和
        if (bodyEl === useEl) return '比和';

        // 五行循环映射链条（相生与相克）
        var sheng = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' };
        var ke = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' };

        // 2. 相生逻辑判定
        if (sheng[bodyEl] === useEl) {
            return '体生用'; // 体生用（如金生水，体泄气）
        }
        if (sheng[useEl] === bodyEl) {
            return '用生体'; // 用生体（如水生金，体获生）
        }

        // 3. 相克逻辑判定
        if (ke[bodyEl] === useEl) {
            return '体克用'; // 体克用（如金克木，体劳心）
        }
        if (ke[useEl] === bodyEl) {
            return '用克体'; // 用克体...（如火克金，体受制）
        }

        return '未知';
    }


    function getRelation(body, use) {
        return resolveRelation(body, use);
    }

    function getReverseRelation(body, use) {
        return resolveRelation(body, use);
    }

    /**
     * 终极完美融合·因果自担·吉凶徽章版：多场景定制化生克断语生成器
     * 支持投资、事业、健康、感情、日常全场景，已集成体用吉凶磁场说明
     */
    function getDuanText(benRel, bianRel) {
        if (!benRel || !bianRel) {
            return {
                title: '⚪【暂无断语 · 乾坤未定】',
                line1: '乾坤未定，变数丛生。',
                line2: '未能获取完整生克关系，请重新起卦。'
            };
        }

        const normalize = (str) => {
            if (typeof str !== 'string') return '';
            return str.trim()
                .replace(/：.*$|[:].*$/g, '')
                .replace(/比肩|同气|和合/g, '比和')
                .replace(/体生|我生|泄气/g, '体生用')
                .replace(/体克|我克/g, '体克用')
                .replace(/用生|生我/g, '用生体')
                .replace(/用克|克我/g, '用克体')
                .substring(0, 3);
        };

        benRel = normalize(benRel);
        bianRel = normalize(bianRel);

        // =========================================================================
        // 第一档：🟢 顶级大吉
        // =========================================================================
        if (benRel === '比和' && bianRel === '比和') {
            return {
                title: '🟢【大吉 · 乾坤生扶】比肩同气',
                line1: '挚友相扶，同气连枝；强强联手，固若金汤。',
                line2: '最稳固的同盟格局，主大吉！你与环境、团队气场完全相投，资源主动靠拢，做事顺风顺水。<br><br>' +
                    '📈【投资金融】极其利好合作盘和中长线布局，伙伴助力明显，容易利滚利。<br>' +
                    '💼【事业工作】团队默契度高，谈判签约顺畅，易遇神队友，项目平稳推进。<br>' +
                    '🩺【健康求医】身体状态平稳，若有小恙易找到对症方案，恢复较快。<br>' +
                    '❤️【感情人际】双方高度同频，三观契合，关系自然升温，容易修成正果或长久和谐。<br>' +
                    '🚗【日常出行】一路顺遂，易在旅途中结识志同道合的新朋友，诸事皆宜。'
            };
        }

        if ((benRel === '用生体' && bianRel === '用生体') || (benRel === '比和' && bianRel === '用生体')) {
            return {
                title: '🟢【大吉 · 乾坤生扶】锦上添花',
                line1: '始遇知己，终获大奖；顺水推舟，造化无穷。',
                line2: '极其幸运的顶级生扶局。开局自带红利，越往后外部资源越主动为你输血，好上加好。<br><br>' +
                    '📈【投资金融】财运爆棚！市场大势站在你这边，适合积极做多，易获波段或政策红利。<br>' +
                    '💼【事业工作】升职加薪或开拓新业务的绝佳时机，贵人主动铺路，方案通过率极高。<br>' +
                    '🩺【健康求医】能量得到强烈滋养，久病者易遇良医，恢复迅速。<br>' +
                    '❤️【感情人际】桃花极旺！对方愿意主动付出，关系快速升温进入稳定甜蜜期。<br>' +
                    '🚗【日常出行】贵人运极旺，在外多得照顾款待，办事出差均能超出预期。'
            };
        }

        if (benRel === '用生体' && bianRel === '比和') {
            return {
                title: '🟢【次吉 · 渐入佳境】贵人铺路',
                line1: '知己收尾，万事皆顺；顺水推舟，造化无穷。',
                line2: '极丝滑的通关之象。开局贵人带你入门，后期完美融合，毫无内耗，从头顺到尾。<br><br>' +
                    '📈【投资金融】前期靠核心消息或大资金带飞，后期进入稳定盈利期，适合成熟稳健资产。<br>' +
                    '💼【事业工作】新项目或入职极为顺利，前期有人带教，后期快速融入团队，氛围融洽。<br>' +
                    '🩺【健康求医】前期治疗效果立竿见影，后期可通过日常调养平稳维持。<br>' +
                    '❤️【感情人际】相处顺理成章，从初见快速走向深度融合，关系对等稳定且互利。<br>' +
                    '🚗【日常出行】顺遂无忧，办事效率高，常得他人热情帮助。'
            };
        }

        // =========================================================================
        // 第二档：🟡 强控与结局大和解
        // =========================================================================
        if (benRel === '体克用' && bianRel === '体克用') {
            return {
                title: '🟡【中吉 · 劳心有成】稳操胜券',
                line1: '运筹帷幄，主权在我；虽需劳心，终必有成。',
                line2: '靠硬实力硬啃胜果的全面胜局！全程主动权在你手中，虽需费心推进，但结局确定能成。<br><br>' +
                    '📈【投资金融】需严格执行自身策略，靠技术与纪律硬赚，不适合盲目跟风。<br>' +
                    '💼【事业工作】你是绝对主导者，工作量大但项目完全在掌控中，一分耕耘一分收获。<br>' +
                    '🩺【健康求医】需主动调理和坚持，虽辛苦但能战胜问题。<br>' +
                    '❤️【感情人际】你掌握节奏，需多付出但可建立牢固稳定关系。<br>' +
                    '🚗【日常出行】行程在计划内，虽劳顿但最终能达成目标。'
            };
        }

        if (benRel === '体克用' && bianRel === '比和') {
            return {
                title: '🟢【次吉 · 渐入佳境】群援相随',
                line1: '先苦后甜，越做越顺；孤军奋战，终得群援。',
                line2: '开拓者剧本。前期独自攻坚，啃下来后大家都会响应配合。<br><br>' +
                    '📈【投资金融】前期独自承担风险建仓，后期主力跟进，顺利退出。<br>' +
                    '💼【事业工作】适合创业或新领域，前期冲锋，后期团队同心。<br>' +
                    '🩺【健康求医】前期劳心找方案，后期免疫力重回巅峰。<br>' +
                    '❤️【感情人际】你先主动付出，后被对方真心接纳。<br>' +
                    '🚗【日常出行】开局手忙脚乱，后期与团队汇合，热闹圆满。'
            };
        }

        if (benRel === '用克体' && bianRel === '比和') {
            return {
                title: '🟡【平吉 · 苦尽甘来】化敌为友',
                line1: '始图艰难，终能言和；历尽波折，化敌为友。',
                line2: '触底反弹格局。开局压力大，挺住后化干戈为玉帛。<br><br>' +
                    '📈【投资金融】开局可能套牢，勿盲目割肉，熬过去后行情回暖。<br>' +
                    '💼【事业工作】先遭挑剔或竞争，后期和解转为伙伴。<br>' +
                    '🩺【健康求医】前期症状来势汹汹，后期积极治疗可转危为安。<br>' +
                    '❤️【感情人际】前期有矛盾，后期冰释前嫌，关系反而更紧密。<br>' +
                    '🚗【日常出行】开局有阻碍，保持耐心后自然转机。'
            };
        }

        if (benRel === '体生用' && bianRel === '比和') {
            return {
                title: '🟡【平吉 · 苦尽甘来】因祸得福',
                line1: '始虽吃亏，终得回报；以诚相待，化作知交。',
                line2: '先付出后收获的温情剧本。你的真诚最终打动环境，达成共赢。<br><br>' +
                    '📈【投资金融】价值投资型，前期投入寂寞，后期回报稳定。<br>' +
                    '💼【事业工作】前期帮别人铺路，后期获提拔或期权。<br>' +
                    '🩺【健康求医】前期全面调理辛苦，后期根除隐患。<br>' +
                    '❤️【感情人际】先单方面付出，后收获真心与平衡关系。<br>' +
                    '🚗【日常出行】前期小插曲多，后期获超值回报。'
            };
        }

        // =========================================================================
        // 第三档：🟡 转化博弈
        // =========================================================================
        if (benRel === '用克体' && bianRel === '用生体') {
            return {
                title: '🟡【平吉 · 苦尽甘来】苦尽甘来',
                line1: '先逆后顺，迎刃而解；中途转机，贵人提携。',
                line2: '逆风翻盘剧本！开局压力极大，挺过去后中途强力转机。<br><br>' +
                    '📈【投资金融】开局回撤明显，勿在低点割肉，中后期资金与利好涌入。<br>' +
                    '💼【事业工作】先遭打压，扛住后贵人提携。<br>' +
                    '🩺【健康求医】初期吓人，后找到良方快速好转。<br>' +
                    '❤️【感情人际】前期不顺，后突然开窍或遇良缘。<br>' +
                    '🚗【日常出行】开局折腾，中途获帮助，结局惊喜。'
            };
        }

        if (benRel === '体生用' && bianRel === '用生体') {
            return {
                title: '🟡【平吉 · 苦尽甘来】投桃报李',
                line1: '始虽奉献，终获厚报；投桃报李，舍得之间。',
                line2: '功不唐捐格局。先主动让利，结局双倍回流。<br><br>' +
                    '📈【投资金融】长线定投佳，前期舍得，后期主升浪。<br>' +
                    '💼【事业工作】帮老板解决痛点，后获重用与回报。<br>' +
                    '🩺【健康求医】先破后立，排毒后元气大补。<br>' +
                    '❤️【感情人际】先真心付出，后收获加倍回应。<br>' +
                    '🚗【日常出行】带诚意出门，收获远超预期。'
            };
        }

        if (benRel === '体克用' && bianRel === '用生体') {
            return {
                title: '🟡【中吉 · 劳心有成】先控后助',
                line1: '主动开局，善始善终；掌控之后，更得助力。',
                line2: '高级控盘循环。你先强势破局，后外部力量主动来助。<br><br>' +
                    '📈【投资金融】前期精准仓管，后期主力抬轿。<br>' +
                    '💼【事业工作】先证明实力拿主导，后获资源倾斜。<br>' +
                    '🩺【健康求医】前期自律治疗，后药物事半功倍。<br>' +
                    '❤️【感情人际】你掌握主动，后期对方积极回应。<br>' +
                    '🚗【日常出行】你当领头羊，中途获意外便利。'
            };
        }

        // =========================================================================
        // 第四档：🟠 辛苦与风险
        // =========================================================================
        if (benRel === '比和' && bianRel === '体克用') {
            return {
                title: '🟠【消耗 · 前顺后耗】和而后战',
                line1: '开局和谐，后需主动攻坚；先顺后苦，辛苦得成。',
                line2: '有底气的辛苦胜局。开局基础好，后期需你亲自死磕。<br><br>' +
                    '📈【投资金融】开局愉快，后进入洗盘期，需定力硬啃。<br>' +
                    '💼【事业工作】合同顺利，落地执行需你加班攻坚。<br>' +
                    '🩺【健康求医】基础不错，小毛病需自律治疗。<br>' +
                    '❤️【感情人际】前期甜蜜，后期需共同面对现实考验。<br>' +
                    '🚗【日常出行】前半程轻松，后半程需打起精神应对。'
            };
        }

        if ((benRel === '体生用' && bianRel === '体克用') || (benRel === '用生体' && bianRel === '体克用')) {
            return {
                title: '🟠【消耗 · 谨防波动】险中求胜',
                line1: '虽有波折，仍需亲为；掌控全局，多劳多得。',
                line2: '硬仗格局。收尾需你全力主导，辛苦但可成。<br><br>' +
                    '📈【投资金融】高风险高回报，需死盯盘面与严格纪律。<br>' +
                    '💼【事业工作】总攻阶段突发多，需亲临一线攻坚。<br>' +
                    '🩺【健康求医】进入攻坚期，需主动治疗虽苦但可根治。<br>' +
                    '❤️【感情人际】需经历考验才能稳固关系。<br>' +
                    '🚗【日常出行】波折不断，需不停协调解决麻烦。'
            };
        }

        if (benRel === '用生体' && bianRel === '用克体') {
            return {
                title: '🟠【消耗 · 前顺后耗】虎头蛇尾',
                line1: '初时顺遂，切莫大意；防人掀桌，晚节不保。',
                line2: '高危组合。开头极顺，结局易剧变，务必留后手。<br><br>' +
                    '📈【投资金融】诱多风险高，前期盈利诱人，后期易暴跌，建议落袋为安。<br>' +
                    '💼【事业工作】开头顺利，收尾易被变卦，提前留法律一手。<br>' +
                    '🩺【健康求医】前期缓解是假象，勿盲目停药防反弹。<br>' +
                    '❤️【感情人际】开头甜蜜，后期易生变故。<br>' +
                    '🚗【日常出行】前半程开心，后半程防违章或冲突。'
            };
        }

        // =========================================================================
        // 第五档：🔴 消耗、内耗
        // =========================================================================
        if (benRel === '比和' && (bianRel === '体生用' || bianRel === '用克体')) {
            return {
                title: '🟠【消耗 · 前顺后耗】先顺后耗',
                line1: '开局投缘，后劲需防；守成不易，切勿松懈。',
                line2: '前半场好、后半场需谨慎的格局。开局基础佳，但后期易消耗或压力，提前设止损点。<br><br>' +
                    '📈【投资金融】开局顺，后期利润易被吞噬。<br>' +
                    '💼【事业工作】前期和谐，落地后易预算超支或被加码。<br>' +
                    '🩺【健康求医】目前无大碍，但潜伏内耗，勿拖延。<br>' +
                    '❤️【感情人际】开头投缘，后期需持续经营防疲惫。<br>' +
                    '🚗【日常出行】去时顺利，回程易遇麻烦，做足B计划。'
            };
        }

        if ((benRel === '体生用' && bianRel === '体生用') || (benRel === '体生用' && bianRel === '用克体')) {
            return {
                title: '🔴【凶局 · 宜守不宜动】无底深渊',
                line1: '泥牛入海，前路茫茫；断尾求生，及早止损。',
                line2: '持续亏空局。建议立即止损，勿盲目追加。<br><br>' +
                    '📈【投资金融】资产承压，尽快割肉保本。<br>' +
                    '💼【事业工作】纯抽血项目，及早抽身。<br>' +
                    '🩺【健康求医】元气透支，建议换方案深度调理。<br>' +
                    '❤️【感情人际】单方面付出无回响，及时止损。<br>' +
                    '🚗【日常出行】大忌，易损失或受阻，建议取消。'
            };
        }

        if ((benRel === '用克体' && bianRel === '用克体') || (benRel === '用克体' && bianRel === '体克用') || (benRel === '体克用' && bianRel === '用克体')) {
            return {
                title: '🔴【凶局 · 宜守不宜动】两败俱伤',
                line1: '针尖麦芒，内耗极强；龙争虎斗，两败俱伤。',
                line2: '硬对抗局。长期拉锯伤身伤财，建议和解或退出。<br><br>' +
                    '📈【投资金融】神仙打架，空仓观望为上。<br>' +
                    '💼【事业工作】内卷严重，宜低调或换赛道。<br>' +
                    '🩺【健康求医】炎症或旧疾爆发，需温和调和。<br>' +
                    '❤️【感情人际】争执不断，建议冷静沟通。<br>' +
                    '🚗【日常出行】易冲突或事故，能不出行则不出行。'
            };
        }

        // =========================================================================
        // 第六档：🔴 结局泄气（即你昨日起到的阳光电源卦象）
        // =========================================================================
        if ((benRel === '用生体' && bianRel === '体生用') ||
            (benRel === '用克体' && bianRel === '体生用') ||
            (benRel === '体克用' && bianRel === '体生用')) {
            return {
                title: '🔴【滞纳 · 宜守不宜动】竹篮打水',
                line1: '喧嚣散尽，利归大盘；雷声大作，雨点全无。', // 微调了这里，更加适配金融语义
                line2: '后劲不足格局。开头轰轰烈烈，结局成果易回归环境，在小周期套利上得不偿失。<br><br>' +
                    '📈【投资金融】看似日内喧闹，最终利润易随时分折损或流失。若强行操作，极易白忙一场。<br>' +
                    '💼【事业工作】易为环境铺路，核心成果在中期容易受到截胡。<br>' +
                    '🩺【健康求医】看似好转实为透支，切莫跟风瞎折腾，需静养补气。<br>' +
                    '❤️【感情人际】单向输出，付出虽多但缘分难长久。<br>' +
                    '🚗【日常出行】路途多反复，精神易疲惫虚耗。'
            };
        }

        // 兜底
        return {
            title: '🟠【低迷 · 谨防波动】劳而需慎',
            line1: '全局波动低迷，阻力与内耗并存。',
            line2: '当前磁场低迷，盲目推进易加剧内耗，建议静待时机，积蓄力量后再谋进取。<br><br>' +
                '📈【投资金融】多看少动，空仓防守为上。<br>' +
                '💼【事业工作】宜低调准备，勿强出头。<br>' +
                '🩺【健康求医】亚健康状态，慢养为主。<br>' +
                '❤️【感情人际】沟通不畅，需耐心，避免急于定终身。<br>' +
                '🚗【日常出行】平淡或有小麻烦，非必要建议居家。'
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

        console.log('payload:', payload);
        var bits = (payload.upCode || '') + (payload.downCode || '');
        var bianbits = (payload.bianUpCode || '') + (payload.bianDownCode || '');
        var changeYao = Number(payload.changeYao || 0);
        var bodyCode = '';
        var useCode = '';
        var bianBodyCode = '';
        var bianUseCode = '';
        if (changeYao >= 4) {
            bodyCode = bits.slice(3, 6);
            bianBodyCode = bianbits.slice(3, 6);
            useCode = bits.slice(0, 3);
            bianUseCode = bianbits.slice(0, 3);
        } else {
            bodyCode = bits.slice(0, 3);
            bianBodyCode = bianbits.slice(0, 3);
            useCode = bits.slice(3, 6);
            bianUseCode = bianbits.slice(3, 6);
        }

        var bodyName = buildTrigramText(bodyCode, payload.upAlias || '');
        var useName = buildTrigramText(useCode, payload.downAlias || '');
        var benRel = getRelation(bodyName.replace(/（.*?）/g, ''), useName.replace(/（.*?）/g, ''));


        var bianBodyName = buildTrigramText(bianBodyCode, payload.bianUpAlias || '');
        var bianUseName = buildTrigramText(bianUseCode, payload.bianDownAlias || '');
        var bianRel = getReverseRelation(bianBodyName.replace(/（.*?）/g, ''), bianUseName.replace(/（.*?）/g, ''));

        var mut = getMutualTrigrams(bits);
        var huUpName = buildTrigramText(mut.upper, '');
        var huDownName = buildTrigramText(mut.lower, '');
        var huRel = getRelation(huUpName.replace(/（.*?）/g, ''), huDownName.replace(/（.*?）/g, ''))
            .replace(/用/g, '下')
            .replace(/体/g, '上');

        var benHex = findHexagramByTrigrams(bodyCode, useCode);
        var huHex = findHexagramByTrigrams(mut.upper, mut.lower);
        var bianHex = findHexagramByTrigrams(bianBodyCode, bianUseCode);
        var duan = getDuanText(benRel, bianRel);

        function renderGuaSection(name1, name2, rel, hex) {

            var imgHtml = '';
            if (hex && hex.img) {
                imgHtml = '<div class="line"><span class="label">卦图</span><img src="' + hex.img + '" alt="' + (hex.name || '') + '" style="max-width:100%;height:auto;display:block;margin:8px 0 0;" /></div>';
            }
            return [
                '<div class="line"><span class="label">体卦</span>' + name1 + '（五行：' + getElement(name1.replace(/（.*?）/g, '')) + '）</div>',
                '<div class="line"><span class="label">用卦</span>' + name2 + '（五行：' + getElement(name2.replace(/（.*?）/g, '')) + '）</div>',
                '<div class="line"><span class="label">体用关系</span>' + rel + '</div>',
                imgHtml
            ].join('');
        }

        function renderGuaSection2(name1, name2, rel, hex) {

            var imgHtml = '';
            if (hex && hex.img) {
                imgHtml = '<div class="line"><span class="label">卦图</span><img src="' + hex.img + '" alt="' + (hex.name || '') + '" style="max-width:100%;height:auto;display:block;margin:8px 0 0;" /></div>';
            }
            return [
                '<div class="line"><span class="label">上卦</span>' + name1 + '（五行：' + getElement(name1.replace(/（.*?）/g, '')) + '）</div>',
                '<div class="line"><span class="label">下卦</span>' + name2 + '（五行：' + getElement(name2.replace(/（.*?）/g, '')) + '）</div>',
                '<div class="line"><span class="label">上下关系</span>' + rel + '</div>',
                imgHtml
            ].join('');
        }

        // document.getElementById('panel-ben').innerHTML = renderGuaSection('本卦', bodyCode, bodyName.replace(/（.*?）/g, ''), payload.upAlias || '', 'ben', benHex);
        // document.getElementById('panel-hu').innerHTML = renderGuaSection('互卦', mut.upper + mut.lower, huUpName.replace(/（.*?）/g, '') + ' / ' + huDownName.replace(/（.*?）/g, ''), '', 'hu', huHex) +
        //     '<div class="line"><span class="label">上下关系</span>' + huRel + '</div>';
        // document.getElementById('panel-bian').innerHTML = renderGuaSection('变卦', bianBodyCode + bianUseCode, bianBodyName.replace(/（.*?）/g, ''), payload.bianUpAlias || '', 'bian', bianHex) +
        //     '<div class="line"><span class="label">体用关系</span>' + bianRel + '</div>';

        document.getElementById('panel-ben').innerHTML = renderGuaSection(
            bodyName,
            useName,
            benRel,
            benHex
        );

        document.getElementById('panel-hu').innerHTML = renderGuaSection2(
            huUpName,
            huDownName,
            huRel,
            huHex
        );

        document.getElementById('panel-bian').innerHTML = renderGuaSection(
            bianBodyName,
            bianUseName,
            bianRel,
            bianHex
        );

        document.getElementById('panel-duan').innerHTML = [
            '<div class="title">' + duan.title + '</div>',
            '<div class="line"><span class="label">断语</span>' + duan.line1 + '</div>',
            '<div class="line"><span class="label">解析</span>' + duan.line2 + '</div>'
        ].join('');
    }

    document.addEventListener('DOMContentLoaded', function () {
        render(parsePayload());
    });
})();
