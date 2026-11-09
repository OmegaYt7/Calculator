/**
 * vector.js
 * Операции над векторами (2D и 3D).
 */

function handleVectorOperation(op) {
  clearOutput();

  try {
    const dim = parseInt(document.getElementById('vectorDim').value);
    const a = readVector('vectorA', dim);
    const b = readVector('vectorB', dim);
    let c = null;

    // Вектор c нужен только для смешанного произведения
    if (op === 'mixed') {
      if (dim !== 3) {
        throw new Error('Смешанное произведение определено только для векторов в 3D');
      }
      c = readVector('vectorC', dim);
    }

    const k = parseFloat(document.getElementById('vectorScalar').value);

    switch (op) {
      case 'v-add':
        doVectorAdd(a, b);
        break;
      case 'v-sub':
        doVectorSub(a, b);
        break;
      case 'v-mulScalar':
        doVectorMulScalar(a, k);
        break;
      case 'dot':
        doDotProduct(a, b);
        break;
      case 'cross':
        doCrossProduct(a, b, dim);
        break;
      case 'mixed':
        doMixedProduct(a, b, c);
        break;
      case 'length':
        doLength(a);
        break;
      default:
        showError('Неизвестная операция');
    }
  } catch (e) {
    showError('Сбой: ' + e.message);
  }
}

function doVectorAdd(a, b) {
  if (a.length !== b.length) {
    throw new Error('Векторы разной размерности');
  }
  addStep('Складываем соответствующие компоненты: cᵢ = aᵢ + bᵢ');
  const result = a.map((val, i) => val + b[i]);
  showResult(`a + b = ${vectorToString(result)}`);
}

function doVectorSub(a, b) {
  if (a.length !== b.length) {
    throw new Error('Векторы разной размерности');
  }
  addStep('Вычитаем соответствующие компоненты: cᵢ = aᵢ − bᵢ');
  const result = a.map((val, i) => val - b[i]);
  showResult(`a − b = ${vectorToString(result)}`);
}

function doVectorMulScalar(a, k) {
  addStep(`Умножаем каждую компоненту на k = ${k}`);
  const result = a.map(val => val * k);
  showResult(`${k} · a = ${vectorToString(result)}`);
}

function doDotProduct(a, b) {
  if (a.length !== b.length) {
    throw new Error('Векторы разной размерности');
  }
  addStep('Скалярное произведение: a · b = Σ aᵢ · bᵢ');
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
    addStep(`  a${i + 1}·b${i + 1} = ${a[i]} · ${b[i]} = ${a[i] * b[i]}`);
  }
  const display = Math.abs(sum) < 1e-10 ? 0 : Number(sum.toFixed(8));
  showResult(`a · b = <strong>${display}</strong>`);
}

function doCrossProduct(a, b, dim) {
  if (dim !== 3) {
    throw new Error('Векторное произведение определено только в 3D');
  }
  addStep('Векторное произведение [a, b] =');
  addStep('i(aᵧb_z − a_zbᵧ) − j(aₓb_z − a_zbₓ) + k(aₓbᵧ − aᵧbₓ)');

  const cx = a[1] * b[2] - a[2] * b[1];
  const cy = a[2] * b[0] - a[0] * b[2];
  const cz = a[0] * b[1] - a[1] * b[0];

  const result = [cx, cy, cz];
  showResult(`[a, b] = ${vectorToString(result)}`);
}

function doMixedProduct(a, b, c) {
  addStep('Смешанное произведение (a, b, c) = ([a, b], c)');
  addStep('Сначала находим векторное произведение [a, b]');

  const cross = [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
  addStep(`[a, b] = ${vectorToString(cross)}`);

  addStep('Затем скалярно умножаем на c');
  const mixed = cross[0] * c[0] + cross[1] * c[1] + cross[2] * c[2];
  const display = Math.abs(mixed) < 1e-10 ? 0 : Number(mixed.toFixed(8));

  showResult(`(a, b, c) = <strong>${display}</strong>`);
  addStep('Геометрический смысл: объём параллелепипеда, построенного на a, b, c');
}

function doLength(a) {
  addStep('|a| = √(aₓ² + aᵧ² + a_z²)');
  let sumSq = 0;
  for (const val of a) {
    sumSq += val * val;
  }
  const len = Math.sqrt(sumSq);
  const display = Number(len.toFixed(8));
  showResult(`|a| = <strong>${display}</strong>`);
}
