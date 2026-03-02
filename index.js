import Popover from './src/popover';
import './src/popover.css';

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  // Ищем кнопки с двумя data-атрибутами
  const buttons = document.querySelectorAll('[data-popover-title][data-popover-content]');
  buttons.forEach((button) => { // Для каждой найденной создаем Popover
    new Popover(button);
  });
});
