document.write("<script src='./static/js/data.js'></script>")

// `xt8guaData` is defined in static/js/data.js (included above).

// 初始八卦状态:先天八卦
var status = 0

// Shared date/time helper used by meihua() and zhanbu()
function getDateInfo(now) {
    now = now || new Date();

    var stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    var branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    var y = now.getFullYear();
    var stemIdx = (y - 4) % 10; if (stemIdx < 0) stemIdx += 10;
    var branchIdx = (y - 4) % 12; if (branchIdx < 0) branchIdx += 12;
    var yearTG = stems[stemIdx] + branches[branchIdx];
    var branchNumber = branchIdx + 1; // 1..12

    // try lunar month/day via Intl (fallback to solar)
    var lunarMonth = now.getMonth() + 1;
    var lunarDay = now.getDate();
    try {
        var df = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {month: 'numeric', day: 'numeric'});
        var parts = df.formatToParts(now);
        var m = parts.find(p => p.type === 'month');
        var d = parts.find(p => p.type === 'day');
        if (m && d) {
            lunarMonth = parseInt(m.value, 10);
            lunarDay = parseInt(d.value, 10);
        }
    } catch (e) {
        // ignore, keep solar fallback
    }

    // 时辰 (2-hour blocks) mapping
    var h = now.getHours();
    var shiIndex = Math.floor(((h + 1) % 24) / 2); // 0..11
    var shichen = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][shiIndex];
    var shichenNumber = shiIndex + 1;

    var gregMonth = now.getMonth() + 1;
    var gregDay = now.getDate();

    var hh = String(now.getHours()).padStart(2,'0');
    var mm = String(now.getMinutes()).padStart(2,'0');
    var ss = String(now.getSeconds()).padStart(2,'0');
    var milliseconds = now.getMilliseconds();
    var ms = String(milliseconds).padStart(3,'0');
    var timeHMS = hh + ':' + mm + ':' + ss + ':' + ms;

    return {
        year: y,
        yearTG: yearTG,
        branchNumber: branchNumber,
        lunarMonth: lunarMonth,
        lunarDay: lunarDay,
        gregMonth: gregMonth,
        gregDay: gregDay,
        timeHMS: timeHMS,
        milliseconds: milliseconds,
        shichen: shichen,
        shichenNumber: shichenNumber
    };
}

window.onload = function() {
    // call renderers only when their containers exist — avoids errors when a page omits one
    if (document.getElementById('xt8gua')) {
        try { xt8gua(); } catch (e) { console.error('xt8gua render error', e); }
    }
    if (document.getElementById('zy64gua')) {
        try { zy64gua(); } catch (e) { console.error('zy64gua render error', e); }
    }
}


// 遍历先天八卦
function xt8gua() {
    var xt8guaHTML = ""
    for (var i = 0; i < xt8guaData.length; i++) {
        xt8guaHTML += gua(xt8guaData[i]['name'], xt8guaData[i]['code'], xt8guaData[i]['pstxt'], xt8guaData[i]['pstcn'], xt8guaData[i]['tag'])
    }

    var el = document.getElementById("xt8gua");
    if (el) el.innerHTML = xt8guaHTML
}

// 遍历每一爻，组合成卦
function gua(name, code, pstxt, pstcn, tag) {
    var gua = "<div id='" + tag + "' class='gua " + pstxt + "'>"

    gua += "<label><a href=>" + name + "</a></label>"  

    for (var i = 0; i < code.length; i++) {
        if (code[i] == "0") { // 阴爻
            gua += "<div class='yao yin'>"
        } else { // 阳爻
            gua += "<div class='yao yang'>"
        }

        gua += "<div class='line'></div>"+
                "<div class='change'></div>"+
                "<div class='line'></div>"+
                "</div>"
    }

    gua += "<label class='position' id='pst_" + tag + "'>" + pstcn + "</label>"
    gua += "</div>"

    return gua
}

