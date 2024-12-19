// chaqirib olish
const tower1 = document.querySelector("#first");
const tower2 = document.querySelector("#second");
const tower3 = document.querySelector("#third");
let diskSelector = 0;
let minMoves = 0;
let counter = 0;

let active = false;

//DOM elementlarini qoshish
function build() {
  const diskDrop = document.getElementById("drop");
  diskSelector = diskDrop.options[diskDrop.selectedIndex].value;
  for (i = 1; i <= diskSelector; i++) {
    let diskDiv = document.createElement("div");
    diskDiv.id = "disk" + i;
    diskDiv.className = "disk";
    tower1.appendChild(diskDiv);
  }
  minMoves = 2 ** diskSelector - 1;
  document.getElementById("minimum").textContent = minMoves;
}
build();

let actions = function () {
  if (active === false && this.childElementCount === 0) {
    return;
  } else if (active === this.lastChild) {
    this.lastChild.style.borderWidth = "1px";
    active = false;
  } else if (active === false) {
    this.lastChild.style.borderWidth = "10px";
    active = this.lastChild;
  } else if (
    active.offsetWidth < this.lastChild.offsetWidth ||
    this.childElementCount === 0
  ) {
    active.style.borderWidth = "1px";
    this.appendChild(active);
    counter = counter + 1;
    document.getElementById("counter").textContent = counter;
    winner();
    active = false;
  } else {
    active.style.borderWidth = "1px";
    active = false;
  }
};
tower1.addEventListener("click", actions);
tower2.addEventListener("click", actions);
tower3.addEventListener("click", actions);
//winner modalini chiqarish
function winner() {
  if (tower3.childElementCount == diskSelector) {
    const $modal = $("#modal");
    const $endGame = $("#modal-textbox");
    $modal.css("display", "block");
    let para = document.createElement("p");
    para.id = "winner";
    $endGame.append(para);
    counter === minMoves
      ? $("#winner").text(
          `Siz minorani ${counter} harakatda o'tqazdiz! Bu ${diskSelector} disklari bilan mumkin bo'lgan eng kam.`
        )
      : $("#winner").text(
          `Siz minorani ${counter} yurish bilan tozaladingiz! Buni yana kamroq harakatlar bilan bajarishga harakat qiling. ${diskSelector} disklarini hal qilish uchun eng kami ${minMoves} ta harakatdir.`
        );
    const closeModal = () => {
      $modal.css("display", "none");
    };
    $modal.on("click", closeModal);
    tower3.removeEventListener("click", actions);
  }
}

function newGame() {
  $(".disk").remove();
  active = false;
  counter = 0;
  document.getElementById("counter").textContent = counter;
  build();

  tower3.addEventListener("click", actions);
}

function show() {
  const moves = [];

  function hanoi(n, source, target, auxiliary) {
    if (n === 1) {
      moves.push([source, target]);
      return;
    }
    hanoi(n - 1, source, auxiliary, target);
    moves.push([source, target]);
    hanoi(n - 1, auxiliary, target, source);
  }

  hanoi(diskSelector, "first", "third", "second");

  let moveIndex = 0;
  function animateMoves() {
    if (moveIndex < moves.length) {
      const [from, to] = moves[moveIndex];
      const fromTower = document.getElementById(from);
      const toTower = document.getElementById(to);

      if (fromTower.lastChild) {
        const disk = fromTower.lastChild;
        toTower.appendChild(disk);

        counter++;
        document.getElementById("counter").textContent = counter;
      }

      moveIndex++;
      setTimeout(animateMoves, 500);
    } else {
      winner();
    }
  }

  newGame();
  animateMoves();
}
