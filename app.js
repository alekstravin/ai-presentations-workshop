const slides = [...document.querySelectorAll('.slide')];
const dialog = document.querySelector('#contentDialog');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogKicker = document.querySelector('#dialogKicker');
const dialogBody = document.querySelector('#dialogBody');
const copyButton = document.querySelector('#copyPrompt');
const copyStatus = document.querySelector('#copyStatus');
let current = 0;
let copyText = '';

const prompts = {
  gamma: {
    title: 'Gamma · быстрый черновик',
    text: String.raw`Создай презентацию на тему: «[ВСТАВЬТЕ ТЕМУ]».

Аудитория: [КТО БУДЕТ СМОТРЕТЬ ПРЕЗЕНТАЦИЮ И ЧТО ОНИ УЖЕ ЗНАЮТ].
Цель: [ЧТО АУДИТОРИЯ ДОЛЖНА ПОНЯТЬ, РЕШИТЬ ИЛИ СДЕЛАТЬ].
Продолжительность выступления: [N] минут.
Количество слайдов: [N].

Предлагаемая история:
1. [ИСХОДНАЯ СИТУАЦИЯ ИЛИ ПРОБЛЕМА].
2. [ПОЧЕМУ ЭТО ВАЖНО ДЛЯ АУДИТОРИИ].
3. [КЛЮЧЕВОЙ МЕХАНИЗМ ИЛИ ОБЪЯСНЕНИЕ].
4. [РЕШЕНИЕ ИЛИ ПОДХОД].
5. [ПРИМЕР, ДОКАЗАТЕЛЬСТВО ИЛИ СЦЕНАРИЙ].
6. [СЛЕДУЮЩИЙ ШАГ ИЛИ ВЫВОД].

Требования:
- один главный вывод на слайд;
- заголовки должны быть законченными утверждениями;
- не более 40–50 слов видимого текста на слайд;
- визуализации должны объяснять мысль, а не служить декором;
- не использовать [ПЕРЕЧИСЛИТЕ НЕЖЕЛАТЕЛЬНЫЕ КЛИШЕ];
- визуальный стиль: [ОПИШИТЕ СТИЛЬ, ПАЛИТРУ И ХАРАКТЕР];
- формат 16:9;
- не придумывать цифры, цитаты, кейсы и источники;
- неподтверждённые эффекты обозначать как возможности, а не факты.

Сначала создай структуру, затем оформи презентацию.`,
  },
  chatgpt: {
    title: 'ChatGPT · многоэтапный PPTX',
    text: String.raw`Создай редактируемую презентацию PowerPoint в формате PPTX.

Тема: [ВСТАВЬТЕ ТЕМУ].
Аудитория: [ОПИШИТЕ АУДИТОРИЮ И ЕЁ УРОВЕНЬ ЗНАНИЙ].
Цель: [ЧТО ДОЛЖНА ИЗМЕНИТЬ ПРЕЗЕНТАЦИЯ].
Продолжительность: [N] минут.
Исходные материалы: [ПРИЛОЖЕННЫЕ ФАЙЛЫ, ССЫЛКИ ИЛИ «НЕТ»].

Выполни работу по этапам. Не создавай PPTX сразу и не переходи к следующему этапу без моего подтверждения.

ЭТАП 1 — ИССЛЕДОВАНИЕ И ФАКТЧЕК
1. Уточни ключевые понятия и границы темы.
2. Найди 5–7 надёжных первичных или официальных источников.
3. Раздели утверждения на подтверждённые факты, оценки, прогнозы и предположения.
4. Отдельно перечисли популярные, но неподтверждённые обещания и числа.
5. Покажи результат и дождись подтверждения.

ЭТАП 2 — КОММУНИКАЦИОННАЯ КОНЦЕПЦИЯ
Предложи три разные истории презентации. Для каждой укажи центральную мысль, последовательность, сильные и слабые стороны и подходящие визуальные формы. Порекомендуй одну, но дождись моего выбора.

ЭТАП 3 — АРХИТЕКТУРА
Создай структуру из [N] слайдов. Для каждого укажи:
- заголовок-вывод;
- функцию в истории;
- доказательство или объяснение;
- рекомендуемую визуализацию;
- источник;
- переход к следующему слайду.
Проверь историю только по заголовкам и дождись подтверждения.

ЭТАП 4 — СОДЕРЖАНИЕ
Подготовь видимый текст и заметки докладчика. Один тезис на слайд, не более [N] слов видимого текста. Пояснения переноси в заметки. Не используй маркетинговые клише и неподтверждённые числа. Проведи самокритику и дождись подтверждения.

ЭТАП 5 — ВИЗУАЛЬНАЯ СИСТЕМА
Предложи два визуальных направления: палитра, типографика, сетка, стиль изображений, диаграмм и композиций. Не используй [НЕЖЕЛАТЕЛЬНЫЕ ПРИЁМЫ]. Дождись выбора.

ЭТАП 6 — PPTX
Создай редактируемый PPTX 16:9. Все текстовые блоки, формы, таблицы и простые схемы должны оставаться редактируемыми. Добавь источники в заметки. Не растрируй целые слайды.

ЭТАП 7 — QA
Отрендери все слайды и проверь наложения, переполнения, переносы заголовков, контраст, кадрирование, мелкий текст и соответствие фактов источникам. Исправь найденные проблемы и предоставь итоговый PPTX с кратким QA-отчётом.`,
  },
  'codex-pptx': {
    title: 'Codex · новый PPTX из шаблона',
    text: String.raw`Используй навык Presentations.

Я прикладываю визуальный шаблон: [ИМЯ_ШАБЛОНА.pptx].
Создай новую презентацию: «[ВСТАВЬТЕ ТЕМУ]».

Аудитория: [ОПИШИТЕ АУДИТОРИЮ].
Цель: [ОПИШИТЕ НУЖНЫЙ РЕЗУЛЬТАТ].
Продолжительность: [N] минут.
Исходные данные и источники: [ФАЙЛЫ ИЛИ ССЫЛКИ].

Приложенный PPTX является визуальным шаблоном, а не источником содержания.

Сохрани:
- мастер-слайды и макеты;
- тему, шрифты и палитру;
- сетку, поля и типографическую иерархию;
- стили диаграмм, линий, изображений и колонтитулов;
- общую плотность и ритм композиции.

До редактирования:
1. Проинспектируй все слайды, masters и layouts.
2. Определи подходящие макеты для новой истории.
3. Создай карту «новый слайд → исходный layout → причина выбора».
4. Зафиксируй элементы, которые нельзя менять.
5. Представь карту и план перед реализацией.

Содержание:
[ВСТАВЬТЕ УТВЕРЖДЁННУЮ СТРУКТУРУ СЛАЙДОВ ИЛИ ПОПРОСИТЕ ЕЁ РАЗРАБОТАТЬ].

Правила:
- один вывод на слайд;
- заголовки образуют связную историю;
- максимум [N] слов основного текста;
- не придумывать данные, цитаты, эффекты и кейсы;
- проверить нетривиальные утверждения по первичным или официальным источникам;
- источники добавить в заметки соответствующих слайдов;
- не имитировать стиль вручную поверх пустого слайда;
- дублировать подходящие слайды и редактировать унаследованные элементы;
- не менять утверждённые слайды: [НОМЕРА ИЛИ «НЕТ»].

Техническая проверка:
1. Сохрани исходный PPTX без изменений.
2. Экспортируй новый файл под именем [ИМЯ_РЕЗУЛЬТАТА.pptx].
3. Отрендери каждый слайд.
4. Проверь переполнение, наложения, обрезанный текст, переносы, шрифты и кадрирование.
5. Исправь дефекты и выполни повторный рендер.
    6. Передай финальный PPTX и QA-отчёт.`,
  },
  'pptx-template': {
    title: 'Codex · создать корпоративный PPTX-шаблон',
    text: String.raw`Используй навык Presentations.

Создай с нуля редактируемый корпоративный шаблон презентации PowerPoint 16:9 в формате PPTX, а также демонстрационную колоду, показывающую все макеты в работе.

Назначение: [ВНУТРЕННИЕ ДОКЛАДЫ / ПРОДАЖИ / ОБУЧЕНИЕ / ИНОЕ].
Аудитория: [КТО БУДЕТ СОЗДАВАТЬ И СМОТРЕТЬ ПРЕЗЕНТАЦИИ].
Характер бренда: [3–5 ПРИЛАГАТЕЛЬНЫХ].
Логотипы и бренд-материалы: [ПРИЛОЖЕННЫЕ ФАЙЛЫ ИЛИ «НЕТ»].
Визуальные референсы: [ФАЙЛЫ, ССЫЛКИ ИЛИ «НЕТ»].

До реализации покажи спецификацию и дождись подтверждения:
1. Палитра: основные, дополнительные, фоновые, сигнальные и нейтральные цвета с HEX-кодами и назначением каждого цвета.
2. Типографика: основной и резервный системный шрифт; размеры и интервалы для заголовков, подзаголовков, основного текста, подписей и источников.
3. Сетка: поля, колонки, базовый шаг, безопасные зоны и правила выравнивания.
4. Стиль изображений, иконок, диаграмм, таблиц, линий и акцентов.
5. Правила контраста для светлого и тёмного фона.

Создай 10–12 макетов с настоящими редактируемыми плейсхолдерами:
- титульный с логотипом;
- разделитель раздела;
- заголовок + текст;
- заголовок + изображение слева/справа;
- ключевая цифра;
- сравнение;
- процесс или таймлайн;
- диаграмма;
- таблица;
- цитата;
- вывод / следующий шаг;
- завершающий слайд и контакты.

Для каждого макета предусмотри подходящие placeholders: заголовок, подзаголовок, текст, изображение, диаграмма, таблица, источник, номер слайда и служебная подпись. Логотипы и постоянные элементы размещай в master/layout, а не копируй вручную. Не встраивай текст в изображения.

Добавь в демонстрационную колоду:
- пример каждого макета с реалистичным нейтральным контентом;
- примеры светлой и тёмной темы;
- правила допустимой плотности текста;
- примеры корректного кадрирования изображений и подписей источников;
- слайд «как пользоваться шаблоном».

Техническая проверка:
1. Все тексты, формы, таблицы и диаграммы остаются редактируемыми.
2. Проверь замену шрифтов и отсутствие переполнений.
3. Отрендери все демонстрационные слайды в PNG и проверь контраст, переносы, поля, выравнивание и кадрирование.
4. Исправь дефекты и повтори рендер.
5. Передай файлы [ИМЯ_ШАБЛОНА.pptx], [ИМЯ_ДЕМО.pptx] и краткий README с правилами использования.`,
  },
  'codex-html': {
    title: 'Codex · HTML-презентация или лендинг',
    text: String.raw`Используй навык html-slide.

Создай [ПОЛНОЭКРАННУЮ HTML-ПРЕЗЕНТАЦИЮ 16:9 / ВЕРТИКАЛЬНЫЙ ЛЕНДИНГ].
Тема: «[ВСТАВЬТЕ ТЕМУ]».
Аудитория: [ОПИШИТЕ АУДИТОРИЮ].
Цель: [ЧТО ДОЛЖЕН ПОНЯТЬ ИЛИ СДЕЛАТЬ ПОЛЬЗОВАТЕЛЬ].
Исходные материалы: [ФАЙЛЫ, ССЫЛКИ, ДАННЫЕ].
Визуальный референс: [ФАЙЛ ИЛИ ОПИСАНИЕ].

Сначала создай дизайн-систему и структуру, затем реализуй проект.

Структура содержания:
[ВСТАВЬТЕ РАЗДЕЛЫ ИЛИ УТВЕРЖДЁННЫЙ ПЛАН СЛАЙДОВ].

Дизайн:
- характер: [3–5 ПРИЛАГАТЕЛЬНЫХ];
- палитра: [ЦВЕТА];
- типографика: [ТРЕБОВАНИЯ];
- использовать разные композиции в зависимости от функции экрана;
- не использовать [КАРТОЧНЫЕ СЕТКИ / СТОКОВЫЕ КЛИШЕ / ДРУГИЕ ЗАПРЕТЫ];
- анимация должна объяснять последовательность, а не украшать.

Интерактивность:
- управление клавиатурой и видимые состояния фокуса;
- прогресс и номер слайда;
- [АККОРДЕОНЫ / ДИАГРАММЫ / ФИЛЬТРЫ / ССЫЛКИ];
- поддержка prefers-reduced-motion.

Технические требования:
- семантические HTML, CSS и JavaScript;
- без серверной части;
- работа как статический сайт;
- корректные относительные пути для GitHub Pages;
- адаптация для ноутбука, планшета и телефона;
- отсутствие горизонтальной прокрутки и переполнений;
- README с локальным запуском и публикацией;
- при необходимости GitHub Actions workflow;
- не подключать тяжёлый фреймворк без необходимости.

Проверка:
1. Запусти локально.
2. Проверь основные разрешения в браузере.
3. Проверь клавиатуру, интерактивные элементы и консоль.
4. Исправь переполнения и ошибки.
5. Подготовь проект к GitHub Pages.

Создай проект в каталоге [ИМЯ-КАТАЛОГА].`,
  },
  remotion: {
    title: 'Codex + Remotion · озвученное видео 16:9',
    text: String.raw`Используй навыки remotion-best-practices, remotion-create, remotion-markup, remotion-multimedia, remotion-captions и remotion-render.

Преобразуй утверждённую презентацию [ФАЙЛ / ПАПКА / СТРУКТУРА] в профессиональную озвученную видеопрезентацию.

Тема: [ВСТАВЬТЕ ТЕМУ].
Аудитория: [ОПИШИТЕ АУДИТОРИЮ].
Главный тезис: [ОДНО ПРЕДЛОЖЕНИЕ].

Формат:
- горизонтальное видео 16:9;
- 1920×1080, 30 fps;
- продолжительность около [N] минут;
- язык озвучки: [ЯЗЫК];
- итоговый формат MP4 H.264;
- стиль: [КОРПОРАТИВНЫЙ / РЕДАКЦИОННЫЙ / ТЕХНОЛОГИЧЕСКИЙ];
- приложенный референс задаёт палитру, типографику и композиционный ритм.

Создай [N] сцен:
[ДЛЯ КАЖДОЙ СЦЕНЫ: ТЕЗИС, ВИЗУАЛЬНАЯ ИДЕЯ, ПРИМЕРНАЯ ДЛИТЕЛЬНОСТЬ].

Сценарий и голос:
- напиши естественный текст диктора для каждой сцены;
- озвучка не повторяет экранный текст дословно;
- спокойный, точный тон без рекламного пафоса;
- не использовать неподтверждённые цифры и обещания;
- сначала сгенерировать голос, затем рассчитывать длительность сцен;
- добавить синхронизированные субтитры максимум в две строки.

Motion-дизайн:
- один визуальный акцент на сцену;
- сдержанное раскрытие элементов и мягкие переходы;
- не двигать все элементы одновременно;
- не использовать cyberpunk, случайные stock-видео и шаблонные AI-клише;
- вся анимация должна определяться текущим кадром Remotion, а не реальным временем.

Звук:
- нормализовать речь;
- музыку использовать только при наличии разрешённого источника;
- музыка не должна мешать разборчивости;
- указать происхождение внешних аудиоматериалов.

Реализация:
- отдельные React-компоненты сцен;
- общая конфигурация цветов, типографики и таймингов;
- безопасные поля для текста;
- отдельные compositions для основной версии и версии без голоса;
- SOURCES.md, сценарий с тайм-кодами, субтитры и README.

Проверка:
1. Отрендери контрольные кадры начала, середины и конца сцен.
2. Проверь синхронизацию голоса, титров и анимации.
3. Исправь дефекты.
4. Отрендери финальный MP4 и версию без озвучки.

Создай проект в каталоге [ИМЯ-КАТАЛОГА].`,
  },
};

