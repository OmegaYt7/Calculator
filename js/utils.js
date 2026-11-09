/**
 * utils.js
 * Вспомогательные функции: чтение/запись матриц и векторов,
 * красивый вывод, работа с сообщениями об ошибках и шагах.
 */

// ---------- Работа с DOM ----------

/** Очистить блоки шагов, результата и ошибки */
function clearOutput() {
  document.getElementById('steps').innerHTML = '';
  document.getElementById('result').innerHTML = '';
  const err = document.getElementById('error');
  err.classList.remove('show');
  err.textContent = '';
}

/** Добавить строку в блок промежуточных шагов */
function addStep(text) {
  const steps = document.getElementById('steps');
  steps.innerHTML += text + '\n';
  steps.scrollTop = steps.scrollHeight;
}

/** Показать итоговый результат (может содержать HTML) */
function showResult(html) {
  document.getElementById('result').innerHTML = html;
}

/** Показать сообщение об ошибке */
function showError(message) {
  const err = document.getElementById('error');
  err.textContent = message;
  err.classList.add('show');
}

// ---------- Чтение матрицы из DOM ----------

/**
 * Считывает матрицу из контейнера с input-полями.
 * @param {string} containerId - id div-а с input-ами
 * @param {number} rows
 * @param {number} cols
 * @returns {number[][]} матрица
 */
function readMatrix(containerId, rows, cols) {
  const container = document.getElementById(containerId);
  const inputs = container.querySelectorAll('input');
  const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const val = parseFloat(inputs[i * cols + j].value);
      if (isNaN(val)) {
        throw new Error(`Некорректное число в матрице (строка ${i + 1}, столбец ${j + 1})`);
      }
      row.push(val);
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Создаёт input-поля для матрицы заданного размера.
 */
function createMatrixInputs(containerId, rows, cols) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${cols}, 70px)`;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.step = 'any';
      input.value = '0';
      input.dataset.row = i;
      input.dataset.col = j;
      // Чтобы можно было вводить и с клавиатуры, и мышкой
      input.addEventListener('focus', () => input.select());
      container.appendChild(input);
    }
  }
}

// ---------- Чтение вектора ----------

function readVector(containerId, dim) {
  const container = document.getElementById(containerId);
  const inputs = container.querySelectorAll('input');
  const vec = [];

  for (let i = 0; i < dim; i++) {
    const val = parseFloat(inputs[i].value);
    if (isNaN(val)) {
      throw new Error(`Некорректное число в векторе (компонента ${i + 1})`);
    }
    vec.push(val);
  }
  return vec;
}

function createVectorInputs(containerId, dim) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${dim}, 70px)`;

  for (let i = 0; i < dim; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.step = 'any';
    input.value = '0';
    input.addEventListener('focus', () => input.select());
    container.appendChild(input);
  }
}

// ---------- Красивый вывод ----------

/**
 * Превращает матрицу в HTML-таблицу для красивого отображения.
 */
function matrixToHTML(matrix, name = '') {
  if (!matrix || matrix.length === 0) return '';

  let html = name ? `<strong>${name}</strong><br>` : '';
  html += '<div class="matrix-print"><table>';

  for (const row of matrix) {
    html += '<tr>';
    for (const val of row) {
      // Округляем очень маленькие числа до нуля (из-за погрешности float)
      const display = Math.abs(val) < 1e-10 ? 0 : Number(val.toFixed(6));
      html += `<td>${display}</td>`;
    }
    html += '</tr>';
  }
  html += '</table></div>';
  return html;
}

/**
 * Превращает вектор в строку вида (x, y, z)
 */
function vectorToString(vec) {
  const rounded = vec.map(v => Math.abs(v) < 1e-10 ? 0 : Number(v.toFixed(6)));
  return '(' + rounded.join(', ') + ')';
}

/**
 * Копия матрицы (глубокая)
 */
function copyMatrix(m) {
  return m.map(row => [...row]);
}

/**
 * Проверка, что матрица квадратная
 */
function isSquare(matrix) {
  return matrix.length > 0 && matrix.length === matrix[0].length;
}