function zhanbu(){
    // 随机起卦功能已停用，保留原实现以备参考。
    /*
    // generate two random trigrams (lower = yaoxia, upper = yaoshang)
    var yaoxia = [], yaoshang = [];
    for (var k = 0; k < 3; k++) yaoxia.push(Math.random() < 0.5 ? '0' : '1');
    for (var k = 0; k < 3; k++) yaoshang.push(Math.random() < 0.5 ? '0' : '1');
    var sxia = yaoxia.join('');
    var sshang = yaoshang.join('');

    // mapping ordinal to binary code (1..8 -> 3-bit strings)
    var orderToCode = ['111','011','101','001','110','010','100','000'];

    // find trigram index by matching code/root/order mapping
    function findTrigramIndex(binStr) {
        if (!binStr) return null;
        for (var ii = 0; ii < xt8guaData.length; ii++) {
            if ((xt8guaData[ii].code || '') === binStr) return ii;
            if ((xt8guaData[ii].root || '') === binStr) return ii;
            if (xt8guaData[ii].order && orderToCode[xt8guaData[ii].order - 1] === binStr) return ii;
        }
        // fallback: try to find the code position in the standard orderToCode list
        var pos = orderToCode.indexOf(binStr);
        if (pos !== -1) return pos;
        return null;
    }

    var downIndex = findTrigramIndex(sxia); // lower trigram index in xt8guaData
    var upIndex = findTrigramIndex(sshang); // upper trigram index

    // determine up/down root bit-strings (use code/root if available, else map by index)
    function getRootByIndex(idx) {
        if (idx === null || idx === undefined || idx < 0 || idx >= xt8guaData.length) return '000';
        var entry = xt8guaData[idx] || {};
        return (entry.code || entry.root || orderToCode[idx] || '000');
    }

    var upRoot = getRootByIndex(upIndex);
    var downRoot = getRootByIndex(downIndex);

    // random moving yao 1..6
    var changeYao = Math.floor(Math.random() * 6) + 1;

    // build combined 6-bit: upper (3 bits) + lower (3 bits)
    var combined = (upRoot + downRoot).slice(0,6);
    var flipIdx = 6 - changeYao; // index from left (0..5)
    var arrBits = combined.split('');
    if (flipIdx >= 0 && flipIdx < arrBits.length) arrBits[flipIdx] = arrBits[flipIdx] === '0' ? '1' : '0';
    var newBinary = arrBits.join('');
    var bianUpRoot = newBinary.slice(0,3);
    var bianDownRoot = newBinary.slice(3,6);

    // find bian trigram indices
    var bianUpIndex = findTrigramIndex(bianUpRoot);
    var bianDownIndex = findTrigramIndex(bianDownRoot);

    // find matching 64-hexagrams for original and bian
    var foundName = null, foundImg = null, foundRows = null;
    var foundBianName = null, foundBianImg = null, foundBianRows = null;
    for (var i = 0; i < zy64guaData.length; i++) {
        var code = String(zy64guaData[i].code || '');
        if (code.length >= 2) {
            if (upIndex !== null && downIndex !== null && code[0] === String(upIndex) && code[1] === String(downIndex)) {
                foundName = zy64guaData[i].name;
                foundImg = zy64guaData[i].img;
                foundRows = zy64guaData[i].rows;
            }
            if (bianUpIndex !== null && bianDownIndex !== null && code[0] === String(bianUpIndex) && code[1] === String(bianDownIndex)) {
                foundBianName = zy64guaData[i].name;
                foundBianImg = zy64guaData[i].img;
                foundBianRows = zy64guaData[i].rows;
            }
            if (foundName && foundBianName) break;
        }
    }

    var now = new Date();
    var info = getDateInfo(now);

    var upObj = (upIndex !== null) ? xt8guaData[upIndex] : null;
    var downObj = (downIndex !== null) ? xt8guaData[downIndex] : null;
    var bianUpObj = (bianUpIndex !== null) ? (xt8guaData[bianUpIndex] || null) : null;
    var bianDownObj = (bianDownIndex !== null) ? (xt8guaData[bianDownIndex] || null) : null;

    var dataObj = {
        year: info.year,
        yearTG: info.yearTG,
        branchNumber: info.branchNumber,
        lunarMonth: info.lunarMonth,
        lunarDay: info.lunarDay,
        gregMonth: info.gregMonth,
        gregDay: info.gregDay,
        timeHMS: info.timeHMS,
        shichen: info.shichen,
        shichenNumber: info.shichenNumber,
        upIndex: upIndex !== null ? upIndex : -1,
        downIndex: downIndex !== null ? downIndex : -1,
        changeYao: changeYao,
        upName: upObj ? (upObj.name || '') : '',
        downName: downObj ? (downObj.name || '') : '',
        upAlias: upObj ? (upObj.alias || '') : '',
        downAlias: downObj ? (downObj.alias || '') : '',
        bianUpObj: bianUpObj,
        bianDownObj: bianDownObj,
        bianAlias: (bianUpObj && bianUpObj.alias ? bianUpObj.alias : '') + (bianDownObj && bianDownObj.alias ? bianDownObj.alias : ''),
        bianName: (bianUpObj && bianUpObj.name ? bianUpObj.name : '') + (bianDownObj && bianDownObj.name ? bianDownObj.name : ''),
        source: 'zhanbu',
        foundBen: foundName,
        foundImg: foundImg,
        foundRows: foundRows,
        foundBian: foundBianName,
        foundBianImg: foundBianImg,
        foundBianRows: foundBianRows
    };

    try {
        localStorage.setItem('meihua_result', JSON.stringify(dataObj));
        window.location.href = 'meihua_result.html';
    } catch (e) {
        alert('无法保存结果到本地：' + e.message);
    }
    */
    alert('随机起卦已停用，请使用“天时起卦”或“心事起卦”。');
}
// 文王拘而演周易
function xtToHt() {
    if (status == 0) { // 切换到后天八卦
        status = 1
        document.getElementById("bubtn").innerText = "后天八卦☯"

        for (var i = 0; i < xt8guaData.length; i++) {
            var row = xt8guaData[i]
            var cls = row['pstxt'] + "2" + row['pstht']
            var slc = row['pstht'] + "2" + row['pstxt']
            document.getElementById(row['tag']).classList.remove(slc)
            document.getElementById(row['tag']).classList.add(cls)

            document.getElementById("pst_" + row['tag']).innerText = row['psthtcn']
        }
    } else { // 切换到先天八卦
        status = 0
        document.getElementById("bubtn").innerText = "先天八卦☯"

        for (var i = 0; i < xt8guaData.length; i++) {
            var row = xt8guaData[i]
            var cls = row['pstxt'] + "2" + row['pstht']
            var slc = row['pstht'] + "2" + row['pstxt']
            document.getElementById(row['tag']).classList.remove(cls)
            document.getElementById(row['tag']).classList.add(slc)
            document.getElementById("pst_" + row['tag']).innerText = row['pstcn']
        }
    }
}