const hacks = {
  scope: {
    title: 'Границы изменений',
    items: [
      ['Сначала аудит — потом правка', 'Агент сначала перечисляет проблемы и план изменений, не трогая файл.', 'Пока ничего не изменяй. Проведи аудит по логике, фактам, плотности и дизайну. Для каждой проблемы укажи слайд, дефект, исправление и приоритет.'],
      ['Заморозьте утверждённое', 'Явно перечислите слайды и свойства, которые нельзя менять.', 'Измени только слайды [N–N]. Остальные слайды, мастер, палитру, шрифты, цифры и порядок не меняй.'],
      ['Один дефект за итерацию', 'Разделяйте факты, структуру, текст, дизайн и QA на отдельные проходы.', 'В этой итерации работай только с заголовками. Не меняй основной текст, данные, изображения и макеты.'],
      ['Исправляйте, а не перегенерируйте', 'Адресная правка сохраняет уже одобренное и делает результат сравнимым.', 'Исправь только выбранный блок: сократи на 30%, сохрани смысл, числа, тон и положение остальных элементов.'],
    ],
  },
  content: {
    title: 'Содержание и доказательства',
    items: [
      ['Паспорт каждого слайда', 'Определите функцию, тезис, доказательство, визуализацию и переход.', 'Для каждого слайда дай: функцию, главный вывод, доказательство, визуальную форму, источник и переход к следующему.'],
      ['История только по заголовкам', 'Если заголовки не складываются в рассказ, оформление не спасёт.', 'Выпиши только заголовки. Найди разрывы и повторы. Перепиши слабые как законченные выводы.'],
      ['Двухпроходное сокращение', 'Сначала классифицируйте текст, затем переносите детали в заметки.', 'Выдели тезис, доказательство, пояснение и детали. На слайде оставь тезис и доказательство, остальное перенеси в notes.'],
      ['Фактчек отдельно от стиля', 'Красивое переписывание может замаскировать слабое утверждение.', 'Создай реестр утверждений: факт/оценка/прогноз, источник, статус подтверждения, рекомендуемое действие. Стиль пока не меняй.'],
    ],
  },
  design: {
    title: 'Дизайн и визуализация',
    items: [
      ['Три контрольных слайда', 'Проверяйте систему на титуле, сложном аналитическом и самом визуальном слайде.', 'Сначала создай только три контрольных слайда. Остальные не делай до утверждения типографики, сетки и визуального языка.'],
      ['Отрицательные ограничения', 'Конкретный список запретов работает лучше слова «современно».', 'Не используй одинаковые карточки, мелкий текст, декоративные иконки, роботов, рукопожатия, случайные градиенты и заголовки из одного слова.'],
      ['Визуал под композицию', 'Сначала резервируется место на слайде, потом создаётся изображение.', 'Изображение для правой половины 16:9; главный объект справа, слева спокойная зона под заголовок, без текста внутри изображения.'],
      ['Дайте схему расположения объектов', 'Даже грубый набросок из Paint, PowerPoint или фотография рисунка от руки точно задаёт композицию.', 'Используй приложенный эскиз только как референс расположения: сохрани зоны, пропорции, иерархию и направление взгляда. Замени условные прямоугольники реальными объектами и контентом; не копируй стиль наброска.'],
    ],
  },
  qa: {
    title: 'Проверка и критика',
    items: [
      ['Рендер важнее структуры файла', 'Попросите агента увидеть фактический вид каждого слайда.', 'Экспортируй каждый слайд в PNG. Проверь обрезку, наложения, переносы, контраст, кадрирование и мелкий текст. Исправь и отрендери снова.'],
      ['Адвокат аудитории', 'Отдельный проход ищет вопросы и недоверие, а не редактирует.', 'Выступи скептическим руководителем: что непонятно, почему верить, какое возражение возникнет? Пока ничего не меняй.'],
      ['Доступность как proxy качества', 'Контраст, порядок чтения и субтитры одновременно повышают общее качество.', 'Проверь чтение с 3–5 метров, контраст, meaningful sequence, клавиатуру и субтитры. Дай адресные исправления.'],
    ],
  },
  production: {
    title: 'Производственный процесс',
    items: [
      ['Источник истины и версии', 'Для сложных проектов храните код/HTML и CHANGELOG, а PPTX/MP4 считайте сборкой.', 'Перед изменениями зафиксируй версию. В CHANGELOG укажи что, где и почему изменилось и что осталось неизменным.'],
      ['Один редактор — много ревизоров', 'Параллельные агенты могут исследовать и критиковать, но итоговый файл меняет один владелец.', 'Раздели роли: исследователь, редактор, арт-директор, фактчекер, QA. Только главный редактор применяет изменения.'],
      ['Упакуйте удачное в skill', 'Стиль, источники и QA превращаются в повторяемую процедуру.', 'Создай skill: обязательный бриф, одна идея на слайд, лимит слов, источники в notes, утверждённые layouts и финальный render-QA.'],
    ],
  },
};

