# Дорожная карта обучения — Citeria Frontend (Angular 20–21)

Живой файл: наставник обновляет его по ходу (после моего «ок»). Здесь — что уже есть, какие темы
проходим и в каком порядке строим фичи. Формат обучения — **гибрид**: тема → сразу практика на фиче.

**Главная цель проекта — архитектура современных приложений** (см. `CLAUDE.md`): владение
состоянием, границы фич, data-слой, распространение загрузки и ошибок, роутинг и DI. Всё, что не про
архитектуру — виджеты, разметка, иконки, стили — берём готовым из UI-библиотеки.

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
- ⬜ `pagination` — план в M3, свой компонент на сигнальных `input()/output()`, не сторонняя либа
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
- ✅ `features/service`: `iServiceList` + `iPageableContent<T>` (generic, переиспользуемый на будущих
  list-эндпоинтах), `ServiceService.getList()`, роут `/services`. Ответ бэкенда сверен вручную —
  форма модели совпала.
- 🔄 Дальше: единый `page` signal под весь `iPageableContent<iServiceList>` (не растаскивать
  `totalPages`/`totalElements`/`content` по отдельным сигналам — они меняются атомарно одним
  ответом), рендер списка через `@for` + `track service.id`, живой поиск (`valueChanges` →
  `debounceTime` → `distinctUntilChanged` → `switchMap`).
- ~~свой `shared/components/pagination` на сигнальных `input()/output()`~~ — **решение отменено
  2026-09-20**, см. «M3.5». Пагинация берётся из Angular Material (`MatPaginator`). Тема 5
  (`input()/output()/model()`) закрепляется не здесь, а на тех компонентах, которые в Material
  отсутствуют.
- **Темы:** RxJS живой поиск (`debounceTime` + `switchMap`), signals (гранулярность/single source of
  truth), `input()/output()/model()` (пагинация), `@for/@defer`, route-параметры, resolvers.

### M3.5 — Переход на Angular Material 🔄

**Решение от 2026-09-20 (отменяет предыдущее «не тащить Material»).** Причина: главная цель проекта —
архитектура, а не вёрстка виджетов. Самописные `button`/`field-error`/`toast`/`pagination` времени
съедают много, а архитектуре не учат ничему. `ngx-pagination` рассмотрен и отклонён: последняя
публикация 30.06.2023, peer `@angular/core >=13`, построен вокруг клиентского `PaginatePipe` — при
серверной пагинации не подходит, и вторая UI-либа рядом с Material не нужна.

- ✅ `@angular/material@21.2.14` (в линию с `@angular/cdk@21.2.14`; `@latest` = 22.x ломает дерево).
- ✅ M3-тема сгенерирована из собственной палитры проекта
  (`ng generate @angular/material:theme-color --primary-color=#2563eb --error-color=#dc2626`)
  → `src/styles/_theme-colors.scss`, подключена через `mat.theme()` в `src/styles.scss`.
  Типографика — Inter, чтобы Material не расходился с уже свёрстанными экранами.
- ✅ Шрифты Inter + Material Symbols Outlined в `index.html`; `MAT_ICON_DEFAULT_OPTIONS`
  с `fontSet: 'material-symbols-outlined'` в `app.config.ts`.
- ✅ `@angular/animations` не нужен — Material 21 его в peer-зависимостях не держит.

**Фазы миграции** (порядок выбран так, чтобы каждая фаза удаляла код целиком, а не правила его
дважды; иконки переезжают на `mat-icon` попутно внутри каждой фазы):

| Фаза | Что уходит | Чем заменяется | Кто |
|---|---|---|---|
| 1 ✅ | `ToastComponent`, `models/toast.ts`, CDK-обвязка `confirm-dialog` | `MatSnackBar`, `MatDialog` | Claude |
| 2 ✅ | `ButtonComponent` (+ его `@Input()`-декораторы) | `matButton` / `matIconButton` | Claude |
| 3 ✅ | `FieldErrorComponent` | `mat-form-field` + `mat-error` | Claude |
| 4 ✅ | `util/icons.ts`, зависимость `lucide-angular` | `mat-icon` | Claude |
| 5 ⬜ | заглушка `PaginationComponent` (удалена в фазе 2) | `MatPaginator` прямо в `ServiceComponent` + серверная пагинация | **пользователь** |

