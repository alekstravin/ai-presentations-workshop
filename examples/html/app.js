const architecture = [
  {kicker:'Физический слой',name:'Оборудование и скважины',copy:'Датчики и производственные объекты формируют измерения, состояния и события. Качество сигнала и идентификация объекта задают предел качества всего контура.',output:'Привязанный ко времени сигнал'},
  {kicker:'Интеграционный слой',name:'IoT и информационные системы',copy:'Шлюзы, АСУ ТП и корпоративные системы передают данные с учётом протоколов, частоты, качества и прав доступа.',output:'Управляемый поток данных'},
  {kicker:'Контекстный слой',name:'Платформа данных',copy:'Данные очищаются, сопоставляются с объектами и историей, получают единые идентификаторы, происхождение и контроль качества.',output:'Контекст объекта'},
  {kicker:'Аналитический слой',name:'Модели и ИИ',copy:'Физические, статистические и гибридные модели оценивают отклонения, состояние и возможную динамику — в пределах валидации.',output:'Оценка и неопределённость'},
  {kicker:'Слой поддержки решений',name:'Рекомендации',copy:'Результат переводится в понятную гипотезу: что изменилось, почему это важно, какие варианты допустимы и что проверить.',output:'Объяснимый вариант действия'},
  {kicker:'Производственный контур',name:'Инженерное решение',copy:'Ответственный специалист сопоставляет рекомендацию с ограничениями и регламентами, принимает решение и фиксирует обратную связь.',output:'Проверенное действие'}
];
const pilot = [
  {name:'Сформулировать решение',copy:'Выбрать узкую производственную задачу, пользователя решения, допустимое действие и критерий полезности.',check:'Какое решение станет лучше — и кто это проверит?'},
  {name:'Провести аудит данных',copy:'Проверить источники, частоту, пропуски, временную синхронизацию, идентификаторы и права доступа.',check:'Достаточны ли данные для выбранного решения?'},
  {name:'Зафиксировать базовый уровень',copy:'Описать текущий процесс принятия решения и метод сравнения с будущим прототипом.',check:'С чем именно будет сравниваться пилот?'},
  {name:'Собрать прототип',copy:'Соединить минимальный поток данных, модель и интерфейс пользователя без преждевременного масштаба.',check:'Работает ли сквозной контур на реальных данных?'},
  {name:'Провести полевой тест',copy:'Использовать прототип параллельно действующему процессу, фиксируя рекомендации, решения и отклонения.',check:'Безопасно ли встроен новый инструмент в практику?'},
  {name:'Оценить результат',copy:'Разобрать качество рекомендаций, устойчивость данных, нагрузку на пользователей и причины ошибок.',check:'Подтверждена ли полезность в заданном контексте?'},
  {name:'Подготовить масштабирование',copy:'Стандартизировать интеграции, мониторинг моделей, роли, безопасность и сопровождение.',check:'Повторяем ли результат на следующем объекте?'}
];

function bindTabs(selector,data,render){
  const root=document.querySelector(selector); if(!root)return;
  const tabs=[...root.querySelectorAll('[role="tab"]')];
  const select=(index,focus=false)=>{tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});render(data[index],index,tabs[index]);if(focus)tabs[index].focus()};
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(index));tab.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover)').matches)select(index)});tab.addEventListener('keydown',event=>{let next=index;if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%tabs.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();select(next,true)})});
}
bindTabs('.pipeline',architecture,(item,index,tab)=>{document.querySelector('#arch-kicker').textContent=item.kicker;document.querySelector('#arch-name').textContent=item.name;document.querySelector('#arch-copy').textContent=item.copy;document.querySelector('#arch-output').textContent=item.output;document.querySelector('#arch-detail').setAttribute('aria-labelledby',tab.id)});
bindTabs('.roadmap',pilot,(item,index,tab)=>{document.querySelector('#pilot-label').textContent=`Шаг ${String(index+1).padStart(2,'0')}`;document.querySelector('#pilot-name').textContent=item.name;document.querySelector('#pilot-copy').textContent=item.copy;document.querySelector('#pilot-check').textContent=item.check;document.querySelector('#pilot-detail').setAttribute('aria-labelledby',tab.id)});

