// 状态检查
if (!$response || $response.statusCode != 200) {
  $done({});
}

// 基础校验函数
function City_ValidCheck(para) {
  return para ? para : "未知地区";
}

function Area_check(para) {
  return para === "中华民国" ? "台湾" : (para ? para : "未知国家");
}

// 国旗映射表 (你可以继续保留你原来的完整 Map，这里仅列出示例)
const flags = new Map([
  ["CN","🇨🇳"],["HK","🇭🇰"],["TW","🇨🇳"],["SG","🇸🇬"],["US","🇺🇸"],["JP","🇯🇵"],["KR","🇰🇷"]
  // ... 建议把你在原代码中那一大串 Map 粘贴回这里
]);

// 解析与显示逻辑
try {
  const obj = JSON.parse($response.body);
  const code = obj['countryCode'];
  
  // 自动获取/生成国旗 Emoji
  const emoji = flags.get(code) || (code ? code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397)) : "📍");
  
  const country = Area_check(obj['country']);
  const region = City_ValidCheck(obj['regionName']);
  const ipAddr = obj['query'] || "未知IP";
  const ispInfo = obj['isp'] || obj['org'] || "未知服务商";
  
  // 强制提取 AS 号 (从 "AS12345 Name" 提取 "AS12345")
  // 增加对字段大小写的兼容性处理
  let rawAs = obj['as'] || obj['asname'] || obj['isp'] || "";
  const asNumber = rawAs.toUpperCase().startsWith("AS") ? rawAs.split(' ')[0] : "AS " + rawAs.split(' ')[0];

  // --- 按照要求格式化 ---
  
  // 第一行：国旗 国家 IP
  const title = `${emoji} ${country}  ${ipAddr}`;
  
  // 第二行：AS号 地区 服务商
  const subtitle = `${asNumber}  ${region}  ${ispInfo}`;

  // 详细面板 (Description)
  const description = [
    '------------------------------',
    `🖥️ 服务商: ${ispInfo}`,
    `🌍 地区: ${region}`,
    `🗺️ IP地址: ${ipAddr} ${emoji}`,
    `🕗 时区: ${obj['timezone'] || "未知"}`,
    `📍 经纬度: ${obj['lon'] || "0"},${obj['lat'] || "0"}`,
    `🪙 货币: ${obj['currency'] || "未知"}`
  ].join('\n\n');

  // 返回结果给 QX
  $done({title, subtitle, ip: ipAddr, description});

} catch (e) {
  console.log("QXGeo Error: " + e);
  $done({title: "解析失败", subtitle: "请检查 API 响应数据"});
}
