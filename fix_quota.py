# fix_quota.py
# 執行方式: python fix_quota.py
# 修復 localStorage QuotaExceededError:
#   1. 注入 safeSetItem 防爆保護
#   2. addToHistory 改存 URL（不存 base64）
#   3. 限制歷史記錄最多 200 筆
#   4. imgSrc 改用 url 欄位

import re

print("📖 讀取 worker.js...")
with open('worker.js', 'r', encoding='utf-8') as f:
    content = f.read()

original_size = len(content)
print(f"   原始大小: {original_size/1024:.1f} KB")

# ============================================================
# 修改 1: 注入 safeSetItem localStorage 防爆保護
# ============================================================
MARKER = '// ====== IndexedDB 管理核心 (解決死圖) ======'

SAFE_BLOCK = '''// ====== localStorage QuotaExceededError 防護 ======
(function(){
    const _orig = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        try {
            _orig.call(this, key, value);
        } catch(e) {
            if(e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
                console.warn('\\u26a0\\ufe0f localStorage quota exceeded for key:', key);
                try {
                    let maxKey = '', maxSize = 0;
                    for(let k of Object.keys(this)){
                        const s = (this.getItem(k)||'').length;
                        if(s > maxSize){ maxSize = s; maxKey = k; }
                    }
                    if(maxKey && maxKey !== key) {
                        this.removeItem(maxKey);
                        console.warn('\\ud83d\\uddd1\\ufe0f Removed largest key:', maxKey, '(' + (maxSize/1024).toFixed(1) + 'KB)');
                    }
                    _orig.call(this, key, value);
                } catch(e2) { console.error('localStorage setItem failed after cleanup:', e2); }
            } else { throw e; }
        }
    };
})();

'''

if MARKER in content:
    content = content.replace(MARKER, SAFE_BLOCK + MARKER)
    print("✅ 修改 1: safeSetItem 防護已注入")
else:
    print("❌ 修改 1: 找不到 IndexedDB 標記，跳過")

# ============================================================
# 修改 2: addToHistory 改存 URL，限制 200 筆
# ============================================================
OLD_ADD = (
    'async function addToHistory(item){\r\n'
    '    let base64Data = item.image;\r\n'
    '    if(!base64Data && item.url){\r\n'
    '        try{\r\n'
    '            const resp = await fetch(item.url);\r\n'
    '            const blob = await resp.blob();\r\n'
    '            base64Data = await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(blob);});\r\n'
    '        }catch(e){console.error("Image convert failed",e);}\r\n'
    '    }\r\n'
    '    const record={\r\n'
    '        id: Date.now()+Math.random(), timestamp: new Date().toISOString(), prompt: item.prompt, model: item.model, style: item.style, seed: item.seed, base64: base64Data || item.url\r\n'
    '    };\r\n'
    '    await saveToDB(record);\r\n'
    '}'
)

NEW_ADD = (
    'async function addToHistory(item){\r\n'
    '    // \u2705 \u53ea\u5b58 URL\uff0c\u4e0d\u8f49 base64\uff08\u9632\u6b62 QuotaExceededError\uff09\r\n'
    '    const record={\r\n'
    '        id: Date.now()+Math.random(),\r\n'
    '        timestamp: new Date().toISOString(),\r\n'
    '        prompt: item.prompt,\r\n'
    '        model: item.model,\r\n'
    '        style: item.style,\r\n'
    '        seed: item.seed,\r\n'
    '        url: item.url || item.image || \'\',\r\n'
    '        width: item.width || 1024,\r\n'
    '        height: item.height || 1024\r\n'
    '    };\r\n'
    '    // \u2705 \u9650\u5236\u6700\u591a 200 \u7b46\uff0c\u81ea\u52d5\u522a\u9664\u6700\u820a\r\n'
    '    const MAX_RECORDS = 200;\r\n'
    '    try {\r\n'
    '        const all = await getHistoryFromDB();\r\n'
    '        if(all.length >= MAX_RECORDS){\r\n'
    '            const oldest = all[all.length-1];\r\n'
    '            if(oldest && oldest.id) await deleteFromDB(oldest.id);\r\n'
    '        }\r\n'
    '    } catch(e){ console.warn(\'History cleanup failed:\', e); }\r\n'
    '    await saveToDB(record);\r\n'
    '}'
)

if OLD_ADD in content:
    content = content.replace(OLD_ADD, NEW_ADD)
    print("✅ 修改 2: addToHistory 已改為只存 URL + 限制 200 筆")
else:
    print("❌ 修改 2: 找不到 addToHistory 原始內容，跳過")
    print("   提示：可能是 CRLF/LF 換行符不一致，請確認 worker.js 使用 CRLF")

# ============================================================
# 修改 3: imgSrc 改用 url 欄位
# ============================================================
OLD_IMGSRC = "        const imgSrc = item.base64 || item.url;"
NEW_IMGSRC = "        const imgSrc = item.url || item.base64 || '';"

if OLD_IMGSRC in content:
    content = content.replace(OLD_IMGSRC, NEW_IMGSRC)
    print("✅ 修改 3: imgSrc 已改用 url 欄位")
else:
    print("❌ 修改 3: 找不到 imgSrc 原始內容，跳過")

# ============================================================
# 寫回檔案
# ============================================================
print("\n💾 寫回 worker.js...")
with open('worker.js', 'w', encoding='utf-8') as f:
    f.write(content)

new_size = len(content)
print(f"   新大小: {new_size/1024:.1f} KB (差異: +{(new_size-original_size)} bytes)")

# ============================================================
# 驗證
# ============================================================
print("\n🔍 驗證修改結果:")
checks = [
    ("safeSetItem 防護",        'QuotaExceededError 防護' in content),
    ("addToHistory 只存 URL",   '只存 URL，不轉 base64' in content),
    ("MAX_RECORDS = 200",       'MAX_RECORDS = 200' in content),
    ("imgSrc 使用 url 優先",    "item.url || item.base64 || ''" in content),
    ("無舊版 base64 fetch",     'readAsDataURL(blob)' not in content),
]
all_ok = True
for name, ok in checks:
    print(f"  {'✅' if ok else '❌'} {name}")
    if not ok:
        all_ok = False

if all_ok:
    print("\n🎉 全部修改成功！請執行:")
    print("   git add worker.js")
    print("   git commit -m 'fix: 修復 localStorage QuotaExceededError'")
    print("   git push")
else:
    print("\n⚠️  部分修改失敗，請檢查上方錯誤訊息")
