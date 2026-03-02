export default class Popover {
  constructor(element) {
    this.element = element;// Сохраняем кнопку
    this.popoverElement = null;// Ссылка на DOM popover'а, пока popover не создан
    this.isVisible = false;// чтобы понимать, что делать при клике

    // читаем data-атрибуты
    this.title = element.dataset.popoverTitle;
    this.content = element.dataset.popoverContent;

    this.handleClick = this.handleClick.bind(this);// прибьем this
    // к методу, чтобы работать с классом, а не с кнопкой
    this.handleDocumentClick = this.handleDocumentClick.bind(this);

    this.init();
  }

  // метод для получения акт-х данных
  getTitle() {
    //  пробуем получить из data-атрибута (если изменился)
    const currentTitle = this.element.dataset.popoverTitle;

    // Если есть актуальное значение, используем его, иначе используем сохраненное из конструктора
    if (currentTitle !== undefined) {
      return currentTitle && currentTitle.trim() !== '' ? currentTitle : null;
    }
    return this.title && this.title.trim() !== '' ? this.title : null;
  }

  getContent() {
    const currentContent = this.element.dataset.popoverContent;

    return currentContent !== undefined ? currentContent : this.content;
  }

  init() {
    this.element.addEventListener('click', this.handleClick);
  }

  handleClick() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  // закрытие по клику вне
  handleDocumentClick(event) {
    // Получаем элемент, по которому кликнули
    const { target } = event;

    // Проверяем, что это не кнопка и не popover
    const isClickOnButton = this.element === target
    || this.element.contains(target);
    const isClickOnPopover = this.popoverElement
    && (this.popoverElement === target
        || this.popoverElement.contains(target));

    // Если кликнули не на кнопке и не на popover'е - скрываем
    if (!isClickOnButton && !isClickOnPopover) {
      this.hide();
    }
  }

  // создает элементы popover'а
  createPopover() {
    const popover = document.createElement('div');
    popover.className = 'popover';

    const title = this.getTitle(); // Получаем актуальный заголовок

    if (title) {
      const header = document.createElement('div');
      header.className = 'popover-header';
      header.textContent = title;
      popover.appendChild(header);
    }

    const body = document.createElement('div');
    body.className = 'popover-body';
    body.textContent = this.getContent();// Получаем актуальный контент
    popover.appendChild(body);

    // Добавляем стрелку
    const arrow = document.createElement('div');
    arrow.className = 'popover-arrow';
    popover.appendChild(arrow);

    return popover;
  }

  // создает popover и добавляет в DOM
  show() {
    if (this.isVisible) return;

    this.popoverElement = this.createPopover();// Создаем и сохраняем ссылку
    document.body.appendChild(this.popoverElement);

    this.positionPopover();// позиционируем после добавления в DOM
    this.isVisible = true;

    // Вешаем обработчик на клик на весь документ
    document.addEventListener('click', this.handleDocumentClick);
  }

  // удаляет из DOM
  hide() {
    if (!this.isVisible || !this.popoverElement) return;

    this.popoverElement.remove();// Удаляем из DOM
    this.popoverElement = null;// Очищаем ссылку
    this.isVisible = false;

    document.removeEventListener('click', this.handleDocumentClick);
  }

  positionPopover() {
    const elementRect = this.element.getBoundingClientRect();// Получаем координаты кнопки
    const popoverRect = this.popoverElement.getBoundingClientRect();// Получаем размеры popover'а

    // Вычисляем левый край popover'а (центр кнопки - половина ширины popover)
    let left = elementRect.left
    + (elementRect.width / 2)
    - (popoverRect.width / 2);

    // Защита от левого края - чтобы popover не прилипал к краям
    // экрана, а имел небольшой отступ 10 пикс
    if (left < 10) { // Если popovер хочет уехать левее 10px от края
      left = 10;// Ставит его ровно на 10px от левого края
    }
    // Защита от правого края
    const rightEdge = left + popoverRect.width; // где заканчивается popover
    if (rightEdge > window.innerWidth - 10) { // Не вылезает ли popovер
    //  за правый край (с учетом отступа 10px)
      left = window.innerWidth - popoverRect.width - 10;// Сдвигает влево,
      //  чтобы был отступ 10px справа
    }

    // Вычисляем верхний край (над кнопкой с отступом 10px)
    const top = elementRect.top - popoverRect.height - 10;

    // Применяем позицию с учетом прокрутки
    this.popoverElement.style.left = `${left + window.scrollX}px`;
    this.popoverElement.style.top = `${top + window.scrollY}px`;

    const arrow = this.popoverElement.querySelector('.popover-arrow');
    if (arrow) {
      const updatedPopoverRect = this.popoverElement.getBoundingClientRect(); // акт
      // позиция popover'а
      const elementCenter = elementRect.left + (elementRect.width / 2);// Центр кнопки
      // относительно страницы

      // Позиция стрелки = центр кнопки - левый край popover'а
      const arrowLeft = elementCenter - updatedPopoverRect.left;// позиция стрелки
      arrow.style.left = `${arrowLeft}px`;// устанавливаем позицию
    }
  }

  destroy() {
    // Принудительно удаляем popover из DOM, если он есть
    if (this.popoverElement) {
      this.popoverElement.remove();
      this.popoverElement = null;
    }

    // Всегда удаляем обработчики, независимо от состояния
    this.element.removeEventListener('click', this.handleClick);
    document.removeEventListener('click', this.handleDocumentClick);

    this.isVisible = false;
  }
}
