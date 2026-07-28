# 百万职场 · Web（Next.js）

一期全栈应用：响应式 PC + H5，业务在 `src/server`，对外 API 为 `/api/v1`。

## 启动

```bash
# 安装依赖
npm install

# 配置数据库（复制并修改）
cp .env.example .env

# 生成 Prisma Client
npm run db:generate

# 有 PostgreSQL 后执行迁移
npm run db:migrate

# 开发
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)  
健康检查：[http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

## 目录要点

```text
src/
  app/                 # 页面与 Route Handlers
  app/api/v1/          # 稳定 REST（小程序二期复用）
  server/              # 领域逻辑（状态机、db、http 约定）
  generated/prisma/    # prisma generate 产出（勿手改）
prisma/schema.prisma   # 数据模型
```

## 约定

- 图标统一用 [Lucide](https://lucide.dev/)（`lucide-react`），按需导入，例如：`import { Search } from "lucide-react"`

产品文档在本地工作区 `../../docs/`（不纳入本仓库）。
