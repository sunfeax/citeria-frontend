# Дорожная карта обучения — Citeria Frontend (Angular 20–21)

Живой файл: наставник обновляет его по ходу (после моего «ок»). Здесь — что уже есть, какие темы
проходим и в каком порядке строим фичи. Формат обучения — **гибрид**: тема → сразу практика на фиче.

Легенда: ✅ готово · 🔄 в процессе · ⬜ дальше

---

## Текущее состояние проекта (срез на 2026-07-18)

**Core**
- ✅ `core/guards/access.guard.ts` — гвард доступа (refresh при отсутствии сессии, редирект на `/login`)
- ✅ `core/interceptors/auth.interceptor.ts` — интерцептор (Bearer-заголовок, авто-refresh на 401)

**Auth (`features/auth`)**
- ✅ `pages/login` — форма, обработка 401, редирект на профиль
- ✅ `pages/register` — поле-ошибки через `serverErrors`/`app-field-error`, group-level
  `passwordComparator`, `isSubmitted` для radio/group-ошибок
- 🔄 `pages/forgot-password` — пока только статическая страница-заглушка (нет формы/запроса);
  в `API.md` нет эндпоинта восстановления пароля — есть только `PATCH /users/{id}/password`
  (смена пароля залогиненным пользователем). Решить позже: ждать бэкенд-эндпоинт или
  переориентировать страницу на смену пароля из профиля.
- ✅ services: `auth.service` (login/register/refresh/logout/getMe/restoreSession,
  refresh задедуплен через `shareReplay`), `auth-http.service`, `session.service` (signals,
  плюс `requireUser()` — throws-аксессор для мест, гарантированных гвардом)
- ✅ `restoreSession()` подключён в `provideAppInitializer` (`app.config.ts`) — сессия
  восстанавливается при загрузке приложения
- ✅ models: `iUser`, `iLogin`, `iRegister`, `iRefresh`, `eUserRole`, `eUserType`
  (файлы в kebab-case: `user.ts`, `login.ts`, `register.ts`, `refresh.ts`, `user-role.ts`, `user-type.ts`)
- ✅ `logout()` подключён в sidebar

**Profile (`features/profile`) ✅**
- ✅ `pages/profile` — две формы (личные данные + смена пароля), типизированные Reactive Forms
  с валидаторами, `app-field-error` на каждом поле, `pristine`/`markAsPristine()` для disabled
  кнопки, write-through в `sessionSE.setUser()` после успешного PATCH
- ✅ services: `profile.service` (`update`, `changePassword`)
- ✅ models: `iUserUpdateRequest`/`tUserUpdateServerErrors`, `iChangePasswordRequest`/`tChangePasswordServerErrors`

**Shared**
- ✅ layout: `header`, `footer`, `main-layout`, `sidebar-layout`, `sidebar` (навигация настроена)
- ✅ components: `button` (variants incl. `outline`, self-closing `/>` везде), `field-error`
  (абсолютное позиционирование ошибки — не двигает layout, глобально в самом компоненте), `toast`
- ✅ dialogs: `confirm-dialog` (на CDK Dialog) + `dialog-service`
- ✅ services: `toast.service` (на signals)
- ✅ util: функции-модули вместо классов-неймспейсов — `routes.ts`, `icons.ts`, `static-data.ts`,
  `payload-handler.ts` (были `*-class.ts`, мигрировали осознанно, см. лог)

**Features дальше**
- ⬜ поиск специалистов, услуги, часы работы, слоты, бронирования (по `API.md`)

---

## Темы (что углубляем на среднем уровне)

Порядок — примерный; реально закрываем по мере фич (колонка «где закрепим»).

1. **RxJS** — Observable, cold/hot, операторы (`map`, `switchMap`, `mergeMap`, `concatMap`,
   `exhaustMap`, `debounceTime`, `catchError`, `retry`), Subjects, отписки (`takeUntilDestroyed`,
   `async` pipe). → *где:* HTTP-слой, refresh-флоу интерцептора, живой поиск.
2. **Signals** — `signal`, `computed`, `effect`, `untracked`, `linkedSignal`, `resource`. → *где:*
   состояние session/toasts (уже на signals — разобрать), профиль, списки.
3. **Interop signal ↔ observable** — `toSignal`, `toObservable`. → *где:* связка HTTP (Observable)
   и UI-состояния (signal).
4. **Reactive Forms** — `FormControl/FormGroup`, типизированные формы, валидаторы (sync/async),
   статусы и ошибки, `updateOn`. → *где:* login/register (отревьюить существующие), профиль, создание услуги.
5. **Новые `input()` / `output()` / `model()`** — сигнальные вводы/выводы, `required`, `transform`,
   `alias`, двусторонняя привязка. → *где:* shared-компоненты (`button`, `field-error`), формы-обёртки.
