# Дорожная карта обучения — Citeria Frontend (Angular 20–21)

Живой файл: наставник обновляет его по ходу (после моего «ок»). Здесь — что уже есть, какие темы
проходим и в каком порядке строим фичи. Формат обучения — **гибрид**: тема → сразу практика на фиче.

Легенда: ✅ готово · 🔄 в процессе · ⬜ дальше

---

## Текущее состояние проекта (срез на 2026-07-14)

**Core**
- ✅ `core/guards/access.guard.ts` — гвард доступа (refresh при отсутствии сессии, редирект на `/login`)
- ✅ `core/interceptors/auth.interceptor.ts` — интерцептор (Bearer-заголовок, авто-refresh на 401)

**Auth (`features/auth`)**
- ✅ `pages/login` — форма, обработка 401, редирект на профиль
- ✅ `pages/register`
- 🔄 `pages/forgot-password` — пока только статическая страница-заглушка (нет формы/запроса);
  в `API.md` нет эндпоинта восстановления пароля — есть только `PATCH /users/{id}/password`
  (смена пароля залогиненным пользователем). Решить позже: ждать бэкенд-эндпоинт или
  переориентировать страницу на смену пароля из профиля.
- ✅ services: `auth.service` (login/register/refresh/logout/getMe/restoreSession,
  refresh задедуплен через `shareReplay`), `auth-http.service`, `session.service` (signals)
- ✅ `restoreSession()` подключён в `provideAppInitializer` (`app.config.ts`) — сессия
  восстанавливается при загрузке приложения
- ✅ models: `iUser`, `iLogin`, `iRegister`, `iRefresh`, `eUserRole`, `eUserType`
- ✅ `logout()` подключён в sidebar

**Shared**
- ✅ layout: `header`, `footer`, `main-layout`, `sidebar-layout`, `sidebar` (навигация настроена)
- ✅ components: `button`, `field-error`, `toast`
- ✅ dialogs: `confirm-dialog` (на CDK Dialog) + `dialog-service`
- ✅ services: `toast.service` (на signals)
- ✅ util: `routes-class`, `icons-class`, `static-data-class`

**Features дальше**
- ⬜ `features/profile` — есть заглушка страницы, логики нет
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

### M1 — Доделать Auth 🔄
- Костяк готов (login/register/session/interceptor/guard/restoreSession). Остаётся разобрать
  тонкости: почему `refresh()` дедуплен через `shareReplay(1)` + `finalize`, обработка `429`
  на login/register (rate limit), поведение интерцептора при параллельных 401-запросах,
  судьба `forgot-password`.
- **Темы:** RxJS (`switchMap`, `shareReplay`, refresh-флоу), interop `toSignal`, ревью Reactive
  Forms, DI/интерцепторы.

### M2 — Профиль ⬜
- `GET /users/me`, `PATCH /users/{id}`, смена пароля `PATCH /users/{id}/password`.
- **Темы:** типизированные Reactive Forms, signals-состояние, `input()/output()` в под-компонентах,
  маппинг ошибок в ProblemDetail.

### M3 — Поиск специалистов и услуги ⬜
- `GET /services` (фильтры `search`, `minPrice`, `maxPrice`), `GET /specialist-detail/{id}`.
- **Темы:** RxJS живой поиск (`debounceTime` + `switchMap`), signals, `@for/@defer`, route-параметры, resolvers.

### M4 — Слоты и бронирование ⬜
- `GET /services/{id}/slots`, `POST /appointments` (lifecycle PENDING→…→COMPLETED).
- **Темы:** работа с датами (`Instant`/`LocalDate`/`LocalTime`), композиция RxJS, состояние-«машина» статусов.

### M5 — Мои записи ⬜
- Список `GET /appointments` + действия (accept/pay/cancel/complete) по ролям CLIENT/SPECIALIST.
- **Темы:** списки + OnPush/CD, роли и типы, гварды по типу пользователя, полиморфные действия.

---

## Лог прогресса

_(наставник дописывает по ходу: дата — что разобрали / что построили)_
