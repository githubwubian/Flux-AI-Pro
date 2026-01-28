// =================================================================================
//  項目: Flux AI Pro - Admin Auth Utilities
//  功能: 密碼哈希、JWT Token 生成與驗證
//  版本: 1.0.0
// =================================================================================

/**
 * 密碼哈希（使用 Web Crypto API - PBKDF2）
 */
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // 生成鹽值
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // 使用 PBKDF2 哈希
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        data,
        'PBKDF2',
        false,
        ['deriveBits']
    );
    
    const hash = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );
    
    // 組合鹽值和哈希值
    const combined = new Uint8Array(salt.length + hash.length / 8);
    combined.set(salt, 0);
    combined.set(new Uint8Array(hash), salt.length);
    
    // 轉換為 base64 儲存
    const base64Hash = btoa(String.fromCharCode(...combined));
    
    // 返回 bcrypt 格式（相容性）
    return `$2a$12$${base64Hash.substring(0, 22)}${base64Hash.substring(22)}`;
}

/**
 * 驗證密碼
 */
export async function verifyPassword(password, hash) {
    try {
        // 簡化的密碼驗證（實際實現建議使用專用庫）
        // 這裡使用基本的比較邏輯
        const passwordHash = await simpleHash(password);
        return passwordHash === hash;
    } catch (error) {
        console.error('Password verification error:', error);
        return false;
    }
}

/**
 * 簡單哈希函數（備用）
 */
async function simpleHash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'flux-salt-key-2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * 生成 JWT Token
 */
export async function generateToken(payload, secret, expiresIn = '7d') {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
        ...payload,
        iat: now,
        exp: now + (expiresIn === '7d' ? 7 * 24 * 60 * 60 : 24 * 60 * 60)
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    
    const signature = await hmacSha256(signInput => signatureInput, secret);
    const encodedSignature = base64UrlEncode(signature);

    return `${signatureInput}.${encodedSignature}`;
}

/**
 * 驗證 JWT Token
 */
export async function verifyToken(token, secret) {
    try {
        const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
        
        if (!encodedHeader || !encodedPayload || !encodedSignature) {
            throw new Error('Invalid token format');
        }

        // 驗證簽名
        const signatureInput = `${encodedHeader}.${encodedPayload}`;
        const expectedSignature = await hmacSha256(signInput => signatureInput, secret);
        const encodedExpectedSignature = base64UrlEncode(expectedSignature);

        if (encodedSignature !== encodedExpectedSignature) {
            throw new Error('Invalid signature');
        }

        // 解析 payload
        const payload = JSON.parse(base64UrlDecode(encodedPayload));
        
        // 檢查過期時間
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            throw new Error('Token expired');
        }

        return payload;
    } catch (error) {
        throw new Error('Token verification failed');
    }
}

/**
 * HMAC SHA256 簽名
 */
async function hmacSha256(message, secret) {
    const encoder = new TextEncoder();
    const key = encoder.encode(secret);
    const msg = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, msg);
    return new Uint8Array(signature);
}

/**
 * Base64URL 編碼
 */
function base64UrlEncode(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Base64URL 解碼
 */
function base64UrlDecode(str) {
    str = str
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    
    while (str.length % 4) {
        str += '=';
    }
    
    return atob(str);
}

/**
 * 從請求中提取 token
 */
export function extractTokenFromRequest(request) {
    // 從 Authorization header 獲取
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    // 從 cookie 獲取
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(c => c.trim());
        const tokenCookie = cookies.find(c => c.startsWith('admin_token='));
        if (tokenCookie) {
            return tokenCookie.substring('admin_token='.length);
        }
    }

    // 從 URL 參數獲取
    const url = new URL(request.url);
    return url.searchParams.get('token');
}

/**
 * 檢查 IP 是否在黑名單中
 */
export async function checkIpBlacklist(ipAddress, db) {
    try {
        const result = await db.prepare(`
            SELECT * FROM ip_lists 
            WHERE ip_address = ? 
            AND type = 'blacklist' 
            AND is_active = 1
            AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
        `).bind(ipAddress).first();

        return !!result;
    } catch (error) {
        console.error('IP blacklist check error:', error);
        return false;
    }
}

/**
 * 檢查 IP 是否在白名單中
 */
export async function checkIpWhitelist(ipAddress, db) {
    try {
        const result = await db.prepare(`
            SELECT * FROM ip_lists 
            WHERE ip_address = ? 
            AND type = 'whitelist' 
            AND is_active = 1
            AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
        `).bind(ipAddress).first();

        return !!result;
    } catch (error) {
        console.error('IP whitelist check error:', error);
        return false;
    }
}

/**
 * IP 白名單模式：是否只允許白名單 IP
 */
export async function isWhitelistMode(db) {
    try {
        const result = await db.prepare(`
            SELECT config_value FROM system_config 
            WHERE config_key = 'whitelist_mode_enabled'
        `).first();

        return result?.config_value === 'true';
    } catch (error) {
        return false;
    }
}