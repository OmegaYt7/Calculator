/**
 * matrix.js
 * Обработчики операций над матрицами.
 * Каждая функция:
 * 1. Читает данные
 * 2. Пишет промежуточные шаги
 * 3. Выполняет операцию
 * 4. Показывает результат или ошибку
 */

function handleMatrixOperation(op) {
  clearOutput();

  try {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);

    const A = readMatrix('matrixA', rowsA, colsA);
    let B = null;

    // B нужна не всегда
    if (['add', 'sub', 'mul'].includes(op)) {
      B = readMatrix('matrixB', rowsB, colsB);
    }

    const k = parseFloat(document.getElementById('scalarK').value);

    switch (op) {
      case 'add':
        doMatrixAdd(A, B);
        break;
      case 'sub':
        doMatrixSub(A, B);
        break;
      case 'mulScalar':
        doMatrixMulScalar(A, k);
        break;
      case 'mul':
        doMatrixMul(A, B);
        break;
      case 'transpose':
        doTranspose(A);
        break;
      case 'det':
        doDeterminant(A);
        break;
      case 'rank':
        doRank(A);
        break;
      case 'inverse':
        doInverse(A);
        break;
      default:
        showError('Неизвестная операция');
    }
  } catch (e) {
    showError('Сбой: ' + e.message);
  }
}

function doMatrixAdd(A, B) {
  addStep('Проверяем размеры матриц...');
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error('Сложение невозможно: матрицы разных размеров');
  }
  addStep(`Размеры совпадают: ${A.length}×${A[0].length}`);
  addStep('Выполняем поэлементное сложение aᵢⱼ + bᵢⱼ');

  const result = addMatrices(A, B, 1);
  showResult(matrixToHTML(result, 'A + B ='));
}

function doMatrixSub(A, B) {
  addStep('Проверяем размеры матриц...');
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error('Вычитание невозможно: матрицы разных размеров');
  }
  addStep(`Размеры совпадают: ${A.length}×${A[0].length}`);
  addStep('Выполняем поэлементное вычитание aᵢⱼ − bᵢⱼ');

  const result = addMatrices(A, B, -1);
  showResult(matrixToHTML(result, 'A − B ='));
}

function doMatrixMulScalar(A, k) {
  addStep(`Умножаем каждый элемент матрицы A на число k = ${k}`);
  const result = multiplyByScalar(A, k);
  showResult(matrixToHTML(result, `${k} · A =`));
}

function doMatrixMul(A, B) {
  addStep(`Матрица A: ${A.length}×${A[0].length}`);
  addStep(`Матрица B: ${B.length}×${B[0].length}`);

  if (A[0].length !== B.length) {
    throw new Error('Умножение невозможно: число столбцов A ≠ числу строк B');
  }

  addStep('Вычисляем произведение по формуле cᵢⱼ = Σ aᵢₖ · bₖⱼ');
  const result = multiplyMatrices(A, B);
  showResult(matrixToHTML(result, 'A × B ='));
}

function doTranspose(A) {
  addStep(`Исходная матрица ${A.length}×${A[0].length}`);
  addStep('Меняем строки и столбцы местами: aᵢⱼ → aⱼᵢ');
  const result = transpose(A);
  showResult(matrixToHTML(result, 'Aᵀ ='));
}

function doDeterminant(A) {
  if (!isSquare(A)) {
    throw new Error('Определитель определён только для квадратных матриц');
  }
  addStep(`Матрица порядка ${A.length}`);
  addStep('Вычисляем определитель разложением по первой строке (рекурсивно)');

  const det = determinant(A);
  const display = Math.abs(det) < 1e-10 ? 0 : Number(det.toFixed(8));
  showResult(`det(A) = <strong>${display}</strong>`);
}

function doRank(A) {
  addStep(`Матрица ${A.length}×${A[0].length}`);
  addStep('Приводим матрицу к ступенчатому виду методом Гаусса');
  addStep('Ранг = количество ненулевых строк после приведения');

  const r = rank(A);
  showResult(`rank(A) = <strong>${r}</strong>`);
}

function doInverse(A) {
  if (!isSquare(A)) {
    throw new Error('Обратная матрица существует только для квадратных матриц');
  }
  addStep(`Матрица порядка ${A.length}`);
  addStep('Ищем обратную матрицу методом Гаусса-Жордана');
  addStep('Если определитель равен нулю — матрица вырожденная');

  const inv = inverseMatrix(A);
  if (inv === null) {
    throw new Error('Матрица вырожденная (det = 0), обратной не существует');
  }
  showResult(matrixToHTML(inv, 'A⁻¹ ='));
}
