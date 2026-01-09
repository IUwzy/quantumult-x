// 优化后的脚本：调整排版使 IP 视觉上更协调
if ($response.statusCode != 200) {
  $done(null);
}

var body = $response.body;
var obj = JSON.parse(body);

// --- 数据处理 ---
var countryName = Area_check(obj['country']);
var flag = flags.get(obj['countryCode']) || "";
var currSymbol = flags.get(obj['currency']) || "";

// --- 视觉优化方案 ---

// 第一行：只放 [国旗] 国家 城市 (保持标题精简)
var title = flag + " " + countryName + " · " + obj['city'];

// 第二行：放 IP 和 AS 信息 (第二行字体比第一行小，IP 看起来就不会那么突兀)
var subtitle = "IP: " + obj['query'] + "  (" + obj['as'] + ")";

// 这里的 ip 变量在某些 UI 插件中会显示，保持简洁
var ip = obj['query'];

var description = '------------------------------'+'\n'+'🖥️ 服务商: '+obj['isp'] + '\n'+'🌍 地区: ' +City_ValidCheck(obj['regionName'])+ '\n' + '🗺️ IP地址: '+ obj['query'] + '\n' +'🕗 时区: '+ obj['timezone']+'\n'+'📍 经纬度: '+obj['lon']+ ','+obj['lat']+'\n' +'🪙 货币: '+ obj['currency'] + " " + currSymbol;

$done({title, subtitle, ip, description});

// --- 原有函数保持不变 ---
function City_ValidCheck(para) {
  return para ? para : "高谭市";
}

function Area_check(para) {
  return para == "中华民国" ? "台湾" : para;
}
