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

    function getDuanText(benRel, bianRel) {
        // ==========================================
        // 1. 健壮性检查
        // ==========================================
        if (!benRel || !bianRel) {
            return {
                title: '【暂无断语】',
                line1: '乾坤未定，变数丛生。',
                line2: '未能获取到完整的本卦或变卦五行生克关系，请重新起卦尝试。'
            };
        }

        // ==========================================
        // 2. 完美双比和 / 锦上添花爆款
        // ==========================================
        if (benRel === '比和' && bianRel === '比和') {
            return {
                title: '【比肩同气】',
                line1: '挚友相扶，同气连枝；强强联手，固若金汤。',
                line2: '这是最稳固的“神仙组合”，占得此卦，主大吉。说明你和要测的人、事、环境气场完全相投，一拍即合。周围的人都会来帮你，做起来毫不费力，双方互利共赢，事情自然而然就能水到渠成。'
            };
        }
        if (benRel === '比和' && bianRel === '用生体') {
            return {
                title: '【锦上添花】',
                line1: '始遇知己，终获大奖；顺水推舟，造化无穷。',
                line2: '极其幸运的组合。一开局大家就谈得非常投缘，气场相投。随着事情的发展，到了大结局，对方甚至愿意拿出更多的资源、利益来主动推你一把（用生体）。属于好上加好，收尾时利益最大化的绝佳之象。'
            };
        }
        if (benRel === '用生体' && bianRel === '用生体') {
            return {
                title: '【顺风顺水】',
                line1: '天时地利，左右逢源；不费吹灰，圆满成功。',
                line2: '这是最吉利的组合。这件事对你非常有利。一路上顺风顺水，阻力极小。结局也异常圆满，属于天时地利人和备齐。'
            };
        }

        // ==========================================
        // 3. 各种中途或结局大和解（变卦比和）
        // ==========================================
        if (benRel === '用生体' && bianRel === '比和') {
            return {
                title: '【贵人铺路】',
                line1: '知己收尾，万事皆顺；顺水推舟，造化无穷。',
                line2: '极其丝滑的极速通关之象。一开局就有很好的机遇、大势或贵人主动送上门来带你入门（用生体）。到了大结局时，你与这件事或者整个团队完美融合，彼此打成一片、利益共享（比和）。属于从头顺到尾，毫无内耗的圆满结局。'
            };
        }
        if (benRel === '用克体' && bianRel === '比和') {
            return {
                title: '【化敌为友】',
                line1: '始图艰难，终能言和；历尽波折，化敌为友。',
                line2: '典型的“触底反弹”剧本。刚开始外部环境对你极其挑剔，压力大到让你喘不过气（用克体）。但千万别放弃，随着事情发展，到了最终大结局时，对方被你的诚意打动，或者危机解除，大家反而变成了并肩作战的伙伴（比和）。属于化干戈为玉帛、平安落幕之象。'
            };
        }
        if (benRel === '体克用' && bianRel === '比和') {
            return {
                title: '【群援相随】',
                line1: '先苦后甜，越做越顺；孤军奋战，终得群援。',
                line2: '靠实力赢得市场的开拓者之象。刚开始需要你担任主角、费尽心力去主动推进、征服这个项目（体克用）。但只要你把它啃下来，到了大结局时，事情就有了深厚的群众基础，大家都来响应你、配合你（比和），从你一人的“孤军奋战”变成大家的“同心协力”。'
            };
        }
        if (benRel === '体生用' && bianRel === '比和') {
            return {
                title: '【因祸得福】',
                line1: '始虽吃亏，终得回报；以诚相待，化作知交。',
                line2: '这是一个典型的“先付出后收获”的温情剧本。刚开始你需要单方面付出巨大的精力、资金或情绪价值去倒贴这件事，或者感觉一直在为别人作嫁衣、白白消耗自己（体生用）。但由于你前期铺垫得好，到了最终大结局时，对方被你的真诚打动，或者环境回暖，双方最终达成了利益对等的完美和解，变成了平起平坐、互利共赢的伙伴关系（比和）。属于“前期广结善缘，后期广收福报”之象。'
            };
        }

        // ==========================================
        // 4. 经典的转化型组合（好坏交织）
        // ==========================================
        if (benRel === '用克体' && bianRel === '用生体') {
            return {
                title: '【苦尽甘来】',
                line1: '先逆后顺，迎刃而解；中途转机，贵人提携。',
                line2: '开局阻力极大，甚至让你一度想放弃。但挺过眼前的难关过后，中途会迎来强烈的转机或有贵人出手相助，大结局非常圆满，甚至超出预期。'
            };
        }
        if (benRel === '用生体' && bianRel === '用克体') {
            return {
                title: '【虎头蛇尾】',
                line1: '初时顺遂，切莫大意；防人掀桌，晚节不保。',
                line2: '刚开始顺利得超乎想象，让你觉得闭着眼睛都能赢。但千万小心，最后关头容易发生变故，被人过河拆桥或遭遇逆转，一定要防范大意失荆州。'
            };
        }
        if (benRel === '体生用' && bianRel === '用生体') {
            return {
                title: '【投桃报李】',
                line1: '始虽奉献，终获厚报；投桃报李，舍得之间。',
                line2: '这是一个“先付出、后收获”的幸运剧本。刚开始需要你投入较多的心力、资金或资源去铺垫（体生用），看起来有些吃亏。但你的付出绝不白费，大结局时会迎来强烈的回报与福报（用生体），属于财源回流、功不唐捐之象。'
            };
        }

        // ==========================================
        // 5. 新增升级分支：【险中求胜】
        // 涵盖：体生用➔体克用（你问的）、用生体➔体克用、比和➔体克用
        // ==========================================
        if (
            (benRel === '体生用' && bianRel === '体克用') ||
            (benRel === '用生体' && bianRel === '体克用') ||
            (benRel === '比和' && bianRel === '体克用')
        ) {
            return {
                title: '【险中求胜】',
                line1: '虽有波折，仍需亲为；掌控全局，多劳多得。',
                line2: '属于硬碰硬、凭实力咬牙拿下的格局。无论开局是轻松、相投还是处于消耗状态，最终收尾阶段都需要你亲自充当主角，耗费极大的个人心力和能量去主导、去死磕攻坚（变卦体克用）。好在主权在手，大结局确定能成，属于一分耕耘一分收获的辛苦胜局。'
            };
        }

        // ==========================================
        // 6. 新增升级分支：【两败俱伤】（纯对抗局）
        // 涵盖：用克体➔用克体、用克体➔体克用、体克用➔用克体
        // ==========================================
        if (
            (benRel === '用克体' && bianRel === '用克体') ||
            (benRel === '用克体' && bianRel === '体克用') ||
            (benRel === '体克用' && bianRel === '用克体')
        ) {
            return {
                title: '【两败俱伤】',
                line1: '针尖麦芒，内耗极强；龙争虎斗，两败俱伤。',
                line2: '这件事情的发展磁场充满了强烈的对抗、挑剔与厮杀。你与环境、对手之间属于互不相让的状态。即便在某些阶段你能占据上风，长期的拉锯战也极易让你元气大伤。如果测竞争或对垒，属于需要付出惨痛代价、极其疲惫的“惨胜或两伤”之象。'
            };
        }

        // ==========================================
        // 7. 新增升级分支：【无底深渊】（纯失血局）
        // 涵盖：体生用➔体生用、体生用➔用克体
        // ==========================================
        if (
            (benRel === '体生用' && bianRel === '体生用') ||
            (benRel === '体生用' && bianRel === '用克体')
        ) {
            return {
                title: '【无底深渊】',
                line1: '泥牛入海，前路茫茫；断尾求生，及早止损。',
                line2: '占得此卦，能量磁场处于持续亏空状态。开局你就在单方面砸钱或贴精力（体生用），到了后期非但没有回流，反而可能继续深陷损耗或遭遇外部迎头痛击（变卦体生用/用克体）。做这件事如同泥牛入海，建议保持清醒，切莫盲目追加投入，必要时断尾求生。'
            };
        }

        // ==========================================
        // 8. 新增升级分支：【竹篮打水】（其余结局泄气局）
        // 涵盖：用生体➔体生用、用克体➔体生用、体克用➔体生用
        // ==========================================
        if (
            (benRel === '用生体' && bianRel === '体生用') ||
            (benRel === '用克体' && bianRel === '体生用') ||
            (benRel === '体克用' && bianRel === '体生用')
        ) {
            return {
                title: '【竹篮打水】',
                line1: '喧嚣散尽，为人作嫁；雷声大作，雨点全无。',
                line2: '这个剧本最大的隐患在于“后劲不足”。无论开头看起来是得到关照、互相竞争还是你主动主导，到了最终收尾大结局时，你的成果、精力或主导权都会被对方悄然抽走或消耗殆尽（变卦体生用）。属于雷声大雨点小，最后为人作嫁衣、得不偿失。'
            };
        }

        // ==========================================
        // 9. 绝对保底兜底（防错机制）
        // ==========================================
        return {
            title: '【劳而无用】',
            line1: '虚火一场，为人作嫁；精力耗尽，得不偿失。',
            line2: '全局磁场波动较为低迷，当前所求之事阻力重重或内耗过甚。建议静待时机，不要盲目推进。'
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
        var lowerBits = arr[4] + arr[3] + arr[2];
        var upperBits = arr[3] + arr[2] + arr[1];
        return { upper: upperBits, lower: lowerBits };
    }

    function render(payload) {
        if (!payload) {
            document.getElementById('panel-ben').innerHTML = '<div class="empty">暂无卦象数据。</div>';
            document.getElementById('panel-hu').innerHTML = '<div class="empty">暂无卦象数据。</div>';
            document.getElementById('panel-bian').innerHTML = '<div class="empty">暂无卦象数据。</div>';
            return;
        }

        var bits = (payload.upCode || '') + (payload.downCode || '');
        var changeYao = Number(payload.changeYao || 0);
        var bodyCode = '';
        var useCode = '';
        if (changeYao >= 4) {
            bodyCode = bits.slice(0, 3);
            useCode = bits.slice(3, 6);
        } else {
            bodyCode = bits.slice(3, 6);
            useCode = bits.slice(0, 3);
        }

        var bodyName = buildTrigramText(bodyCode, payload.upAlias || '');
        var useName = buildTrigramText(useCode, payload.downAlias || '');
        var benRel = getRelation(bodyName.replace(/（.*?）/g, ''), useName.replace(/（.*?）/g, ''));

        var bianBodyCode = (payload.bianUpCode || '').slice(0, 3) || '';
        var bianUseCode = (payload.bianDownCode || '').slice(0, 3) || '';
        var bianBodyName = buildTrigramText(bianBodyCode, payload.bianUpAlias || '');
        var bianUseName = buildTrigramText(bianUseCode, payload.bianDownAlias || '');
        var bianRel = getReverseRelation(bianBodyName.replace(/（.*?）/g, ''), bianUseName.replace(/（.*?）/g, ''));

        var mut = getMutualTrigrams(bits);
        var huUpName = buildTrigramText(mut.upper, '');
        var huDownName = buildTrigramText(mut.lower, '');

        var duan = getDuanText(benRel, bianRel);

        document.getElementById('panel-ben').innerHTML = [
            '<div class="line"><span class="label">体卦</span>' + bodyName + '（五行：' + getElement(bodyName.replace(/（.*?）/g, '')) + '）</div>',
            '<div class="line"><span class="label">用卦</span>' + useName + '（五行：' + getElement(useName.replace(/（.*?）/g, '')) + '）</div>',
            '<div class="line"><span class="label">体用关系</span>' + benRel + '：' + getElement(bodyName.replace(/（.*?）/g, '')) + '与' + getElement(useName.replace(/（.*?）/g, '')) + '</div>',
        ].join('');

        document.getElementById('panel-hu').innerHTML = [
            '<div class="line"><span class="label">上卦</span>' + huUpName + '（五行：' + getElement(huUpName.replace(/（.*?）/g, '')) + '）</div>',
            '<div class="line"><span class="label">下卦</span>' + huDownName + '（五行：' + getElement(huDownName.replace(/（.*?）/g, '')) + '）</div>',
            // '<div class="line"><span class="label">公式</span>互卦下卦取本卦第二、第三、第四爻；互卦上卦取本卦第三、第四、第五爻。</div>'
        ].join('');

        document.getElementById('panel-bian').innerHTML = [
            '<div class="line"><span class="label">体卦</span>' + bianBodyName + '（五行：' + getElement(bianBodyName.replace(/（.*?）/g, '')) + '）</div>',
            '<div class="line"><span class="label">用卦</span>' + bianUseName + '（五行：' + getElement(bianUseName.replace(/（.*?）/g, '')) + '）</div>',
            '<div class="line"><span class="label">体用关系</span>' + bianRel + '：' + getElement(bianBodyName.replace(/（.*?）/g, '')) + '与' + getElement(bianUseName.replace(/（.*?）/g, '')) + '</div>'
        ].join('');

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