const sources = [
  ['Gamma — Plans and pricing', 'https://gamma.app/pricing'],
  ['Gamma — Subscription and feature matrix', 'https://help.gamma.app/en/articles/8077107-how-can-i-upgrade-my-gamma-subscription'],
  ['Gamma — Refund and monthly credit thresholds', 'https://help.gamma.app/en/articles/11048496-what-is-gamma-s-refund-policy-and-how-do-i-request-a-refund'],
  ['OpenAI — ChatGPT pricing', 'https://chatgpt.com/pricing/'],
  ['OpenAI — ChatGPT Plus, $20/month', 'https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus'],
  ['OpenAI — ChatGPT Pro tiers', 'https://help.openai.com/en/articles/9793128-about-chatgpt-pro'],
  ['OpenAI — Business pricing', 'https://openai.com/business/pricing/'],
  ['OpenAI — Creating and editing presentations with ChatGPT Work', 'https://help.openai.com/en/articles/20001278-creating-and-editing-documents-spreadsheets-and-presentations-with-chatgpt-work'],
  ['OpenAI — Codex app and skills', 'https://openai.com/index/introducing-the-codex-app/'],
  ['OpenAI — Codex desktop app documentation', 'https://learn.chatgpt.com/docs/app'],
  ['GitHub CLI — authenticate with gh auth login', 'https://cli.github.com/manual/gh_auth_login'],
  ['GitHub — Clone a repository', 'https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository'],
  ['Microsoft — Free PowerPoint templates', 'https://powerpoint.cloud.microsoft/create/en/templates/'],
  ['Skills.sh — html-slides', 'https://www.skills.sh/claude-office-skills/skills/html-slides'],
  ['Skills.sh — Firecrawl deep research', 'https://www.skills.sh/firecrawl/skills/firecrawl-deep-research'],
  ['Remotion — Official agent skills', 'https://github.com/remotion-dev/skills'],
  ['Microsoft — Edit with Copilot in PowerPoint', 'https://support.microsoft.com/en-us/powerpoint/edit-with-copilot-in-powerpoint'],
  ['Microsoft — Keep presentations on-brand', 'https://support.microsoft.com/en-us/powerpoint/copilot/keep-your-presentation-on-brand-with-copilot'],
  ['Microsoft — Manage Brand Kit template settings', 'https://support.microsoft.com/en-us/powerpoint/copilot/manage-brand-kit-template-settings-in-powerpoint'],
  ['GitHub — Getting started with GitHub Pages', 'https://docs.github.com/en/pages/getting-started-with-github-pages'],
  ['GitHub — Automatic deployment with Pages', 'https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically'],
  ['Remotion — License and pricing', 'https://www.remotion.dev/'],
  ['Remotion — Prompting videos with coding agents', 'https://www.remotion.dev/docs/ai/coding-agents'],
  ['W3C — Contrast minimum', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum'],
  ['W3C — Captions', 'https://www.w3.org/WAI/media/av/captions/'],
];

function go(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === current);
    slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
  });
  document.querySelector('#counter').textContent = `${String(current + 1).padStart(2, '0')} / ${slides.length}`;
  document.querySelector('#progressBar').style.width = `${((current + 1) / slides.length) * 100}%`;
  location.hash = `slide-${current + 1}`;
}

