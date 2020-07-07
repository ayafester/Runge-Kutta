function randP(min, max){ //возвращает рандомную точку
  return [Math.random() * (max - min) + min, Math.random() * (max - min) + min];
}
function distance(A, P) { //вычисление длины(нормы) между точками
  return Math.sqrt(Math.pow((A[0] - P[0]), 2) + Math.pow((A[1] - P[1]), 2));
}

function func(A, P) { // вычсление точки Р
  let c = distance(A, P);
  return [(A[0]-P[0])/c, (A[1]-P[1])/c];
}

function krugA(currentAngle, rad) { // точки круга. против часовой стрелки(осьУ направлена вниз)
  return [Math.cos(-currentAngle) * rad, Math.sin(-currentAngle) * rad]; // точки окружности А
}

function rungeKutta(Ao, Po, h) {

  Po = [].concat(Po);
  let temp = func(Ao, Po);
  let temp2 = [];

  Ao[0] += h;
  Ao[1] += h;
  temp2.push(Ao);

  Po[0] += h*temp[0];
  Po[1] += h*temp[1];
  temp2.push(Po);

  return temp2;
}


function error(max, p) { //погрешность метода
  return max/(Math.pow(2, p)-1);
}

function setka(h, A, Ao, Po, t, currentAngle, rad, finish, tempDist, temp) {
  let pointsA = new Array();
  let pointsP = new Array();

  do {
  t += 1;
  //console.log("t: "+ t + " Po: " + Po + " Ao: " + A);
  currentAngle += h;
  pointsA.push(A);
  pointsP.push(Po);
  tempDist = distance(A, Po);
  A = krugA(currentAngle, rad); //рассчитали точки А
  Ao = [].concat(A);
  temp = rungeKutta(Ao, Po, h);
  Ao = temp[0];
  Po = temp[1];
  } while ( tempDist > finish)

  let points = [pointsA, pointsP];
  return points;
}

function distPoints(setka1, setka2) {
  let distancePointsP = [];
  let max;
  for(let i = 0; i<setka1.length; i++) {
    let d = distance(setka1[i], setka2[i]);
    distancePointsP.push(d);
  }
  distancePointsP.sort();
  max = distancePointsP[distancePointsP.length - 1]
  return max;
}

function main() {
  let Po = randP(-0.5, 0.5); // начальная точка Р
  let A = [1,0];
  let Ao = [1,0]; // заданная начальная точка А
  let t = 0; //начальное время
  let rad = 1; //радиус окружности
  let currentAngle = 0;
  let tempDist, temp;
  let finish = distance(Ao,Po)/10; //конечное расстояние


  console.log("Расстояние между точками для остановки: " + finish);
  console.log("Взяли шаг h = 0.1. Для погрешности меньше 0.001, дошли до шага h/12");
  let h = 0.1;

  let setka1 = setka(h/10, A, Ao, Po, t, currentAngle, rad, finish, tempDist, temp);
  let setka1P = setka1[1];
  let setka1A = setka1[0];
  let setka2 = setka(h/12, A, Ao, Po, t, currentAngle, rad, finish, tempDist, temp);
  let setka2P = setka2[1];
  let setka2A = setka2[0];

  console.log("Сетка P с шагом h/12, точки: " + setka2P.length);
  console.log("Сетка A: " + setka2A.length);

  let err = error(distPoints(setka1P, setka2P), 12);
  console.log("Погрешность: "+ err);
  return setka2;
}

let ctx = document.getElementById('canvas').getContext('2d');
let points = main();


for(let i=0; i<points[0].length; i++) { //масштабирование

  points[0][i][0] *= 1000;
  points[0][i][1] *= 1000;
  points[1][i][0] *= 1000;
  points[1][i][1] *= 1000;
}

let i = 0;

let timeP = setInterval( function() {
  ctx.fillRect(1500 + points[1][i][0], 1500 + points[1][i][1], 10, 10); //P
  i = i+1;
  ctx.fillStyle = 'red';
  ctx.stroke();
  if (i == points[0].length) {
    clearInterval(timeP);
  }
}, 20);

let k = 0;
let timeA = setInterval( function() {
  ctx.fillRect(1500 + points[0][k][0], 1500 + points[0][k][1], 10, 10); //krug
  k = k+1;
  ctx.fillStyle = 'blue';
  ctx.stroke();
  if (i == points[0].length) {
    clearInterval(timeA);
  }
}, 20);
