# 浏览器授权的有效期

以下结论核对了当前打包的 NetBird 0.81.2 源码
`bb90c9787a8a3591bcb3cccd106a024d1a30b0ef`（2026-10-24）。

| 对象 | 有效期与依据 |
| --- | --- |
| 扫码用的 device code / user code | 身份提供方每次响应的 `expires_in` 秒；不能给所有 NetBird 服务写死同一个时长。 |
| NetBird 内置 Dex 的 device code | 当前所用 Dex 默认 **5 分钟**；管理员可通过 `expiry.deviceRequests` 修改。这个默认值不能证明云服务或其他身份提供方也使用 5 分钟。 |
| PKCE 浏览器等待 | 客户端默认 **300 秒**等待回调；它是另一种登录流程的客户端窗口，不是所有授权码的服务器有效期。 |
| 设备已登录后的会话 | 独立的 Peer Session Expiration 策略；官方文档默认 24 小时，可配置为 1 小时至 180 天，也可关闭。它不是二维码有效期。 |

OneKVM 的无桌面 Linux 客户端走 device authorization flow。NetBird 根据
`AuthFlowInfo.ExpiresIn` 等待授权，并在收到 `expired_token` 或等待窗口结束时退出。
OneKVM 跟随当前授权进程的结束事件清除 URL / 手动授权码；网络错误不能一概解释为码过期。

当前 `Login` / `WaitSSOLogin` 接口及其 CLI 输出只提供验证 URL、user code，
没有提供这次登录的到期时间。因此无法声称掌握上游链接的准确剩余寿命；下面的五分钟是 OneKVM 自己施加的窗口。
同一 proto 中 `RequestJWTAuthResponse.expiresIn` 属于 SSH JWT 认证流程；
不能为了获取数字而额外调用它，它会替换共享 OAuth 流程。

左上角箭头与右滑返回 App 列表，长按旋钮回主屏，均不终止授权；重新进入时读取仍在进行的流程。
“取消”终止授权，“连接”重新发起授权。完成、取消、替换、过期、失败后均清除旧二维码。

## 事件与协议边界

OneKVM 状态展示由 daemon 的 SubscribeStatus、进程结束和文件变更事件驱动，
不定时调用 status 或屏幕 Refresh。NetBird 与身份提供方之间的 OAuth device flow
仍按 RFC 8628 的 `interval` 查询 token endpoint；这是授权协议的一部分，
本地 D-Bus 通知无法替代尚未发生在本机的浏览器授权结果。


## OneKVM 的统一扫码窗口

OneKVM 对两个提供方统一限制 **300 秒**：从当前 URL 首次可用起，后台用
`CLOCK_MONOTONIC` 的一次性 timerfd 事件计时。显示 `authWindowSeconds: 300`
及对应 URL 的 `authExpiresAt`（Unix 毫秒）。返回、重进和查询 status 不延长期限；
新请求或服务端换码会建立新的窗口。上游提前失败或过期时提前清除。

到期停止本次登录等待、清除 URL / 手动码并通知屏幕，显示“二维码已过期，请重试”；
不自动重新授权。点击连接才重试。此限制属于 OneKVM 的展示和等待策略，
不能改变或保证撤销官方服务端 URL 的有效期；Tailscale 仍可能返回同一个有效链接。
到期时间字段只用于展示；实际到期事件用单调时钟，不受系统时间调整影响。
服务重启保留已经结束的状态，不重新执行旧请求；被重启中断的授权标为失败，
清除旧码，等待用户手动重试。

## 按钮状态机

| 状态 | 连接 | 断开 | 返回 |
| --- | --- | --- | --- |
| 离线、初始状态尚未取得 | 禁用 | 禁用 | 可用 |
| 已就绪、未连接 | 可用 | 禁用 | 可用 |
| 生成链接、待授权、连接中 | 禁用 | 可用，显示“取消” | 可用 |
| 已连接 | 禁用 | 可用 | 可用 |
| 过期、超时、失败 | 可重试 | 禁用 | 可用 |
| 操作请求处理中 | 禁用 | 禁用 | 可用 |

触摸和旋钮走相同的启用条件；旋钮跳过禁用项。后台以文件锁串行发布授权请求，
重复 Connect 返回 `started: false, alreadyPending: true`，保留原请求和到期时间。
取消后才允许重新发起；到期不会自动换码。

## 来源

- [RFC 8628 §3.2 / §3.5：expires_in、interval、expired_token](https://www.rfc-editor.org/rfc/rfc8628.html#section-3.2)
- [当前 NetBird device flow：RequestAuthInfo / WaitToken](https://github.com/netbirdio/netbird/blob/bb90c9787a8a3591bcb3cccd106a024d1a30b0ef/client/internal/auth/device_flow.go#L249)
- [流程选择、AuthFlowInfo](https://github.com/netbirdio/netbird/blob/bb90c9787a8a3591bcb3cccd106a024d1a30b0ef/client/internal/auth/oauth.go#L40)
- [PKCE 等待常量](https://github.com/netbirdio/netbird/blob/bb90c9787a8a3591bcb3cccd106a024d1a30b0ef/client/internal/auth/pkce_flow.go#L34)
- [LoginResponse 与各认证 RPC 的字段](https://github.com/netbirdio/netbird/blob/bb90c9787a8a3591bcb3cccd106a024d1a30b0ef/client/proto/daemon.proto#L256)
- [共享 OAuth 流程与到期处理](https://github.com/netbirdio/netbird/blob/bb90c9787a8a3591bcb3cccd106a024d1a30b0ef/client/server/server.go#L918)
- [所用 Dex 的五分钟默认值](https://github.com/netbirdio/dex/blob/a163de3129e5/server/server.go#L370)
- [NetBird 的 Dex 配置覆盖](https://github.com/netbirdio/netbird/blob/bb90c9787a8a3591bcb3cccd106a024d1a30b0ef/idp/dex/config.go#L631)
- [官方设备会话过期说明](https://docs.netbird.io/manage/settings/enforce-periodic-user-authentication)
