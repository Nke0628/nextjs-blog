# フロントエンドとバックエンド分離時代の認証設計パターン

## はじめに

最近のWebアプリケーション開発では、フロントエンドにReactやVue.js、Next.jsなどを採用し、バックエンドと完全に分離した構成が主流となっています。この構成における認証方式の選択は、セキュリティとユーザビリティの両面で重要な決定事項です。

本記事では、**セッション認証**と**トークン認証**のどちらを選ぶべきか、デプロイ環境やドメイン構成に応じた最適な実装パターンを、具体例を交えて解説します。

## 前提：認証機能は自作しない

まず大前提として、認証機能自体は自身で実装すべきではありません。セキュリティの観点から、以下のような実績のあるソリューションを利用することを強く推奨します：

- **フレームワーク提供の認証機能**
  - Laravel Sanctum / Breeze
  - Django REST Framework
  - Next.js + NextAuth.js
- **IDaaS（Identity as a Service）**
  - Auth0
  - Firebase Authentication
  - AWS Cognito
  - Supabase Auth

これらを利用した上で、適切な認証パターンを選択することが重要です。

## 認証方式の基本

### セッション認証（Cookie-Based Authentication）

サーバー側でセッション情報を保持し、クライアントにはセッションIDをCookieで保存する方式です。

**メリット**
- サーバー側でセッションを管理できる（強制ログアウトが容易）
- トークンの漏洩リスクが比較的低い
- 設定次第でCSRF対策が容易

**デメリット**
- サーバー側のセッションストレージが必要
- スケーリング時にセッション共有の仕組みが必要
- クロスドメインでの実装が複雑

### トークン認証（Token-Based Authentication）

サーバーが発行したトークン（JWTなど）をクライアント側で保持し、リクエストヘッダーに付与する方式です。

**メリット**
- ステートレスなため、サーバーのスケーリングが容易
- クロスドメインでの実装がシンプル
- モバイルアプリとの連携が容易

**デメリット**
- トークンの無効化が困難（有効期限切れまで待つ必要）
- トークンの保存場所に注意が必要（XSS対策）
- トークンサイズが大きくなりがち

## 実装パターン別ガイド

### パターン1: 同一ドメイン・サブドメイン構成でのセッション認証 ⭐推奨

**適用ケース**
- フロントエンド: `https://example.com`
- バックエンド: `https://api.example.com`
- Laravel等のフレームワークのViewテンプレート内でReact/Vueを使用

**Cookie設定**
```javascript
// Express.js の例
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,      // JavaScriptからアクセス不可（XSS対策）
    secure: true,        // HTTPS必須
    sameSite: 'lax',     // CSRF対策（同一サイト間のみ送信）
    domain: '.example.com', // サブドメイン間で共有
    maxAge: 24 * 60 * 60 * 1000 // 24時間
  }
}));
```

**CSRF対策**
`SameSite=Lax`により、外部サイトからのPOSTリクエストにはCookieが送信されないため、基本的なCSRF攻撃を防げます。

**Next.js での実装例**
```typescript
// pages/api/auth/login.ts
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const { username, password } = await req.body;

    // 認証処理（実際はNextAuth.jsなどを使用）
    const user = await authenticate(username, password);

    if (user) {
      req.session.user = {
        id: user.id,
        email: user.email,
      };
      await req.session.save();
      res.json({ user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  },
  {
    cookieName: 'myapp_session',
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  }
);
```

**フロントエンド（Next.js）**
```typescript
// pages/dashboard.tsx
import { withIronSessionSsr } from 'iron-session/next';

export const getServerSideProps = withIronSessionSsr(
  async function ({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: { user },
    };
  },
  {
    cookieName: 'myapp_session',
    password: process.env.SESSION_SECRET,
  }
);

export default function Dashboard({ user }) {
  return <div>Welcome, {user.email}!</div>;
}
```

---

### パターン2: 別ドメイン構成でのセッション認証（非推奨だが実現可能）

**適用ケース**
- フロントエンド: `https://frontend.vercel.app` (Vercel)
- バックエンド: `https://backend.render.com` (Render)
- ドメインを統一できない環境

