# fix_quota.py
# 執行方式: python fix_quota.py
# 修復 localStorage QuotaExceededError
#
# 修復內容:
#   1. 還原 worker.js（如果已損壞）
#   2. 注入 safeSetItem 防爆保護
#   3. addToHistory 改存 URL（不存 base64）
#   4. generate 流程傳入 res.url 到 addToHistory
#   5. 限制歷史記錄最多 200 筆
#   6. imgSrc 改用 url 欄位

import subprocess, sys, os

# ============================================================
# Step 0: 如果 worker.js 已損壞，先還原
# ============================================================
GOOD_SHA = '8c9a42d08a5b32e5db549311c99f0310c51e7eda'

with open('worker.js', 'r', encoding='utf-8') as f:
    current = f.read()

if len(current) < 10000:
    print(f'⚠️  worker.js 已損壞 ({len(current)} bytes)，正在從 Git 历史還原...')
    result = subprocess.run(
        ['git', 'show', f'{GOOD_SHA}:worker.js'],
        capture_output=True
    )
    if result.returncode != 0:
        print('❌ 無法從 git show 還原，嘗試其他方式...')
        # Try git restore
        result2 = subprocess.run(
            ['git', 'restore', '--source', GOOD_SHA, 'worker.js'],
            capture_output=True
        )
        if result2.returncode != 0:
            print(f'❌ 還原失敗: {result2.stderr.decode()}')
            print('請手動執行: git show 8c9a42d08a5b32e5db549311c99f0310c51e7eda:worker.js > worker.js')
            sys.exit(1)
        with open('worker.js', 'r', encoding='utf-8') as f:
            current = f.read()
    else:
        current = result.stdout.decode('utf-8', errors='replace')
        with open('worker.js', 'w', encoding='utf-8') as f:
            f.write(current)
    print(f'✅ 還原完成，大小: {len(current)/1024:.1f} KB')
else:
    print(f'✅ worker.js 正常，大小: {len(current)/1024:.1f} KB')

print('')
content = current
original_size = len(content)

# ============================================================
# 修改 1: 注入 safeSetItem localStorage 防爆保護
# ============================================================
MARKER = '// ====== IndexedDB 管理核心 (解決死圖) ======'

SAFE_BLOCK = """// ====== localStorage QuotaExceededError \u9632\u8b77 ======
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

"""

if MARKER in content:
    content = content.replace(MARKER, SAFE_BLOCK + MARKER)
    print('✅ 修改 1: safeSetItem 防護已注入')
else:
    print('❌ 修改 1: 找不到 IndexedDB 標記，跳過')

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
    "        url: item.url || item.image || '',\r\n"
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
    "    } catch(e){ console.warn('History cleanup failed:', e); }\r\n"
    '    await saveToDB(record);\r\n'
    '}'
)

# Also try LF-only version
OLD_ADD_LF = OLD_ADD.replace('\r\n', '\n')
NEW_ADD_LF = NEW_ADD.replace('\r\n', '\n')

if OLD_ADD in content:
    content = content.replace(OLD_ADD, NEW_ADD)
    print('✅ 修改 2: addToHistory 已改為只存 URL + 限制 200 筆 (CRLF)')
elif OLD_ADD_LF in content:
    content = content.replace(OLD_ADD_LF, NEW_ADD_LF)
    print('✅ 修改 2: addToHistory 已改為只存 URL + 限制 200 筆 (LF)')
else:
    print('❌ 修改 2: 找不到 addToHistory 原始內容，跳過')

# ============================================================
# 修改 3: generate 流程傳入 res.url 到 addToHistory
# ============================================================
OLD_GEN = (
    '                let base64=reader.result;\r\n'
    "                const realSeed = res.headers.get('X-Seed');\r\n"
    "                const item={ image:base64, prompt, model:res.headers.get('X-Model'), seed: realSeed, style:res.headers.get('X-Style') };\r\n"
    '                await addToHistory(item);'
)
NEW_GEN = (
    '                let base64=reader.result;\r\n'
    "                const realSeed = res.headers.get('X-Seed');\r\n"
    "                const item={ image:base64, url: res.url||'', prompt, model:res.headers.get('X-Model'), seed: realSeed, style:res.headers.get('X-Style') };\r\n"
    '                await addToHistory(item); // addToHistory \u53ea\u5b58 item.url\uff0c\u4e0d\u5b58 base64'
)

OLD_GEN_LF = OLD_GEN.replace('\r\n', '\n')
NEW_GEN_LF = NEW_GEN.replace('\r\n', '\n')

if OLD_GEN in content:
    content = content.replace(OLD_GEN, NEW_GEN)
    print('✅ 修改 3: generate 流程已加入 res.url (CRLF)')
elif OLD_GEN_LF in content:
    content = content.replace(OLD_GEN_LF, NEW_GEN_LF)
    print('✅ 修改 3: generate 流程已加入 res.url (LF)')
else:
    print('❌ 修改 3: 找不到 generate 流程原始內容，跳過')

# ============================================================
# 修改 4: imgSrc 改用 url 欄位
# ============================================================
OLD_IMGSRC = "        const imgSrc = item.base64 || item.url;"
NEW_IMGSRC = "        const imgSrc = item.url || item.base64 || '';"

if OLD_IMGSRC in content:
    content = content.replace(OLD_IMGSRC, NEW_IMGSRC)
    print('✅ 修改 4: imgSrc 已改用 url 欄位')
else:
    print('❌ 修改 4: 找不到 imgSrc 原始內容，跳過')

# ============================================================
# 寫回檔案
# ============================================================
print('\n💾 寫回 worker.js...')
with open('worker.js', 'w', encoding='utf-8') as f:
    f.write(content)

new_size = len(content)
print(f'   新大小: {new_size/1024:.1f} KB (差異: +{new_size - original_size} bytes)')

# ============================================================
# 驗證
# ============================================================
print('\n🔍 驗證修改結果:')
checks = [
    ('safeSetItem 防護',        'QuotaExceededError \u9632\u8b77' in content),
    ('addToHistory \u53ea\u5b58 URL', '\u53ea\u5b58 URL\uff0c\u4e0d\u8f49 base64' in content),
    ('MAX_RECORDS = 200',        'MAX_RECORDS = 200' in content),
    ('generate 傳入 res.url',    "url: res.url||''" in content),
    ('imgSrc url \u512a\u5148',       "item.url || item.base64 || ''" in content),
]
all_ok = True
for name, ok in checks:
    print(f"  {'\u2705' if ok else '\u274c'} {name}")
    if not ok:
        all_ok = False

if all_ok:
    print('\n\U0001f389 \u5168\u90e8\u4fee\u6539\u6210\u529f\uff01\u8acb\u57f7\u884c:')
    print('   git add worker.js')
    print("   git commit -m 'fix: \u4fee\u5fa9 localStorage QuotaExceededError'")
    print('   git push')
else:
    print('\n\u26a0\ufe0f  \u90e8\u5206\u4fee\u6539\u5931\u6557\uff0c\u8acb\u6aa2\u67e5\u4e0a\u65b9\u932f\u8aa4\u8a0a\u606f')