function showPrompt(key) {
  const item = key === 'all'
    ? {title: 'Все обезличенные промпты', text: Object.values(prompts).map(p => `# ${p.title}\n\n${p.text}`).join('\n\n────────────────────\n\n')}
    : prompts[key];
  dialogKicker.textContent = 'БИБЛИОТЕКА ПРОМПТОВ';
  dialogTitle.textContent = item.title;
  copyText = item.text;
  dialogBody.innerHTML = `<pre>${escapeHtml(item.text)}</pre>`;
  copyButton.hidden = false;
  copyStatus.textContent = '';
  dialog.showModal();
}

function showHacks(key) {
  const group = hacks[key];
  dialogKicker.textContent = 'АГЕНТНЫЕ ЛАЙФХАКИ';
  dialogTitle.textContent = group.title;
  copyText = group.items.map(([title, why, prompt]) => `${title}\n${why}\nПромпт: ${prompt}`).join('\n\n');
  dialogBody.innerHTML = group.items.map(([title, why, prompt], i) => `<details${i === 0 ? ' open' : ''}><summary><span>${String(i + 1).padStart(2, '0')}</span><span>${escapeHtml(title)}</span></summary><p>${escapeHtml(why)}</p><pre>${escapeHtml(prompt)}</pre></details>`).join('');
  copyButton.hidden = false;
  copyStatus.textContent = '';
  dialog.showModal();
}