**Фазы 2–4 сделаны 2026-09-20.** Что важно знать про результат:
- Ошибки валидации и ошибки сервера теперь одним механизмом. Сообщения из `errors` ответа API
  кладутся в контролы через `setErrors({ server })` (`shared/util/form-errors.ts`:
  `applyServerErrors`, `clearServerErrors`, `getFieldError`). Сигналы `serverErrors` и типы
  `t*ServerErrors` удалены. Сообщение снимается само, когда пользователь правит поле.
- `passwordMismatch` живёт на группе, а не на `confirmPassword`, поэтому у поля свой
  `ErrorStateMatcher` (в `register.component.ts`).
- `loading` у кнопок нет в Material: спиннер внутри кнопки + `[disabled]`.
- Радио-карточки типа аккаунта заменены на `mat-button-toggle-group`, поповер с требованиями к
  паролю — на `matTooltip`.
- `mat-form-field` по умолчанию `outline` (провайдер в `app.config.ts`), высота/скругления
  подогнаны токенами в `styles.scss`.
- Проверено: сборка, скриншоты логина и регистрации в Firefox, временный тест на регистрации
  (пустой сабмит, mismatch, серверная ошибка из async-колбэка в zoneless, сброс при правке).
  Профиль и сайдбар за гвардом — глазами не смотрел.

Известное изменение поведения: `MatSnackBar` показывает по одному уведомлению за раз (очередь),
самописный `ToastService` их стекал. У снекбара нет заголовка — параметр `title` из API сервиса
убран, тексты на 15 вызовах переписаны в самодостаточные.

`ToastService` как имя и как API (`success`/`error`/`warning`/`info`) оставлен: внутри теперь
обёртка над `MatSnackBar`, но вызывающий код не изменился по форме. Конфигурация уведомлений
(позиция, длительность, panel-классы) лежит в одном месте.

После фазы 1 бандл вырос до 510 kB и вышел за `maximumWarning: 500kB` в `angular.json`. Бюджет
намеренно **не поднят**: это корректный сигнал. Правильный ответ — не заглушить предупреждение,
а разрезать бандл лениво загружаемыми роутами (`loadComponent`), тема 6. Задача пользователя.

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

- **2026-09-20** — В `CLAUDE.md` зафиксирована главная цель: архитектура современных приложений,
  и отсюда приоритет скорости по всему, что к архитектуре не относится. Переписано разделение труда:
  пользователь пишет всё, что несёт архитектурное решение, Claude — обвязку (скаффолды, разметку под
  UI-библиотеку, стили, тему, механические миграции). Решение «не тащить Material» отменено,
  проект переходит на Angular Material — см. M3.5. Попутно разобран ревью текущего кода:
  `@Input()`-декораторы в shared-компонентах, `computed` вместо `asReadonly()` в `SessionService`,
  снимок `requireUser()` вместо производного в `ProfileComponent`, инвертированный
  `isPasswordVisible`, `set(!get())` вместо `update()`, «at least» в ветке `maxlength`, мёртвая
  навигация в сайдбаре, отсутствующий `hasAvatar` в `iUser`.

- **2026-07-18** — M1 и M2 закрыты. Профиль: две формы (личные данные + смена пароля) с
  типизированными Reactive Forms, `app-field-error` на каждом поле, `pristine`/`markAsPristine()`,
  write-through в `SessionService` после успешного `PATCH`. По пути: `SessionService.requireUser()`
  (throws-аксессор вместо разрозненных `!`/`?.`), миграция `*-class.ts` → функции-модули,
  kebab-case для файлов моделей в `auth`, self-closing теги в шаблонах, теория по `exhaustMap`/
  `Subject`/hot-cold в противовес `switchMap`/`mergeMap`/`concatMap`. Начинаем M3.