**Cookie設定**
```javascript
// Express.js の例
app.use(cors({
  origin: 'https://frontend.vercel.app',
  credentials: true  // 重要: Cookie送信を許可
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',  // ⚠️ クロスサイトでもCookie送信を許可
    maxAge: 24 * 60 * 60 * 1000
  }
}));
```

**CSRF対策が必須**
`SameSite=None`とすることで、外部サイトからのリクエストにもCookieが送信されるため、CSRFトークンによる対策が必要です。

```javascript
// CSRF対策ミドルウェア（csurf利用）
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: { sameSite: 'none', secure: true } });

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post('/api/login', csrfProtection, (req, res) => {
  // ログイン処理
});
```

**フロントエンド（React）**
```typescript
// CSRFトークンを取得してログイン
async function login(username: string, password: string) {
  // 1. CSRFトークン取得
  const csrfRes = await fetch('https://backend.render.com/api/csrf-token', {
    credentials: 'include'  // Cookie送信を有効化
  });
  const { csrfToken } = await csrfRes.json();

  // 2. ログインリクエスト
  const loginRes = await fetch('https://backend.render.com/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': csrfToken  // CSRFトークンをヘッダーに含める
    },
    credentials: 'include',  // Cookie送信を有効化
    body: JSON.stringify({ username, password })
  });

  return loginRes.json();
}
```

**⚠️ 注意点**
- `SameSite=None`はセキュリティリスクが高まるため、可能な限りドメインを統一すべき
- ブラウザのサードパーティCookie制限により、将来的に動作しなくなる可能性あり

---

### パターン3: トークン認証（JWT） ⭐別ドメイン構成で推奨

**適用ケース**
- フロントエンドとバックエンドが完全分離
- 他システムへのAPI提供も視野に入れる
- モバイルアプリとの連携が必要

