<h1 align="center">Welcome to code-challenge 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/code-challenge" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/code-challenge.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> NestJS & Nextjs14 

## Install

```sh
pnpm install
```

## Env Variable
please copy the .env.example => .env and replace the values with the correct ones
## Start dev

```sh
pnpm dev
```
## Build

```sh
pnpm build:backend
pnpm build:frontend
```

## Start

```sh
pnpm start:backend
pnpm start:frontend
```
## Swagger docs URL

http://localhost:4000/docs

## Code structure

```bash
├── apps
│   ├── backend
│   │   ├── README.md
│   │   ├── env.d.ts
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── app.controller.spec.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.spec.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.service.spec.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── jwt-auth.guard.spec.ts
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── client
│   │   │   │   ├── client.controller.spec.ts
│   │   │   │   ├── client.controller.ts
│   │   │   │   ├── client.entity.ts
│   │   │   │   ├── client.module.ts
│   │   │   │   ├── client.service.spec.ts
│   │   │   │   ├── client.service.ts
│   │   │   │   └── dto
│   │   │   │       ├── create-client.dto.ts
│   │   │   │       └── register-client.dto.ts
│   │   │   ├── config
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── multer.config.ts
│   │   │   ├── generate-metadata.ts
│   │   │   ├── main.ts
│   │   │   ├── metadata.ts
│   │   │   ├── photo
│   │   │   │   ├── photo.entity.ts
│   │   │   │   ├── photo.module.ts
│   │   │   │   ├── photo.service.spec.ts
│   │   │   │   └── photo.service.ts
│   │   │   └── user
│   │   │       ├── dto
│   │   │       │   └── login-user.dto.ts
│   │   │       ├── user.controller.ts
│   │   │       ├── user.entity.ts
│   │   │       ├── user.module.ts
│   │   │       ├── user.service.spec.ts
│   │   │       └── user.service.ts
│   │   ├── test
│   │   │   ├── app.e2e-spec.ts
│   │   │   ├── helper.ts
│   │   │   └── jest-e2e.json
│   │   ├── tsconfig.build.json
│   │   └── tsconfig.json
│   └── frontend
│       ├── README.md
│       ├── jest.config.ts
│       ├── jest.setup.ts
│       ├── next-auth.d.ts
│       ├── next-env.d.ts
│       ├── next.config.mjs
│       ├── package.json
│       ├── postcss.config.mjs
│       ├── public
│       │   ├── next.svg
│       │   └── vercel.svg
│       ├── src
│       │   ├── api
│       │   │   └── api.ts
│       │   ├── app
│       │   │   ├── api
│       │   │   │   └── auth
│       │   │   │       └── [...nextauth]
│       │   │   │           └── route.ts
│       │   │   ├── error.tsx
│       │   │   ├── favicon.ico
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   ├── login
│       │   │   │   └── page.tsx
│       │   │   ├── page.tsx
│       │   │   ├── profile
│       │   │   │   └── page.tsx
│       │   │   └── register
│       │   │       └── page.tsx
│       │   ├── components
│       │   │   ├── FormField
│       │   │   │   ├── FormField.tsx
│       │   │   │   ├── __tests__
│       │   │   │   │   └── FormField.test.tsx
│       │   │   │   └── form.types.ts
│       │   │   ├── auth
│       │   │   │   ├── login
│       │   │   │   │   ├── LoginForm.tsx
│       │   │   │   │   └── loginForm.schema.ts
│       │   │   │   └── register
│       │   │   │       ├── RegisterForm.tsx
│       │   │   │       ├── __tests__
│       │   │   │       │   ├── RegisterForm.test.tsx
│       │   │   │       │   └── registerForm.schema.test.ts
│       │   │   │       ├── registerForm.schema.ts
│       │   │   │       └── useRegisterForm.hook.ts
│       │   │   ├── carousel
│       │   │   │   ├── Carousel.test.tsx
│       │   │   │   └── Carousel.tsx
│       │   │   ├── navbar
│       │   │   │   └── navbar.tsx
│       │   │   └── profile
│       │   │       └── profile-card.tsx
│       │   ├── constants
│       │   │   └── routes.ts
│       │   ├── helper
│       │   │   ├── auth.ts
│       │   │   └── fetcher.ts
│       │   ├── middleware.ts
│       │   └── types
│       │       └── users.types.ts
│       ├── tailwind.config.ts
│       └── tsconfig.json
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```
## Author

👤 **Youssef Bentaleb**

* Website: https://ybentaleb.me
* Github: [@yousseefben](https://github.com/yousseefben)
* LinkedIn: [@ybentaleb](https://linkedin.com/in/ybentaleb)