// 遍历64卦
function zy64gua() {
    var html = ""
    for (var i = 0; i < zy64guaData.length; i++) {
        var code = zy64guaData[i]['code']
        var finalCode = (xt8guaData[String(code)[0]] && xt8guaData[String(code)[0]]['code'] || '') + (xt8guaData[String(code)[1]] && xt8guaData[String(code)[1]]['code'] || '')

        html += gua64(zy64guaData[i]['name'], finalCode, zy64guaData[i]['rows'], zy64guaData[i]['img'], i)
    }

    var el = document.getElementById("zy64gua");
    if (el) el.innerHTML = html
}

// 生成六爻
function gua64(name, code, rows, imgsrc, idx) {
    var html = "<div class='gua64'>"
    for (var i = 0; i < code.length; i++) {
        if (code[i] == 0) {
            html += "<div class='yao64 yin64' title='" + rows[5-i] + "'>"
        } else {
            html += "<div class='yao64 yang64' title='" + rows[5-i] + "'>"
        }

        html += "<div class='line64'></div>"+
                "<div class='change'></div>"+
                "<div class='line64'></div>"+
                "</div>"
    }

    // clicking the name opens guaintro.html with full gua data saved to localStorage
    html += "<label class='name64'><a href='javascript:void(0);' onclick='openGuaIntro("+idx+")'>" + name + "</a></label>"+
            "</div>"

    return html
}

// Save full 64-hexagram entry to localStorage and open guaintro.html
function openGuaIntro(idx) {
    try {
        var entry = zy64guaData[idx];
        if (!entry) return;
        var code = String(entry.code || '');
        var upIndex = (code.length >= 1) ? Number(code[0]) : null;
        var downIndex = (code.length >= 2) ? Number(code[1]) : null;
        var upObj = (upIndex !== null && xt8guaData[upIndex]) ? xt8guaData[upIndex] : null;
        var downObj = (downIndex !== null && xt8guaData[downIndex]) ? xt8guaData[downIndex] : null;
        var payload = {
            entry: entry,
            upIndex: upIndex,
            downIndex: downIndex,
            upObj: upObj,
            downObj: downObj
        };
        localStorage.setItem('gua_intro', JSON.stringify(payload));
        window.location.href = 'guaintro.html';
    } catch (e) {
        console.error('openGuaIntro error', e);
        alert('无法打开卦介绍：' + e.message);
    }
}