function showSources() {
  dialogKicker.textContent = 'АКТУАЛЬНО НА 03.09.2026';
  dialogTitle.textContent = 'Источники и оговорки';
  copyText = sources.map(([name, url]) => `${name}: ${url}`).join('\n');
  dialogBody.innerHTML = `<p class="source-note">Цены и лимиты меняются. Проверяйте региональный checkout, налоги, рабочие настройки и доступность функций в своём аккаунте. Gamma не показала денежные цены на публичной странице без checkout, поэтому в слайдах зафиксированы только официально подтверждённые возможности и кредитные лимиты.</p><ol class="source-list">${sources.map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noreferrer">${escapeHtml(name)}</a></li>`).join('')}</ol>`;
  copyButton.hidden = false;
  copyStatus.textContent = '';
  dialog.showModal();
}

function showGuide(key) {
  if (key !== 'github') return;
  dialogKicker.textContent = 'CODEX + GITHUB';
  dialogTitle.textContent = 'Как подключить GitHub к Codex';
  copyText = `Локальная работа:\n1. Создайте репозиторий на GitHub или выберите существующий.\n2. Клонируйте его через GitHub Desktop или командой git clone [URL].\n3. Откройте папку репозитория в Codex. Отдельный коннектор для чтения локальных файлов не нужен.\n4. Для push/pull один раз авторизуйте GitHub CLI командой gh auth login либо настройте SSH.\n5. Попросите Codex проверить git diff, затем явно подтвердите commit и push.\n\nОблачная работа:\n1. В настройках Codex найдите интеграцию GitHub.\n2. Авторизуйте только нужную организацию и выбранные репозитории.\n3. Выберите репозиторий, ветку и окружение для задачи.\n\nНазвания пунктов интерфейса могут меняться; используйте ссылки на актуальную документацию.`;
  dialogBody.innerHTML = `<div class="guide"><h3>Вариант 1 · локальный репозиторий</h3><ol><li>Создайте репозиторий на GitHub или выберите существующий.</li><li>Клонируйте его через GitHub Desktop или командой <code>git clone [URL]</code>.</li><li>Откройте папку репозитория в Codex. Отдельный коннектор для чтения локальных файлов не нужен.</li><li>Для <code>push</code>/<code>pull</code> один раз выполните <code>gh auth login</code> либо настройте SSH.</li><li>Попросите Codex проверить <code>git diff</code>; commit и push подтверждайте явно.</li></ol><h3>Вариант 2 · облачная интеграция</h3><ol><li>В настройках Codex найдите интеграцию GitHub.</li><li>Авторизуйте только нужную организацию и выбранные репозитории.</li><li>Выберите репозиторий, ветку и окружение для задачи.</li></ol><p class="source-note">Названия пунктов интерфейса могут меняться и зависят от плана или политики рабочего пространства.</p><p class="guide-links"><a href="https://learn.chatgpt.com/docs/app" target="_blank" rel="noreferrer">Документация Codex ↗</a><a href="https://cli.github.com/manual/gh_auth_login" target="_blank" rel="noreferrer">GitHub CLI: авторизация ↗</a><a href="https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository" target="_blank" rel="noreferrer">GitHub: клонирование ↗</a></p></div>`;
  copyButton.hidden = false;
  copyStatus.textContent = '';
  dialog.showModal();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

document.querySelector('#prev').addEventListener('click', () => go(current - 1));
document.querySelector('#next').addEventListener('click', () => go(current + 1));
document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => go(Number(b.dataset.goto) - 1)));
document.querySelectorAll('[data-prompt]').forEach(b => b.addEventListener('click', () => showPrompt(b.dataset.prompt)));
document.querySelectorAll('[data-hacks]').forEach(b => b.addEventListener('click', () => showHacks(b.dataset.hacks)));
document.querySelectorAll('[data-guide]').forEach(b => b.addEventListener('click', () => showGuide(b.dataset.guide)));
document.querySelectorAll('[data-sources]').forEach(b => b.addEventListener('click', showSources));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
copyButton.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(copyText); copyStatus.textContent = 'Скопировано'; }
  catch { copyStatus.textContent = 'Выделите текст и скопируйте вручную'; }
});

document.addEventListener('keydown', e => {
  if (dialog.open) return;
  if (['ArrowRight','PageDown',' '].includes(e.key)) { e.preventDefault(); go(current + 1); }
  if (['ArrowLeft','PageUp'].includes(e.key)) { e.preventDefault(); go(current - 1); }
  if (e.key === 'Home') go(0);
  if (e.key === 'End') go(slides.length - 1);
  if (e.key.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
});

const themeToggle = document.querySelector('#themeToggle');
const storedTheme = localStorage.getItem('aiDeckTheme');
const preferredTheme = window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
const urlTheme = new URLSearchParams(location.search).get('theme');

function setTheme(theme) {
  const resolved = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = resolved;
  document.querySelector('meta[name="theme-color"]').content = resolved === 'light' ? '#f4efe5' : '#070705';
  themeToggle.textContent = resolved === 'light' ? '☾' : '☀';
  themeToggle.title = resolved === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему';
  themeToggle.setAttribute('aria-pressed', String(resolved === 'light'));
  localStorage.setItem('aiDeckTheme', resolved);
}

themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));
setTheme(urlTheme || storedTheme || preferredTheme);

const initial = Number(location.hash.match(/slide-(\d+)/)?.[1] || 1) - 1;
go(initial);
