/**
 * main.js
 * Точка входа.
 * - переключение вкладок
 * - создание полей ввода
 * - привязка кнопок операций
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Вкладки ----------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Убираем active у всех
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Ставим active на нужные
      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      document.getElementById(tabId).classList.add('active');

      clearOutput();
    });
  });

  // ---------- Создание полей для матриц ----------
  document.getElementById('btnCreateMatrices').addEventListener('click', () => {
    const rowsA = parseInt(document.getElementById('rowsA').value) || 2;
    const colsA = parseInt(document.getElementById('colsA').value) || 2;
    const rowsB = parseInt(document.getElementById('rowsB').value) || 2;
    const colsB = parseInt(document.getElementById('colsB').value) || 2;

    // Ограничиваем разумными пределами (чтобы не тормозило)
    if (rowsA > 8 || colsA > 8 || rowsB > 8 || colsB > 8) {
      showError('Максимальный размер матрицы — 8×8');
      return;
    }

    createMatrixInputs('matrixA', rowsA, colsA);
    createMatrixInputs('matrixB', rowsB, colsB);
    clearOutput();
  });

  // ---------- Создание полей для векторов ----------
  document.getElementById('btnCreateVectors').addEventListener('click', () => {
    const dim = parseInt(document.getElementById('vectorDim').value) || 3;
    createVectorInputs('vectorA', dim);
    createVectorInputs('vectorB', dim);
    createVectorInputs('vectorC', dim);
    clearOutput();
  });

  // ---------- Создание полей для СЛАУ ----------
  document.getElementById('btnCreateSlae').addEventListener('click', () => {
    const n = parseInt(document.getElementById('slaeN').value) || 3;
    if (n > 6) {
      showError('Максимальный порядок системы — 6 (из-за скорости вычисления определителей)');
      return;
    }
    // Расширенная матрица n строк × (n+1) столбцов
    createMatrixInputs('slaeMatrix', n, n + 1);
    clearOutput();
  });

  // ---------- Кнопки операций ----------
  // Матрицы
  document.querySelectorAll('#matrices .btn.op').forEach(btn => {
    btn.addEventListener('click', () => {
      handleMatrixOperation(btn.dataset.op);
    });
  });

  // Векторы
  document.querySelectorAll('#vectors .btn.op').forEach(btn => {
    btn.addEventListener('click', () => {
      handleVectorOperation(btn.dataset.op);
    });
  });

  // СЛАУ
  document.querySelectorAll('#slae .btn.op').forEach(btn => {
    btn.addEventListener('click', () => {
      handleSlaeOperation(btn.dataset.op);
    });
  });

  // ---------- Инициализация по умолчанию ----------
  // Создаём поля сразу при загрузке
  document.getElementById('btnCreateMatrices').click();
  document.getElementById('btnCreateVectors').click();
  document.getElementById('btnCreateSlae').click();
});