// 梅花起卦 (simple implementation) — 原始实现已注释，保留作为参考。
/*
function meihua() {
    try {
        var now = new Date();
        var di = getDateInfo(now);

        // base sums
        var base = di.branchNumber + di.lunarMonth + di.lunarDay;
        var upIndex = base % 8; if (upIndex == 0) upIndex = 8;
        var downIndex = (base + di.shichenNumber) % 8; if (downIndex == 0) downIndex = 8;
        var changeYao = (base + di.shichenNumber) % 6; if (changeYao == 0) changeYao = 6;

        // helper to find trigram entry by order or by code/root
        var orderToCode = ['111','011','101','001','110','010','100','000'];
        function findGua(ord) {
            for (var ii = 0; ii < xt8guaData.length; ii++) {
                if (xt8guaData[ii].order == ord) return {index: ii, entry: xt8guaData[ii]};
            }
            // if ord is a number, map to binary string; if it's already a 3-bit string, try match
            var target = (typeof ord === 'number') ? orderToCode[ord - 1] : String(ord);
            for (var jj = 0; jj < xt8guaData.length; jj++) {
                if ((xt8guaData[jj].code || '') == target || (xt8guaData[jj].root || '') == target) return {index: jj, entry: xt8guaData[jj]};
            }
            return null;
        }

        var upFound = findGua(upIndex);
        var downFound = findGua(downIndex);

        var upObj = upFound ? upFound.entry : {name: ('卦' + upIndex), alias: '', code: '000'};
        var downObj = downFound ? downFound.entry : {name: ('卦' + downIndex), alias: '', code: '000'};
        var upGua = upObj.name;
        var downGua = downObj.name;
        var upAlias = upObj.alias || '';
        var downAlias = downObj.alias || '';
        var upArrayIndex = upFound ? upFound.index : (upIndex - 1);
        var downArrayIndex = downFound ? downFound.index : (downIndex - 1);

        // build combined bits and compute bian
        var upRoot = upObj.code || upObj.root || orderToCode[upArrayIndex] || '000';
        var downRoot = downObj.code || downObj.root || orderToCode[downArrayIndex] || '000';
        var combined = (upRoot + downRoot).slice(0,6);
        var flipIdx = 6 - changeYao;
        var arrBits = combined.split('');
        if (flipIdx >= 0 && flipIdx < arrBits.length) arrBits[flipIdx] = arrBits[flipIdx] === '0' ? '1' : '0';
        var newBinary = arrBits.join('');
        var bianUpRoot = newBinary.slice(0,3);
        var bianDownRoot = newBinary.slice(3,6);

        function findGuaByRoot(root) {
            for (var jj = 0; jj < xt8guaData.length; jj++) {
                if ((xt8guaData[jj].root || '') == root || (xt8guaData[jj].code || '') == root) return {index: jj, entry: xt8guaData[jj]};
            }
            return null;
        }

        var bianUpFound = findGuaByRoot(bianUpRoot);
        var bianDownFound = findGuaByRoot(bianDownRoot);
        var bianUpObj = bianUpFound ? bianUpFound.entry : {name: ('卦'), alias: '', code: bianUpRoot};
        var bianDownObj = bianDownFound ? bianDownFound.entry : {name: ('卦'), alias: '', code: bianDownRoot};
        var bianAlias = (bianUpObj.alias || '') + (bianDownObj.alias || '');
        var bianUpArrayIndex = bianUpFound ? bianUpFound.index : null;
        var bianDownArrayIndex = bianDownFound ? bianDownFound.index : null;

        // lookup zy64guaData by trigram indices
        var foundBen = null, foundImg = null, foundRows = null;
        var foundBian = null, foundBianImg = null, foundBianRows = null;
        for (var i = 0; i < zy64guaData.length; i++) {
            var code = String(zy64guaData[i].code || '');
            if (code.length >= 2) {
                if (code[0] == upArrayIndex && code[1] == downArrayIndex) {
                    foundBen = zy64guaData[i].name; foundImg = zy64guaData[i].img; foundRows = zy64guaData[i].rows;
                }
                if (bianUpArrayIndex !== null && bianDownArrayIndex !== null && code[0] == bianUpArrayIndex && code[1] == bianDownArrayIndex) {
                    foundBian = zy64guaData[i].name; foundBianImg = zy64guaData[i].img; foundBianRows = zy64guaData[i].rows;
                }
                if (foundImg && foundBianImg) break;
            }
        }

        // build display HTML (same style as before)
        var resultHtml = '<div style="padding:12px;background:#fff;color:#000;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2);max-width:900px;">';
        resultHtml += '<h3>梅花起卦 结果</h3>';
        resultHtml += '<div>公历年：' + di.year + '，干支：' + di.yearTG + '，地支序号：' + di.branchNumber + '</div>';
        resultHtml += '<div>农历月日：' + (('' + (di.lunarMonth)).padStart(2,'0')) + '-' + (('' + di.lunarDay).padStart(2,'0')) + '</div>';
        resultHtml += '<div>时辰：' + di.shichen + '（' + di.shichenNumber + '）　起卦时间：' + di.timeHMS + '</div>';
        resultHtml += '<div>上卦：' + upAlias + upGua + '（' + upIndex + '），下卦：' + downAlias + downGua + '（' + downIndex + '）</div>';
        resultHtml += '<div>动爻：第 ' + changeYao + ' 爻（总爻数6）</div>';
        resultHtml += '<div style="display:flex;gap:12px;margin-top:12px;align-items:flex-start;">';

        // left: 本卦
        resultHtml += '<div style="flex:1;text-align:center;">';
        resultHtml += '<div style="font-weight:700;margin-bottom:6px;">本卦：' + (upAlias + downAlias) + '（' + upGua + '+' + downGua + '）</div>';
        resultHtml += '<div style="text-align:left;margin-bottom:8px;">';
        if (foundRows && foundRows.length) {
            var highlightIndexTop = 6 - changeYao;
            for (var r = 5; r >= 0; r--) {
                var idxFromTop = 5 - r;
                var txt = foundRows[r] || '';
                if (idxFromTop === highlightIndexTop) resultHtml += '<div style="background:yellow;padding:4px;border-radius:4px;margin-bottom:2px;">' + txt + '</div>';
                else resultHtml += '<div style="padding:4px;border-radius:4px;margin-bottom:2px;">' + txt + '</div>';
            }
        } else resultHtml += '<div style="color:#999;">无爻辞数据</div>';
        resultHtml += '</div>';
        if (foundImg) resultHtml += '<img src="'+foundImg+'" alt="本卦" style="max-width:100%;height:auto;">';
        else resultHtml += '<div style="padding:40px;border:1px dashed #ccc;">无图片</div>';
        resultHtml += '</div>';

        // right: 变卦
        resultHtml += '<div style="flex:1;text-align:center;">';
        resultHtml += '<div style="font-weight:700;margin-bottom:6px;">变卦：' + bianAlias + '（' + (bianUpObj.name || '') + '+' + (bianDownObj.name || '') + '）</div>';
        resultHtml += '<div style="text-align:left;margin-bottom:8px;">';
        if (foundBianRows && foundBianRows.length) {
            var highlightIndexTopB = 6 - changeYao;
            for (var rb = 5; rb >= 0; rb--) {
                var idxFromTopB = 5 - rb;
                var txtb = foundBianRows[rb] || '';
                if (idxFromTopB === highlightIndexTopB) resultHtml += '<div style="background:yellow;padding:4px;border-radius:4px;margin-bottom:2px;">' + txtb + '</div>';
                else resultHtml += '<div style="padding:4px;border-radius:4px;margin-bottom:2px;">' + txtb + '</div>';
            }
        } else resultHtml += '<div style="color:#999;">无爻辞数据</div>';
        resultHtml += '</div>';
        if (foundBianImg) resultHtml += '<img src="'+foundBianImg+'" alt="变卦" style="max-width:100%;height:auto;">';
        else resultHtml += '<div style="padding:40px;border:1px dashed #ccc;">无图片</div>';
        resultHtml += '</div>';
        resultHtml += '</div>'; // end flex
        resultHtml += '</div>';

        var dataObj = {
            year: di.year,
            yearTG: di.yearTG,
            branchNumber: di.branchNumber,
            lunarMonth: di.lunarMonth,
            lunarDay: di.lunarDay,
            gregMonth: di.gregMonth,
            gregDay: di.gregDay,
            timeHMS: di.timeHMS,
            shichen: di.shichen,
            shichenNumber: di.shichenNumber,
            upIndex: upIndex,
            downIndex: downIndex,
            changeYao: changeYao,
            upName: upGua,
            downName: downGua,
            upAlias: upAlias,
            downAlias: downAlias,
            bianUpObj: bianUpObj,
            bianDownObj: bianDownObj,
            bianAlias: bianAlias,
            bianName: (bianUpObj && bianUpObj.name ? bianUpObj.name : '') + (bianDownObj && bianDownObj.name ? bianDownObj.name : ''),
            foundBen: foundBen,
            foundImg: foundImg,
            foundRows: foundRows,
            foundBian: foundBian,
            foundBianImg: foundBianImg,
            foundBianRows: foundBianRows,
            source: 'meihua'
        };

        try {
            localStorage.setItem('meihua_result', JSON.stringify(dataObj));
            window.location.href = 'meihua_result.html';
        } catch (e) {
            alert('无法保存结果到本地：' + e.message);
        }
    } catch (e) {
        alert('梅花起卦 发生错误: ' + e.message);
    }
}
*/

