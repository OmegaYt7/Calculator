/**
 * slae.js
 * Решение систем линейных алгебраических уравнений
 * тремя методами: Гаусса, Крамера, матричным.
 */

function handleSlaeOperation(op) {
  clearOutput();

  try {
    const n = parseInt(document.getElementById('slaeN').value);
    // Читаем расширенную матрицу [A|b] размера n × (n+1)
    const extended = readMatrix('slaeMatrix', n, n + 1);

    // Разделяем на коэффициенты A и свободные члены b
    const A = [];
    const b = [];
    for (let i = 0; i < n; i++) {
      A.push(extended[i].slice(0, n));
      b.push(extended[i][n]);
    }

    switch (op) {
      case 'gauss':
        solveGauss(A, b);
        break;
      case 'cramer':
        solveCramer(A, b);
        break;
      case 'matrixMethod':
        solveMatrixMethod(A, b);
        break;
      default:
        showError('Неизвестный метод');
    }
  } catch (e) {
    showError('Сбой: ' + e.message);
  }
}

/**
 * Метод Гаусса с выводом всех шагов
 */
function solveGauss(A, b) {
  const n = A.length;
  addStep('=== Метод Гаусса ===');
  addStep('Составляем расширенную матрицу [A|b]');

  // Копия расширенной матрицы
  const a = [];
  for (let i = 0; i < n; i++) {
    a.push([...A[i], b[i]]);
  }

  // Прямой ход
  for (let col = 0; col < n; col++) {
    // Поиск максимального элемента
    let maxRow = col;
    for (let i = col + 1; i < n; i++) {
      if (Math.abs(a[i][col]) > Math.abs(a[maxRow][col])) {
        maxRow = i;
      }
    }

    if (Math.abs(a[maxRow][col]) < 1e-10) {
      // Проверяем, есть ли ненулевой свободный член
      let inconsistent = false;
      for (let i = col; i < n; i++) {
        if (Math.abs(a[i][n]) > 1e-10) {
          inconsistent = true;
          break;
        }
      }
      if (inconsistent) {
        throw new Error('Система несовместна (нет решений)');
      }
      addStep(`Столбец ${col + 1}: все элементы нулевые — система имеет бесконечно много решений`);
      showResult('Система имеет бесконечно много решений');
      return;
    }

    // Перестановка
    if (maxRow !== col) {
      [a[col], a[maxRow]] = [a[maxRow], a[col]];
      addStep(`Меняем местами строки ${col + 1} и ${maxRow + 1}`);
    }

    // Нормализация и обнуление
    const pivot = a[col][col];
    for (let j = col; j <= n; j++) {
      a[col][j] /= pivot;
    }
    addStep(`Делим строку ${col + 1} на ведущий элемент ${pivot.toFixed(4)}`);

    for (let i = 0; i < n; i++) {
      if (i === col) continue;
      const factor = a[i][col];
      if (Math.abs(factor) < 1e-10) continue;
      for (let j = col; j <= n; j++) {
        a[i][j] -= factor * a[col][j];
      }
      addStep(`Вычитаем из строки ${i + 1} строку ${col + 1}, умноженную на ${factor.toFixed(4)}`);
    }
  }

  // Обратный ход уже выполнен (привели к единичной)
  const x = a.map(row => row[n]);
  addStep('Система приведена к диагональному виду');
  showResult(formatSolution(x));
}

/**
 * Метод Крамера
 */
function solveCramer(A, b) {
  const n = A.length;
  addStep('=== Метод Крамера ===');

  const detA = determinant(A);
  addStep(`Главный определитель Δ = ${detA.toFixed(6)}`);

  if (Math.abs(detA) < 1e-10) {
    throw new Error('Главный определитель равен нулю — метод Крамера неприменим');
  }

  const x = [];
  for (let i = 0; i < n; i++) {
    // Заменяем i-й столбец на столбец свободных членов
    const Ai = copyMatrix(A);
    for (let row = 0; row < n; row++) {
      Ai[row][i] = b[row];
    }
    const detAi = determinant(Ai);
    x[i] = detAi / detA;
    addStep(`Δ${i + 1} = ${detAi.toFixed(6)}  →  x${i + 1} = Δ${i + 1}/Δ = ${x[i].toFixed(6)}`);
  }

  showResult(formatSolution(x));
}

/**
 * Матричный метод: x = A⁻¹ · b
 */
function solveMatrixMethod(A, b) {
  const n = A.length;
  addStep('=== Матричный метод ===');
  addStep('Решение ищем в виде x = A⁻¹ · b');

  const inv = inverseMatrix(A);
  if (inv === null) {
    throw new Error('Матрица коэффициентов вырожденная — обратной не существует');
  }
  addStep('Обратная матрица найдена');

  // Умножаем A⁻¹ на столбец b
  const x = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += inv[i][j] * b[j];
    }
    x.push(sum);
  }

  showResult(formatSolution(x));
}

/**
 * Красиво выводит решение
 */
function formatSolution(x) {
  let html = '<strong>Решение:</strong><br>';
  x.forEach((val, i) => {
    const display = Math.abs(val) < 1e-10 ? 0 : Number(val.toFixed(8));
    html += `x<sub>${i + 1}</sub> = ${display}<br>`;
  });
  return html;
}
