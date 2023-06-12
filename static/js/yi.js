document.write("<script src='./static/js/data.js'></script>")

// 先天八卦
var xt8guaData = [
    {name: "乾", alias: "天",},       // 0
    {name: "坤", alias: "地",},       // 1

    {name: "兑", alias: "泽",},       // 2
    {name: "艮", alias: "山",},       // 3

    {name: "巺", alias: "风",},       // 4
    {name: "震", alias: "雷",},       // 5

    {name: "离", alias: "火",},       // 6
    {name: "坎", alias: "水",}        // 7
]

// 初始八卦状态:先天八卦
var status = 0

window.onload = function() {
    xt8gua()
    zy64gua()
}


// 遍历先天八卦
function xt8gua() {
    var xt8guaHTML = ""
    for (var i = 0; i < xt8guaData.length; i++) {
        xt8guaHTML += gua(xt8guaData[i]['name'], xt8guaData[i]['code'], xt8guaData[i]['pstxt'], xt8guaData[i]['pstcn'], xt8guaData[i]['tag'])
    }

    document.getElementById("xt8gua").innerHTML = xt8guaHTML
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
    var i = 0; 
    var j = 0; 
    var yaoxia = [];
    var yaoshang = [];
    for (; i < 3; i++)
    {
        var num = Math.round(Math.random()*10);

        if(num % 2 == 0)
        {
            yaoxia.push(1);
        }else{
            yaoxia.push(0);
         }
    }
    for (; j < 3; j++)
    {
        var num = Math.round(Math.random()*10);

        if(num % 2 == 0)
        {
            yaoshang.push(1);
        }else{
            yaoshang.push(0);
         }
    }
    var sxia=yaoxia.join("");
    var sshang=yaoshang.join("");

    var xiagua = parseInt(sxia,2);
    var shanggua = parseInt(sshang,2);

    var finalgua = xiagua * 10 + shanggua

    for (var i = 0; i < zy64guaData.length; i++) {
        var code = zy64guaData[i]['code']
        var codenum = parseInt(code);
        if(finalgua == codenum)
        {
             window.alert(zy64guaData[i]['name']);
             window.alert(zy64guaData[i]['desc']);
             window.alert(zy64guaData[i].rows[0]);
             window.alert(zy64guaData[i].rows[1]);
             window.alert(zy64guaData[i].rows[2]);
             window.alert(zy64guaData[i].rows[3]);
             window.alert(zy64guaData[i].rows[4]);
             window.alert(zy64guaData[i].rows[5]);
             window.location.href=zy64guaData[i]['img'];
             break;
         }
    }
}
// 文王拘而演周易
function xtToHt() {
    if (status == 0) { // 切换到后天八卦
        status = 1
        document.getElementById("yantitle").innerText = "后天八卦"
        document.getElementById("yanbtn").innerText = "<-"

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
        document.getElementById("yantitle").innerText = "先天八卦"
        document.getElementById("yanbtn").innerText = "->"

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
        var finalCode = xt8guaData[code[0]]['code'] + xt8guaData[code[1]]['code']

        html += gua64(zy64guaData[i]['name'], finalCode, zy64guaData[i]['rows'], zy64guaData[i]['img'])
    }

    document.getElementById("zy64gua").innerHTML = html
}

// 生成六爻
function gua64(name, code, rows, imgsrc) {
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

    html += "<label class='name64'><a href='"+imgsrc+"'>" + name + "</a></label>"+
            "</div>"

    return html
}