function computeMeihuaIndices(di, extra) {
    var base = di.branchNumber + di.lunarMonth + di.lunarDay;
    extra = Number(extra) || 0;
    var upIndex = (base + extra) % 8; if (upIndex == 0) upIndex = 8;
    var downIndex = (base + di.shichenNumber) % 8; if (downIndex == 0) downIndex = 8;
    var changeYao = (base + di.shichenNumber + extra) % 6; if (changeYao == 0) changeYao = 6;
    return { upIndex: upIndex, downIndex: downIndex, changeYao: changeYao };
}

function findGuaEntry(ord) {
    var orderToCode = ['111','011','101','001','110','010','100','000'];
    for (var ii = 0; ii < xt8guaData.length; ii++) {
        if (xt8guaData[ii].order == ord) return { index: ii, entry: xt8guaData[ii] };
    }
    var target = (typeof ord === 'number') ? orderToCode[ord - 1] : String(ord);
    for (var jj = 0; jj < xt8guaData.length; jj++) {
        if ((xt8guaData[jj].code || '') == target || (xt8guaData[jj].root || '') == target) return { index: jj, entry: xt8guaData[jj] };
    }
    return null;
}

function findGuaByRoot(root) {
    for (var jj = 0; jj < xt8guaData.length; jj++) {
        if ((xt8guaData[jj].root || '') == root || (xt8guaData[jj].code || '') == root) return { index: jj, entry: xt8guaData[jj] };
    }
    return null;
}