const humanSteps=[
  ['01 · Наблюдение','Аватар собирает актуальные параметры, события и качество данных по выбранному объекту.'],
  ['02 · Анализ','Правила, физические и data-driven модели сопоставляют текущее состояние с ожидаемым поведением.'],
  ['03 · Рекомендация','Инженер получает вариант действия вместе с основаниями, ограничениями и оценкой неопределённости.'],
  ['04 · Контрольная точка','Ответственный специалист проверяет ограничения, достоверность данных и производственный контекст до воздействия на объект.'],
  ['05 · Действие','Подтверждённое решение выполняется по действующим регламентам и в пределах назначенных полномочий.'],
  ['06 · Обратная связь','Фактический результат возвращается в контур: он нужен для оценки рекомендации и последующего улучшения модели.']
];
const humanButtons=[...document.querySelectorAll('[data-human-step]')];
function selectHuman(index){humanButtons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));document.querySelector('#human-detail-title').textContent=humanSteps[index][0];document.querySelector('#human-detail-copy').textContent=humanSteps[index][1]}
humanButtons.forEach((button,index)=>{button.addEventListener('click',()=>selectHuman(index));button.addEventListener('mouseenter',()=>selectHuman(index));button.addEventListener('focus',()=>selectHuman(index))});

const demoRoot=document.querySelector('#live-demo');
if(demoRoot){
  const svgNS='http://www.w3.org/2000/svg';
  const state={well:17,choke:62,horizon:12,ai:true,scenario:'balanced'};
  const histories={17:[274,276,275,279,281,280,283,282,284,286,285,283,282],24:[251,253,254,252,255,257,256,258,260,259,261,263,262],31:[304,302,301,303,300,298,299,296,294,295,292,291,289]};
  const wellOffset={17:0,24:-24,31:18};
  const scenarioCopy={safe:'<b>Щадящий режим:</b> меньший ожидаемый дебит, но наибольший запас устойчивости. Подходит для проверки реакции объекта.',balanced:'<b>Сбалансированный режим:</b> ожидаемый дебит выше базового при сохранении индекса устойчивости в рабочей зоне. Перед действием проверить ограничение по давлению.',intensive:'<b>Интенсивный режим:</b> максимальный ожидаемый дебит сопровождается снижением индекса устойчивости. Требует отдельной инженерной проверки ограничений.'};
  const el=id=>document.getElementById(id); const fmt=n=>String(n.toFixed(1)).replace('.',',');
  function path(points){return points.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')}
  function updateDemo(){
    const history=histories[state.well]; const base=history.at(-1); const chokeEffect=(state.choke-62)*.9; const aiEffect=state.ai?2:-1;
    const flow=Math.round(base+chokeEffect+aiEffect); const pressure=8.7-(state.choke-62)*.035+(state.well===31?.25:state.well===24?-.15:0); const stability=Math.max(48,Math.min(94,Math.round(83-Math.abs(state.choke-58)*1.15+(state.ai?4:0)-(state.well===31?7:0))));
    el('choke-output').textContent=`${state.choke}%`;el('horizon-output').textContent=`${state.horizon} ч`;el('chart-horizon').textContent=`${state.horizon} ч`;el('flow-kpi').textContent=flow;el('pressure-kpi').textContent=fmt(pressure);el('stability-kpi').textContent=stability;el('flow-delta').textContent=`${flow-base>=0?'+':''}${flow-base} к базе`;el('pressure-delta').textContent=`${pressure-8.9>=0?'+':''}${fmt(pressure-8.9)} к базе`;el('stability-label').textContent=stability>=75?'рабочая зона':stability>=60?'требует внимания':'вне предпочтительной зоны';
    const flows={safe:flow-14,balanced:flow,intensive:flow+15};Object.entries(flows).forEach(([key,val])=>el(`${key}-flow`).textContent=val);
    renderChart(history,flow,stability);
  }
  function renderChart(history,target,stability){
    const grid=demoRoot.querySelector('.chart-grid'),axis=el('chart-axis'),points=el('chart-points');grid.replaceChildren();axis.replaceChildren();points.replaceChildren();
    [24,81,138,195,252].forEach((y,i)=>{const line=document.createElementNS(svgNS,'line');line.setAttribute('x1','44');line.setAttribute('x2','730');line.setAttribute('y1',y);line.setAttribute('y2',y);grid.append(line);const t=document.createElementNS(svgNS,'text');t.setAttribute('x','3');t.setAttribute('y',y+4);t.setAttribute('class','chart-axis-text');t.textContent=320-i*20;axis.append(t)});
    const y=v=>252-(v-240)*2.85,xHist=i=>44+i*(412/(history.length-1));const actual=history.map((v,i)=>[xHist(i),y(v)]);el('actual-path').setAttribute('d',path(actual));
    const count=state.horizon/2+1;const forecast=Array.from({length:count},(_,i)=>{const progress=i/(count-1||1);const wobble=state.ai?Math.sin(i*.8)*1.2:0;return [456+progress*274,y(history.at(-1)+(target-history.at(-1))*progress+wobble)]});el('forecast-path').setAttribute('d',path(forecast));
    const spread=6+(100-stability)*.08;const upper=forecast.map(p=>[p[0],p[1]-spread*2.85]);const lower=[...forecast].reverse().map(p=>[p[0],p[1]+spread*2.85]);el('confidence-path').setAttribute('d',`${path(upper)} ${path(lower).replace('M','L')} Z`);
    [...actual.slice(-4),...forecast.slice(1)].forEach((p,i)=>{const c=document.createElementNS(svgNS,'circle');c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);c.setAttribute('r','4');c.setAttribute('class','chart-point');c.setAttribute('tabindex','0');const forecastPoint=i>=4;const value=Math.round(240+(252-p[1])/2.85);const label=`${forecastPoint?'Прогноз':'Факт'}: ${value} тыс. м³/сут`;c.setAttribute('aria-label',label);const show=()=>{const tip=el('chart-tooltip');tip.textContent=label;tip.style.display='block';tip.style.left=`${p[0]/7.6}%`;tip.style.top=`${p[1]/3}px`};c.addEventListener('mouseenter',show);c.addEventListener('focus',show);c.addEventListener('mouseleave',()=>el('chart-tooltip').style.display='none');c.addEventListener('blur',()=>el('chart-tooltip').style.display='none');points.append(c)});
  }
  demoRoot.querySelectorAll('.well-button').forEach(button=>button.addEventListener('click',()=>{state.well=Number(button.dataset.well);demoRoot.querySelectorAll('.well-button').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});updateDemo()}));
  el('choke').addEventListener('input',e=>{state.choke=Number(e.target.value);updateDemo()});el('horizon').addEventListener('input',e=>{state.horizon=Number(e.target.value);updateDemo()});el('ai-toggle').addEventListener('change',e=>{state.ai=e.target.checked;updateDemo()});
  demoRoot.querySelectorAll('.scenario').forEach(button=>button.addEventListener('click',()=>{state.scenario=button.dataset.scenario;demoRoot.querySelectorAll('.scenario').forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active)});el('recommendation-copy').innerHTML=scenarioCopy[state.scenario]}));
  el('explain-button').addEventListener('click',()=>{const open=el('explain-button').getAttribute('aria-expanded')==='true';el('explain-button').setAttribute('aria-expanded',String(!open));el('explanation').hidden=open});
  el('reset-demo').addEventListener('click',()=>{Object.assign(state,{well:17,choke:62,horizon:12,ai:true,scenario:'balanced'});el('choke').value=62;el('horizon').value=12;el('ai-toggle').checked=true;demoRoot.querySelector('[data-well="17"]').click();demoRoot.querySelector('[data-scenario="balanced"]').click();updateDemo()});
  updateDemo();
}

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduce){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}
