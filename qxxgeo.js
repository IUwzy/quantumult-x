/**
 * 优化版 Quantumult X IP 查询脚本
 * 第一行：[国旗] 国家 IP
 * 第二行：保留原脚本信息（城市、运营商等）
 */

const url = "http://ip-api.com/json/?lang=zh-CN";

$task.fetch({ url: url }).then(response => {
    let obj = JSON.parse(response.body);
    let country = obj.country;
    let query = obj.query;
    let countryCode = obj.countryCode;
    let city = obj.city;
    let isp = obj.isp;
    
    // 将国家代码转换为国旗 Emoji
    let flag = countryCode.toUpperCase().replace(/./g, char => 
        String.fromCodePoint(char.charCodeAt(0) + 127397)
    );

    // 第一行：[国旗] 国家 IP
    let title = `${flag} ${country} ${query}`;
    
    // 第二行：保持原脚本逻辑（通常是 城市 - 运营商）
    let subtitle = `${city} - ${isp}`;
    
    // 弹窗正文（可选，显示更多细节）
    let description = `地区: ${obj.regionName}\n时区: ${obj.timezone}\n组织: ${obj.org}`;

    $notify(title, subtitle, description);
    $done();
}, reason => {
    $notify("IP 查询失败", "", reason.error);
    $done();
});