function buildMeihuaResult(di, upIndex, downIndex, changeYao, source) {
    var upFound = findGuaEntry(upIndex);
    var downFound = findGuaEntry(downIndex);
    var upObj = upFound ? upFound.entry : { name: ('卦' + upIndex), alias: '', code: '000' };
    var downObj = downFound ? downFound.entry : { name: ('卦' + downIndex), alias: '', code: '000' };
    var upGua = upObj.name;
    var downGua = downObj.name;
    var upAlias = upObj.alias || '';
    var downAlias = downObj.alias || '';
    var upArrayIndex = upFound ? upFound.index : (upIndex - 1);
    var downArrayIndex = downFound ? downFound.index : (downIndex - 1);
    var orderToCode = ['111','011','101','001','110','010','100','000'];
    var upRoot = upObj.code || upObj.root || orderToCode[upArrayIndex] || '000';
    var downRoot = downObj.code || downObj.root || orderToCode[downArrayIndex] || '000';
    var combined = (upRoot + downRoot).slice(0, 6);
    var flipIdx = 6 - changeYao;
    var arrBits = combined.split('');
    if (flipIdx >= 0 && flipIdx < arrBits.length) arrBits[flipIdx] = arrBits[flipIdx] === '0' ? '1' : '0';
    var newBinary = arrBits.join('');
    var bianUpRoot = newBinary.slice(0, 3);
    var bianDownRoot = newBinary.slice(3, 6);
    var bianUpFound = findGuaByRoot(bianUpRoot);
    var bianDownFound = findGuaByRoot(bianDownRoot);
    var bianUpObj = bianUpFound ? bianUpFound.entry : { name: ('卦'), alias: '', code: bianUpRoot };
    var bianDownObj = bianDownFound ? bianDownFound.entry : { name: ('卦'), alias: '', code: bianDownRoot };
    var bianAlias = (bianUpObj.alias || '') + (bianDownObj.alias || '');
    var bianUpArrayIndex = bianUpFound ? bianUpFound.index : null;
    var bianDownArrayIndex = bianDownFound ? bianDownFound.index : null;
    var foundBen = null, foundImg = null, foundRows = null;
    var foundBian = null, foundBianImg = null, foundBianRows = null;
    for (var i = 0; i < zy64guaData.length; i++) {
        var code = String(zy64guaData[i].code || '');
        if (code.length >= 2) {
            if (code[0] == upArrayIndex && code[1] == downArrayIndex) {
                foundBen = zy64guaData[i].name; foundImg = zy64guaData[i].img; foundRows = zy64guaData[i].rows;
            }
            if (bianUpArrayIndex !== null && bianDownArrayIndex !== null && code[0] == bianUpArrayIndex && code[1] == bianDownArrayIndex) {
                foundBian = zy64guaData[i].name; foundBianImg = zy64guaData[i].img; foundBianRows = zy64guaData[i].rows;
            }
            if (foundImg && foundBianImg) break;
        }
    }
    return {
        year: di.year,
        yearTG: di.yearTG,
        branchNumber: di.branchNumber,
        lunarMonth: di.lunarMonth,
        lunarDay: di.lunarDay,
        gregMonth: di.gregMonth,
        gregDay: di.gregDay,
        timeHMS: di.timeHMS,
        shichen: di.shichen,
        shichenNumber: di.shichenNumber,
        upIndex: upIndex,
        downIndex: downIndex,
        changeYao: changeYao,
        upName: upGua,
        downName: downGua,
        upAlias: upAlias,
        downAlias: downAlias,
        upCode: upRoot,
        downCode: downRoot,
        bianUpCode: bianUpRoot,
        bianDownCode: bianDownRoot,
        bianUpObj: bianUpObj,
        bianDownObj: bianDownObj,
        bianAlias: bianAlias,
        bianName: (bianUpObj && bianUpObj.name ? bianUpObj.name : '') + (bianDownObj && bianDownObj.name ? bianDownObj.name : ''),
        foundBen: foundBen,
        foundImg: foundImg,
        foundRows: foundRows,
        foundBian: foundBian,
        foundBianImg: foundBianImg,
        foundBianRows: foundBianRows,
        source: source
    };
}

