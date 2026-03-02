import Popover from '../src/popover';

describe('Popover', () => {
  let button;
  let popover;

  beforeEach(() => {
    document.body.innerHTML = `
      <button 
        class="btn" 
        data-popover-title="Заголовок" 
        data-popover-content="Текст">
        Кнопка
      </button>
    `;
    button = document.querySelector('.btn');
    popover = new Popover(button);
  });

  afterEach(() => {
    popover.destroy();
  });

  test('конструктор сохраняет данные из data-атрибутов', () => {
    expect(popover.title).toBe('Заголовок');
    expect(popover.content).toBe('Текст');
  });

  test('конструктор работает без data-атрибутов', () => {
    document.body.innerHTML = '<button class="btn">Кнопка</button>';
    const btn = document.querySelector('.btn');
    const pop = new Popover(btn);

    expect(pop.title).toBeUndefined();
    expect(pop.content).toBeUndefined();

    pop.destroy();
  });

  test('показывает popover по клику', () => {
    button.click();
    const popoverEl = document.querySelector('.popover');

    expect(popoverEl).not.toBeNull();
    expect(popover.isVisible).toBe(true);
  });

  test('показывает заголовок если он есть', () => {
    button.click();
    const header = document.querySelector('.popover-header');

    expect(header).not.toBeNull();
    expect(header.textContent).toBe('Заголовок');
  });

  test('не показывает заголовок если его нет', () => {
    button.dataset.popoverTitle = '';
    button.click();
    const header = document.querySelector('.popover-header');

    expect(header).toBeNull();
  });

  test('показывает тело с текстом', () => {
    button.click();
    const body = document.querySelector('.popover-body');

    expect(body).not.toBeNull();
    expect(body.textContent).toBe('Текст');
  });

  test('показывает стрелку', () => {
    button.click();
    const arrow = document.querySelector('.popover-arrow');

    expect(arrow).not.toBeNull();
  });

  test('не создает второй popover при повторном show()', () => {
    button.click();
    const firstPopover = document.querySelector('.popover');

    popover.show(); // повторный вызов
    const secondPopover = document.querySelector('.popover');

    expect(secondPopover).toBe(firstPopover);
    expect(document.querySelectorAll('.popover').length).toBe(1);
  });

  test('скрывает popover по второму клику', () => {
    button.click();
    expect(document.querySelector('.popover')).not.toBeNull();

    button.click();
    expect(document.querySelector('.popover')).toBeNull();
    expect(popover.isVisible).toBe(false);
  });

  test('скрывает popover при клике вне', () => {
    button.click();
    expect(document.querySelector('.popover')).not.toBeNull();

    document.body.click();
    expect(document.querySelector('.popover')).toBeNull();
  });

  test('не скрывает popover при клике на него', () => {
    button.click();
    const popoverEl = document.querySelector('.popover');

    popoverEl.click();
    expect(document.querySelector('.popover')).not.toBeNull();
  });

  test('не скрывает popover при клике на стрелку', () => {
    button.click();
    const arrow = document.querySelector('.popover-arrow');

    arrow.click();
    expect(document.querySelector('.popover')).not.toBeNull();
  });

  test('центрирует popover относительно кнопки', () => {
    button.getBoundingClientRect = jest.fn(() => ({
      left: 100, top: 200, width: 100, height: 40,
    }));

    button.click();
    const popoverEl = document.querySelector('.popover');

    popoverEl.getBoundingClientRect = jest.fn(() => ({
      width: 200, height: 100,
    }));

    popover.positionPopover();

    const left = parseFloat(popoverEl.style.left);
    expect(left).toBe(50); // 100 + 50 - 100 = 50
  });

  test('не дает popover уехать за левый край', () => {
    button.getBoundingClientRect = jest.fn(() => ({
      left: 5, top: 200, width: 100, height: 40,
    }));

    button.click();
    const popoverEl = document.querySelector('.popover');

    popoverEl.getBoundingClientRect = jest.fn(() => ({
      width: 200, height: 100,
    }));

    popover.positionPopover();

    const left = parseFloat(popoverEl.style.left);
    expect(left).toBe(10); // должен быть отступ 10px
  });

  test('не дает popover уехать за правый край', () => {
    window.innerWidth = 500;

    button.getBoundingClientRect = jest.fn(() => ({
      left: 450, top: 200, width: 100, height: 40,
    }));

    button.click();
    const popoverEl = document.querySelector('.popover');

    popoverEl.getBoundingClientRect = jest.fn(() => ({
      width: 200, height: 100,
    }));

    popover.positionPopover();

    const left = parseFloat(popoverEl.style.left);
    expect(left).toBe(290); // 500 - 200 - 10 = 290
  });

  test('ставит popover над кнопкой', () => {
    button.getBoundingClientRect = jest.fn(() => ({
      left: 100, top: 200, width: 100, height: 40,
    }));

    button.click();
    const popoverEl = document.querySelector('.popover');

    popoverEl.getBoundingClientRect = jest.fn(() => ({
      width: 200, height: 100,
    }));

    popover.positionPopover();

    const top = parseFloat(popoverEl.style.top);
    expect(top).toBe(90); // 200 - 100 - 10 = 90
  });

  test('позиционирует стрелку по центру кнопки', () => {
    button.getBoundingClientRect = jest.fn(() => ({
      left: 100, top: 200, width: 100, height: 40,
    }));

    button.click();
    const popoverEl = document.querySelector('.popover');
    const arrow = document.querySelector('.popover-arrow');

    popoverEl.getBoundingClientRect = jest.fn(() => ({
      width: 200, height: 100,
    }));

    popover.positionPopover();

    expect(arrow.style.left).toBe('150px'); // центр кнопки 150 - левый край popover 0 = 150
  });

  test('удаляет обработчики при destroy', () => {
    const removeEventListenerSpy = jest.spyOn(button, 'removeEventListener');
    const documentRemoveSpy = jest.spyOn(document, 'removeEventListener');

    popover.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', popover.handleClick);
    expect(documentRemoveSpy).toHaveBeenCalledWith('click', popover.handleDocumentClick);
  });

  test('getTitle() возвращает сохраненный title когда data-атрибут не изменился', () => {
    // Строки 23, 25-31: ветка где currentTitle === undefined
    // Создаем новый экземпляр и сразу удаляем data-атрибут
    // Клонируем кнопку без data-атрибутов
    const cleanButton = document.createElement('button');
    cleanButton.className = 'btn';
    cleanButton.textContent = 'Кнопка';
    document.body.appendChild(cleanButton);

    // Создаем popover с кнопкой без data-атрибутов
    const newPopover = new Popover(cleanButton);
    // Устанавливаем title вручную (как если бы он был сохранен в конструкторе)
    newPopover.title = 'Заголовок';

    const title = newPopover.getTitle();
    expect(title).toBe('Заголовок');

    newPopover.destroy();
    cleanButton.remove();
  });

  test('getTitle() возвращает null для пустого title из data-атрибута', () => {
    // Строки 23, 25-31: ветка где currentTitle есть, но пустой
    button.dataset.popoverTitle = '   '; // строка с пробелами

    const title = popover.getTitle();
    expect(title).toBeNull();
  });

  test('getTitle() возвращает null для пустого сохраненного title', () => {
    // Строки 23, 25-31: ветка где currentTitle === undefined и сохраненный title пустой
    document.body.innerHTML = '<button class="btn" data-popover-title="">Кнопка</button>';
    const btn = document.querySelector('.btn');

    const newPopover = new Popover(btn);

    const title = newPopover.getTitle();
    expect(title).toBeNull();

    newPopover.destroy();
  });

  test('getTitle() возвращает null для пустого currentTitle', () => {
  // Эта ветка: currentTitle !== undefined && currentTitle.trim() === ''
    button.dataset.popoverTitle = '';
    const title = popover.getTitle();
    expect(title).toBeNull();
  });

  test('getTitle() возвращает title из data-атрибута когда он есть', () => {
  // Просто проверяем результат, без сложных шпионов
    button.dataset.popoverTitle = 'Новый заголовок';
    const title = popover.getTitle();
    expect(title).toBe('Новый заголовок');
  });

  test('getContent() возвращает сохраненный content когда data-атрибут не изменился', () => {
    // Создаем кнопку без data-атрибута content
    const cleanButton = document.createElement('button');
    cleanButton.className = 'btn';
    cleanButton.textContent = 'Кнопка';
    document.body.appendChild(cleanButton);

    const newPopover = new Popover(cleanButton);
    // Устанавливаем content вручную
    newPopover.content = 'Текст';

    const content = newPopover.getContent();
    expect(content).toBe('Текст');

    newPopover.destroy();
    cleanButton.remove();
  });

  test('getContent() возвращает content из data-атрибута когда он есть', () => {
    button.dataset.popoverContent = 'Новый текст';

    const content = popover.getContent();
    expect(content).toBe('Новый текст');
  });

  test('positionPopover() работает когда стрелка не найдена', () => {
    button.click();
    const popoverEl = document.querySelector('.popover');
    const arrow = popoverEl.querySelector('.popover-arrow');

    // Проверяем что стрелка существует перед удалением
    expect(arrow).not.toBeNull();

    // Удаляем стрелку
    arrow.remove();

    // Проверяем что стрелки больше нет
    expect(popoverEl.querySelector('.popover-arrow')).toBeNull();

    // Должно работать без ошибок
    expect(() => {
      popover.positionPopover();
    }).not.toThrow();
  });

  test('positionPopover() работает без стрелки', () => {
    button.click();
    const popoverEl = document.querySelector('.popover');
    // Удаляем стрелку
    popoverEl.querySelector('.popover-arrow').remove();

    expect(() => {
      popover.positionPopover();
    }).not.toThrow();
  });

  test('destroy() работает когда popoverElement не существует', () => {
    // Строка 143: ветка где this.popoverElement === null
    // Убеждаемся что popoverElement null
    expect(popover.popoverElement).toBeNull();

    // Должно работать без ошибок
    expect(() => {
      popover.destroy();
    }).not.toThrow();
  });
});