6. **Router** — маршруты, lazy `loadComponent`/`loadChildren`, параметры, функциональные гварды
   (уже есть `access.guard`), resolvers, привязка route→input. → *где:* `specialist-detail`, детали записи, защита по роли/типу.
7. **`viewChild` / `contentChild`** — сигнальные queries, `viewChildren`, `afterRender`/`afterNextRender`.
   → *где:* работа с DOM (фокус, элементы форм), диалоги.
8. **DI** — `inject()`, providers, injection tokens, `providedIn`, функциональные interceptors/guards.
   → *где:* сервисы, разбор существующего интерцептора.
9. **Change detection** — OnPush, zoneless (20–21), как signals двигают CD. → *где:* большие списки
   (услуги, записи).
10. **HttpClient** — `provideHttpClient`, `withInterceptors`, типизация, `params`, маппинг ошибок
    в `ProblemDetail` из `API.md`. → *где:* весь data-слой.
11. **Control flow & шаблоны** — `@if/@for/@switch/@defer`, `track`, `@let`. → *где:* списки слотов/услуг/записей.
12. **(доп) Vitest** — юнит-тесты сервисов и компонентов. → по желанию.

---

## План по фичам (milestones)

Каждый milestone = реальная фича из `API.md` + темы, которые на ней разбираем.

### M1 — Auth ✅
- Костяк + тонкости разобраны: `shareReplay(1)` + `finalize` в `refresh()`, обработка 401 в
  интерцепторе, ревью Reactive Forms в login/register. `forgot-password` осознанно оставлен
  🔄 до появления бэкенд-эндпоинта.
- **Темы закрыты:** RxJS (`switchMap`, `shareReplay`, refresh-флоу), Reactive Forms, DI/интерцепторы.

### M2 — Профиль 🔄
- `GET /users/me` (через сессию, без лишнего запроса), `PATCH /users/{id}`,
  `PATCH /users/{id}/password` — обе формы с валидацией, серверными ошибками по полям,
  `pristine`-гейтингом кнопки, write-through в session. ✅ готово.
- 🔄 Аватар — функционал есть на бэкенде, но не описан в `docs/API.md` (нет поля в `iUser`,
  нет эндпоинта загрузки). Нужен точный контракт от пользователя, прежде чем строить.
- ~~Привязка карты~~ — убрано из профиля: по `API.md` это не профильная сущность, а разовый ввод
  карты при оплате конкретной записи (`POST /appointments/{id}/pay`). Перенесено в M4.
- **Темы закрыты:** типизированные Reactive Forms (`nonNullable`, sync-валидаторы, group-level
  валидатор), signals-состояние, RxJS (`finalize`, cold observables, `Subject`/`exhaustMap` теория),
  self-closing шаблоны, файловые конвенции (kebab-case, функции-модули вместо классов).

### M3 — Поиск специалистов и услуги 🔄
- `GET /services` (фильтры `search`, `minPrice`, `maxPrice`), `GET /specialist-detail/{id}`.
- **Темы:** RxJS живой поиск (`debounceTime` + `switchMap`), signals, `@for/@defer`, route-параметры, resolvers.

### M4 — Слоты и бронирование ⬜
- `GET /services/{id}/slots`, `POST /appointments` (lifecycle PENDING→…→COMPLETED),
  форма ввода карты на экране оплаты (`POST /appointments/{id}/pay`, mocked, разовый ввод —
  перенесено сюда из M2).
- **Темы:** работа с датами (`Instant`/`LocalDate`/`LocalTime`), композиция RxJS, состояние-«машина» статусов.

### M5 — Мои записи ⬜
- Список `GET /appointments` + действия (accept/pay/cancel/complete) по ролям CLIENT/SPECIALIST.
- **Темы:** списки + OnPush/CD, роли и типы, гварды по типу пользователя, полиморфные действия.

---

## Лог прогресса

_(наставник дописывает по ходу: дата — что разобрали / что построили)_

- **2026-07-18** — M1 и M2 закрыты. Профиль: две формы (личные данные + смена пароля) с
  типизированными Reactive Forms, `app-field-error` на каждом поле, `pristine`/`markAsPristine()`,
  write-through в `SessionService` после успешного `PATCH`. По пути: `SessionService.requireUser()`
  (throws-аксессор вместо разрозненных `!`/`?.`), миграция `*-class.ts` → функции-модули,
  kebab-case для файлов моделей в `auth`, self-closing теги в шаблонах, теория по `exhaustMap`/
  `Subject`/hot-cold в противовес `switchMap`/`mergeMap`/`concatMap`. Начинаем M3.