function meihuaTianshi() {
    var now = new Date();
    var di = getDateInfo(now);
    /*var indices = computeMeihuaIndices(di, di.milliseconds);*/
    var indices = computeMeihuaIndices(di, 0);
    var dataObj = buildMeihuaResult(di, indices.upIndex, indices.downIndex, indices.changeYao, 'tianshi');
    try {
        localStorage.setItem('meihua_result', JSON.stringify(dataObj));
        window.location.href = 'meihua_result.html';
    } catch (e) {
        alert('无法保存结果到本地：' + e.message);
    }
}

function meihuaXinShiWithInput(input) {
    if (!input || input.trim().length === 0) {
        return meihuaTianshi();
    }
    var sum = 0;
    for (var i = 0; i < input.length; i++) {
        sum += input.charCodeAt(i);
    }
    var now = new Date();
    var di = getDateInfo(now);
    var indices = computeMeihuaIndices(di, sum);
    var dataObj = buildMeihuaResult(di, indices.upIndex, indices.downIndex, indices.changeYao, 'xinshi');
    try {
        localStorage.setItem('meihua_result', JSON.stringify(dataObj));
        window.location.href = 'meihua_result.html';
    } catch (e) {
        alert('无法保存结果到本地：' + e.message);
    }
}

function meihuaXinShi() {
    window.location.href = 'input.html';
}

function meihua() {
    return meihuaTianshi();
}
