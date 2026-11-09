/**
 * math-helpers.js
 * Основные математические алгоритмы:
 * - определитель (разложение по строке)
 * - ранг (метод Гаусса)
 * - обратная матрица (метод Гаусса-Жордана)
 * - вспомогательные операции над матрицами
 */

/**
 * Вычисляет определитель квадратной матрицы.
 * Использует разложение по первой строке (рекурсия).
 * Для n ≥ 1.
 */
function determinant(matrix) {
  const n = matrix.length;
  if (n === 0) return 1;
  if (n === 1) return matrix[0][0];
  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  let det = 0;
  for (let j = 0; j < n; j++) {
    // Минор: вычёркиваем 0-ю строку и j-й столбец
    const minor = [];
    for (let i = 1; i < n; i++) {
      const row = [];
      for (let k = 0; k < n; k++) {
        if (k !== j) row.push(matrix[i][k]);
      }
      minor.push(row);
    }
    const sign = (j % 2 === 0) ? 1 : -1;
    det += sign * matrix[0][j] * determinant(minor);
  }
  return det;
}

/**
 * Вычисляет ранг матрицы методом Гаусса.
 * Возвращает число ненулевых строк после приведения.
 */
function rank(matrix) {
  if (matrix.length === 0) return 0;

  // Работаем с копией, чтобы не портить исходную
  const a = copyMatrix(matrix);
  const rows = a.length;
  const cols = a[0].length;
  let rank = 0;

  for (let col = 0; col < cols && rank < rows; col++) {
    // Ищем опорный элемент
    let pivot = rank;
    while (pivot < rows && Math.abs(a[pivot][col]) < 1e-10) {
      pivot++;
    }
    if (pivot === rows) continue; // весь столбец нулевой

    // Меняем строки
    if (pivot !== rank) {
      [a[rank], a[pivot]] = [a[pivot], a[rank]];
    }

    // Обнуляем всё ниже
    const pivotVal = a[rank][col];
    for (let i = rank + 1; i < rows; i++) {
      const factor = a[i][col] / pivotVal;
      for (let j = col; j < cols; j++) {
        a[i][j] -= factor * a[rank][j];
      }
    }
    rank++;
  }
  return rank;
}

/**
 * Находит обратную матрицу методом Гаусса-Жордана.
 * Возвращает null, если матрица вырожденная.
 */
function inverseMatrix(matrix) {
  const n = matrix.length;
  if (!isSquare(matrix)) {
    throw new Error('Обратная матрица существует только для квадратных матриц');
  }

  // Создаём расширенную матрицу [A | E]
  const a = [];
  for (let i = 0; i < n; i++) {
    a[i] = [...matrix[i]];
    for (let j = 0; j < n; j++) {
      a[i].push(i === j ? 1 : 0);
    }
  }

  // Прямой ход + обратный (Жордан)
  for (let col = 0; col < n; col++) {
    // Поиск максимального элемента в столбце (частичный выбор)
    let maxRow = col;
    for (let i = col + 1; i < n; i++) {
      if (Math.abs(a[i][col]) > Math.abs(a[maxRow][col])) {
        maxRow = i;
      }
    }

    if (Math.abs(a[maxRow][col]) < 1e-10) {
      return null; // вырожденная
    }

    // Перестановка строк
    if (maxRow !== col) {
      [a[col], a[maxRow]] = [a[maxRow], a[col]];
    }

    // Нормализация строки
    const pivot = a[col][col];
    for (let j = 0; j < 2 * n; j++) {
      a[col][j] /= pivot;
    }

    // Обнуление остальных строк
    for (let i = 0; i < n; i++) {
      if (i === col) continue;
      const factor = a[i][col];
      for (let j = 0; j < 2 * n; j++) {
        a[i][j] -= factor * a[col][j];
      }
    }
  }

  // Извлекаем правую часть — это обратная матрица
  const inv = [];
  for (let i = 0; i < n; i++) {
    inv.push(a[i].slice(n));
  }
  return inv;
}

/**
 * Умножение двух матриц A (m×k) и B (k×n)
 */
function multiplyMatrices(A, B) {
  const m = A.length;
  const k = A[0].length;
  const n = B[0].length;

  if (k !== B.length) {
    throw new Error('Число столбцов первой матрицы должно равняться числу строк второй');
  }

  const result = Array.from({ length: m }, () => Array(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (let t = 0; t < k; t++) {
        result[i][j] += A[i][t] * B[t][j];
      }
    }
  }
  return result;
}

/**
 * Транспонирование
 */
function transpose(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
}

/**
 * Сложение / вычитание матриц (sign = +1 или -1)
 */
function addMatrices(A, B, sign = 1) {
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error('Матрицы должны быть одинакового размера');
  }
  const result = [];
  for (let i = 0; i < A.length; i++) {
    const row = [];
    for (let j = 0; j < A[0].length; j++) {
      row.push(A[i][j] + sign * B[i][j]);
    }
    result.push(row);
  }
  return result;
}

/**
 * Умножение матрицы на число
 */
function multiplyByScalar(matrix, k) {
  return matrix.map(row => row.map(val => val * k));
}
