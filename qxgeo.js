// 1. 状态检查
if (!$response || $response.statusCode != 200) {
  $done({});
}

// 2. 基础校验函数
function City_ValidCheck(para) {
  return para ? para : "未知地区";
}

function Area_check(para) {
  if(para === "中华民国") return "台湾";
  return para ? para : "未知国家";
}

// 3. 国旗映射表 (支持特殊修正)
const flags = new Map([
  ["CN","🇨🇳"],["HK","🇭🇰"],["TW","🇨🇳"],["SG","🇸🇬"],["US","🇺🇸"],["JP","🇯🇵"],["KR","🇰🇷"]
]);

// 4. 解析与显示逻辑
try {
  const obj = JSON.parse($response.body);
  const code = obj['countryCode'];
  
  // 自动获取/生成国旗 Emoji
  const emoji = flags.get(code) || (code ? code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397)) : "📍");
  
  const country = Area_check(obj['country']);
  const region = City_ValidCheck(obj['regionName']);
  const ipAddr = obj['query'] || "Unknown IP";
  const ispInfo = obj['isp'] || "Unknown ISP";
  
  // 提取 AS 号 (从 "AS12345 Name" 中提取 "AS12345")
  const asFull = obj['as'] ? obj['as'].split(' ')[0] : "AS00000";

  // --- 按照要求格式化（已移除云朵符号） ---
  
  // 第一行：国旗 国家 IP
  const title = `${emoji} ${country}  ${ipAddr}`;
  
  // 第二行：AS号 地区 服务商
  const subtitle = `${asFull}  ${region}  ${ispInfo}`;

  // 详细面板 (Description)
  const description = [
    '------------------------------',
    `🖥️ 服务商: ${ispInfo}`,
    `🌍 地区: ${region}`,
    `🗺️ IP地址: ${ipAddr} ${emoji}`,
    `🕗 时区: ${obj['timezone'] || "Unknown"}`,
    `📍 经纬度: ${obj['lon'] || "0"},${obj['lat'] || "0"}`,
    `🪙 货币: ${obj['currency'] || "Unknown"}`
  ].join('\n\n');

  // 5. 返回结果
  $done({title, subtitle, ip: ipAddr, description});

} catch (e) {
  console.log("QXGeo Error: " + e);
  $done({title: "解析失败", subtitle: "请检查 API 响应"});
}