**バックエンド実装（Express.js + JWT）**
```javascript
const jwt = require('jsonwebtoken');

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await authenticate(username, password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // アクセストークン（短い有効期限）
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  // リフレッシュトークン（長い有効期限）
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // リフレッシュトークンはDBに保存（無効化のため）
  await saveRefreshToken(user.id, refreshToken);

  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email }
  });
});

// 認証ミドルウェア
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 保護されたエンドポイント
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

**フロントエンド（React + Context API）**
```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // ローカルストレージからトークン復元（初回ロード時）
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      // トークンの有効性を検証
      fetchProfile(storedToken).then(setUser).catch(() => {
        // トークンが無効な場合はリフレッシュトークンで更新
        refreshAccessToken();
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch('https://api.example.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const { accessToken, refreshToken, user } = await res.json();

    // アクセストークンはメモリに保持（XSS対策）
    setAccessToken(accessToken);

    // リフレッシュトークンはlocalStorageに保存
    // ※ より安全にはhttpOnlyなCookieで管理することも検討
    localStorage.setItem('refreshToken', refreshToken);

    setUser(user);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// カスタムフック
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**APIリクエスト時の認証ヘッダー付与（Axios Interceptor）**
```typescript
// utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
});

// リクエストインターセプター（トークンを自動付与）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンスインターセプター（401エラー時にトークンリフレッシュ）
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post('https://api.example.com/api/refresh', {
          refreshToken
        });

        const { accessToken } = res.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // リフレッシュトークンも無効な場合はログアウト
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

**CSRF対策について**
トークン認証では、独自ヘッダー（`Authorization`）を使用するため、**ブラウザのSame-Origin Policyにより、外部サイトからはこのヘッダーを付与できません**。そのため、基本的にCSRF攻撃のリスクは低くなります。

---

## Cookie属性の詳細解説

### Domain属性
Cookieを送信する対象ドメインを指定します。

```javascript
// .example.com を指定すると、以下のドメイン全てでCookieが送信される
// - example.com
// - www.example.com
// - api.example.com
// - sub.api.example.com
cookie: {
  domain: '.example.com'
}
```

**注意点**
- 設定しない場合、Cookieを設定したドメインのみが対象（サブドメイン含まず）
- セキュリティ上、必要最小限のスコープに限定すべき

### SameSite属性
Cookie送信時の送信元制限を設定します。

| 値 | 動作 | 用途 |
|---|---|---|
| `Strict` | 同一サイトからのリクエストのみCookieを送信 | 最も厳格（外部サイトのリンククリック時も送信されない） |
| `Lax`（デフォルト） | 同一サイト + トップレベルナビゲーション（GET）では送信 | **推奨**。基本的なCSRF対策が可能 |
| `None` | クロスサイトでも送信（`Secure`必須） | クロスドメイン認証で必要だが、セキュリティリスク高 |

**具体例**
```html
<!-- A サイト (attacker.com) -->
<a href="https://bank.com/transfer?to=attacker&amount=1000">
  お得な情報はこちら
</a>
```

| SameSite | Cookieは送信される？ | 結果 |
|---|---|---|
| `Strict` | ❌ 送信されない | 安全（ログアウト状態で遷移） |
| `Lax` | ✅ 送信される（GETのため） | 比較的安全（GETは副作用なしが前提） |
| `None` | ✅ 送信される | ⚠️ CSRF対策が必要 |

**POSTリクエストの場合（フォーム送信）**
```html
<!-- A サイト (attacker.com) -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker" />
  <input type="hidden" name="amount" value="1000" />
  <button>今すぐ申し込む</button>
</form>
```

| SameSite | Cookieは送信される？ | 結果 |
|---|---|---|
| `Strict` | ❌ 送信されない | 安全 |
| `Lax` | ❌ 送信されない | 安全 |
| `None` | ✅ 送信される | ⚠️ **CSRF攻撃成立** |

### HttpOnly属性
JavaScriptから`document.cookie`でCookieにアクセスできなくなります（XSS対策）。

```javascript
cookie: {
  httpOnly: true  // 必須！
}
```

### Secure属性
HTTPS通信でのみCookieを送信します。

```javascript
cookie: {
  secure: process.env.NODE_ENV === 'production'  // 本番環境では必須
}
```

---

## まとめ：どの認証方式を選ぶべきか？

### 推奨パターン

| デプロイ構成 | 推奨認証方式 | 理由 |
|---|---|---|
| **同一ドメイン・サブドメイン** | セッション認証（SameSite=Lax） | シンプルで安全、CSRF対策が容易 |
| **完全別ドメイン** | **トークン認証（JWT）** | クロスドメインでも安全、将来性あり |
| **モノリシック（Laravel等のView）** | セッション認証（SameSite=Lax） | フレームワークの標準機能を活用 |
| **外部API提供** | トークン認証（JWT） | ステートレス、スケーラブル |

### セキュリティチェックリスト

**セッション認証の場合**
- ✅ `httpOnly: true` を設定
- ✅ `secure: true` を本番環境で設定
- ✅ `sameSite: 'lax'` を設定（別ドメインなら`'none'`＋CSRF対策）
- ✅ セッションの有効期限を適切に設定
- ✅ セッションIDを定期的に再生成（セッション固定攻撃対策）

**トークン認証の場合**
- ✅ アクセストークンの有効期限を短く（15分〜1時間）
- ✅ リフレッシュトークンで自動更新の仕組みを実装
- ✅ トークンをlocalStorageに保存する場合はXSSリスクを認識
- ✅ 重要な操作では再認証を要求
- ✅ トークンのブラックリスト化の仕組みを検討

### ドメイン統一を検討すべき理由

別ドメイン構成での`SameSite=None`は、以下の理由から避けるべきです：

1. **ブラウザのサードパーティCookie廃止の流れ**
   - Chrome、Safari、Firefoxなどが段階的に制限を強化中
   - 将来的に動作しなくなる可能性が高い

2. **CSRF攻撃のリスク増大**
   - 追加の対策が必要でコードが複雑化

3. **パフォーマンス**
   - Preflight（OPTIONS）リクエストが増える

**推奨される解決策**
- Vercelでカスタムドメイン設定: `app.example.com`
- バックエンドをサブドメインに: `api.example.com`
- または、完全にトークン認証へ移行

---

## 参考資料

- [OWASP - Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN - SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [JWT.io - JSON Web Tokens Introduction](https://jwt.io/introduction)
- [OWASP - Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

## おわりに

認証方式の選択は、セキュリティとユーザビリティ、そして運用のしやすさのバランスを考慮して行う必要があります。本記事で紹介したパターンを参考に、プロジェクトの要件に最適な実装を選択してください。

また、認証は常に進化する分野です。最新のセキュリティベストプラクティスを定期的にキャッチアップし、既存システムのアップデートも怠らないようにしましょう。
