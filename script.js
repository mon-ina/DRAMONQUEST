// 味方のステータス
const allies = [
  {
    name: "勇者",
    hp: 100,
    maxHp: 100,
    mp:100,
    maxMp:100,
    element: document.getElementById("ally1Hp"),
    element2: document.getElementById("ally1Mp"),
    action: null,
    image: ["img/yusya.jpeg","img/yusya_died.jpeg"],
    blinking:true,  
    specialSkill: {
      name: "半月切り",
      isCharging: false,
      isReadyToAttack: false,
      damage: () => Math.floor(Math.random() * 50) + 100
    }
  },
  {
    name: "魔法使い",
    hp: 100,
    maxHp: 100,
    mp:100,
    maxMp:100,
    element: document.getElementById("ally2Hp"),
    element2: document.getElementById("ally2Mp"),
    action: null,
    image: ["img/mahou.jpeg","img/mahou_died.jpeg"],
    blinking:true,  
    specialSkill: { name: "メラメーラ", damage: () => Math.floor(Math.random() * 30) + 50 }
  },
  {
    name: "踊り子",
    hp: 100,
    maxHp: 100,
    mp:100,
    maxMp:100,
    element: document.getElementById("ally3Hp"),
    element2: document.getElementById("ally3Mp"),
    action: null,
    image: ["img/dance.jpeg","img/dance_died.jpeg"],
    blinking:true,  
    specialSkill: { name: "テクニカルステップ", damage: () => Math.floor(Math.random() * 100) + 0 }
  }
];

// 敵のステータス
const enemy = {
  name: "魔王",
  hp: 600,
  maxHp: 600,
  element: document.getElementById("enemyHp"),
  image: ["img/maou.jpeg", "img/maou_diedimage.jpeg"], // 敵の通常時とやられた時の画像
  blinking: true
  
};


// 各キャラクターの画像を設定する関数
function setCharacterImages() {
  //allies.forEach() で味方キャラを1体ずつ処理する
  allies.forEach((ally, index) => {
    const imgElement = document.getElementById(`ally${index + 1}Image`);
    if (imgElement) {
      if (ally.hp <= 0) {
        imgElement.src = ally.image[1]; // やられた時の画像
      } else {
        imgElement.src = ally.image[0]; // 生きている時の画像
      }
    } else {
      //エラーメッセージ
      console.log(`Image element for ally${index + 1} not found`);
    }
  });

  // 敵の画像を設定
  const enemyImageElement = document.getElementById("enemyImage");
  if (enemyImageElement) {
    if (enemy.hp <= 0) {
      enemyImageElement.src = enemy.image[1]; // 敵がやられた時の画像
    } else {
      enemyImageElement.src = enemy.image[0]; // 敵が生きている時の画像
    }
  } else {
    //エラーメッセージ
    console.log(`Image element for enemy not found`);
  }
}


// ページ読み込み時に画像を設定
document.addEventListener("DOMContentLoaded", setCharacterImages);

const textArea = document.getElementById("textArea");
const optionsDiv = document.getElementById("options");
const arrows = document.querySelectorAll(".character-arrow");
let currentAllyIndex = 0;
let battleEnded = false;

console.log(arrows);

//矢印関数
function updateCharacterSelection() {
  console.log("none");

  // すべての矢印を非表示
  document.querySelectorAll(".character-arrow").forEach(arrow => arrow.style.display = 'none');

  // 現在のキャラクターの矢印を表示
  const allyElement = document.querySelectorAll(".ally")[currentAllyIndex]; // キャラのHTML要素を取得
  
  if (allyElement) {
    const arrow = allyElement.querySelector('.character-arrow');
  if (arrow) {
      console.log(currentAllyIndex);
      arrow.style.display = 'block';
    }
  
  }
}



//行動選択
function selectActionForCurrentAlly() {
  const ally = allies[currentAllyIndex];

  if (ally.name === "勇者" && ally.specialSkill.isCharging && ally.specialSkill.isReadyToAttack) {
    performAction(ally).then(() => {
      console.log("半月切り");
      currentAllyIndex++;
      checkNextAction();

    });
  } else {
    updateCharacterSelection();
    showOptions(["攻撃", "特技", "アイテム", "逃げる"]);
  }
}

// 初期化時にはinitialSetupフラグをtrueに設定して呼び出し
function initializeBattle() {
  //HPバーをUIに反映、trueを渡すことで戦闘開始時にHPをリセットして表示
  updateHpBar(enemy, true);
  allies.forEach(ally => updateHpBar(ally, true));
  
  // 行動可能なキャラクターを探す、HP0のキャラクターはスキップ
  while (currentAllyIndex < allies.length && (allies[currentAllyIndex].hp <= 0 || isChargingAndNotReady(allies[currentAllyIndex]))) {
    currentAllyIndex++;
  }

  //全員が戦闘不能
  if (currentAllyIndex >= allies.length) {
    textArea.textContent = "魔王「出直して来やがれ」";
    stopBGM();
    loseSound();
    battleEnded = true;
    return; 
  }

  selectActionForCurrentAlly();
}

// HPバーの更新関数
function updateHpBar(character, initialSetup = false) {
  const hpPercentage = (character.hp / character.maxHp) * 100;
  character.element.style.width = `${hpPercentage}%`;

  //HP数値の更新
  const hpNumElement = document.getElementById(`ally${allies.indexOf(character) + 1}HpNum`);
  if (hpNumElement){
    hpNumElement.textContent = `${character.hp}/${character.maxHp}`;
  }


  //ダメージ時の点滅、 初期設定時には点滅させない
  if (!initialSetup && character.hp < character.maxHp && character.blinking) {
      const imageId = character === enemy ? 'enemyImage' : `ally${allies.indexOf(character) + 1}Image`;
      startBlinking(imageId, 500, 50); // 0.5秒間点滅、50ミリ秒ごとに
  }
  
  setCharacterImages();
}

// Mpバーの更新関数
function updateMpBar(character) {
  const mpPercentage = (character.mp / character.maxMp) * 100;
  character.element2.style.width = `${mpPercentage}%`;

  //MP数値の更新
  const mpNumElement = document.getElementById(`ally${allies.indexOf(character) + 1}MpNum`);
  if (mpNumElement){
    mpNumElement.textContent = `${character.mp}/${character.maxMp}`;
  }
}

function isChargingAndNotReady(ally) {
  return ally.name === "勇者" && ally.specialSkill.isCharging && !ally.specialSkill.isReadyToAttack;
}




//アイテムリスト
const items = [
  { name: "薬草", effect: "HP回復" },
  { name: "ポーション", effect: "MP回復" },
  { name: "エリクサー", effect: "両方回復" }
];

//アイテム選択表示
function showItemOptions() {
  
  optionsDiv.innerHTML = ""; // 選択肢をリセット
  optionsDiv.classList.remove("hidden"); // 表示

  // 戻るボタンを追加
  const backButton = document.createElement("button");
  backButton.textContent = "戻る";
  backButton.addEventListener("click", () => {
    optionsDiv.classList.add("hidden"); // 選択肢を非表示
    selectActionForCurrentAlly(); // 元の行動選択画面に戻る
  });
  optionsDiv.appendChild(backButton);

  items.forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = item.name;
    btn.addEventListener("click", () => {
      selectItem(item);
    });
    optionsDiv.appendChild(btn);
  });
}

//アイテム選択
function selectItem(item) {
  optionsDiv.classList.add("hidden"); // 選択肢を非表示
  hideTooltip();//選択終了時に説明を非表示
  const ally = allies[currentAllyIndex];
  ally.action = item; // アイテムをアクションとして設定

  setTimeout(() => {
    textArea.textContent = `${ally.name}は「${item.name}」を選択！`;
    setTimeout(() => {
      currentAllyIndex++;
      checkNextAction();
    }, 500); // 次のアクションを0.5秒後に開始
  }, 0);
}


//アイテム使用
function useItem(ally, item) {
  hideTooltip();//選択終了時に説明を非表示
  let messages = [];

  switch (item.effect) {
    case "HP回復":
      applyHpHeal(ally, messages, item.name);
      break;
    case "MP回復":
      applyMpHeal(ally, messages, item.name);
      break;
    case "両方回復":
      applyBothHeal(ally, messages, item.name);
      break;
  }

  return messages;
}

function applyHpHeal(ally, messages, itemName) {
  ally.blinking = false;
  const hpHealAmount = Math.floor(Math.random() * 40) + 40;
  ally.hp = Math.min(ally.maxHp, ally.hp + hpHealAmount);
  recoverySound();
  updateHpBar(ally);
  messages.push(`${ally.name}は${itemName}を使った！ HPが${hpHealAmount}回復した！`);
  ally.blinking = true;
}

function applyMpHeal(ally, messages, itemName) {
  const mpHealAmount = Math.floor(Math.random() * 30) + 30;
  ally.mp = Math.min(ally.maxMp, ally.mp + mpHealAmount);
  recoverySound();
  updateMpBar(ally);
  messages.push(`${ally.name}は${itemName}を使った！ MPが${mpHealAmount}回復した！`);
}

function applyBothHeal(ally, messages, itemName) {
  ally.blinking = false;
  const bothHpHealAmount = Math.floor(Math.random() * 10) + 30;
  const bothMpHealAmount = Math.floor(Math.random() * 20) + 20;
  ally.hp = Math.min(ally.maxHp, ally.hp + bothHpHealAmount);
  ally.mp = Math.min(ally.maxMp, ally.mp + bothMpHealAmount);
  recoverySound();
  updateHpBar(ally);
  updateMpBar(ally);
  messages.push(`${ally.name}は${itemName}を使った！ HPが${bothHpHealAmount}、MPが${bothMpHealAmount}回復した！`);
  ally.blinking = true;
}


function displayMessagesSequentially(messages, callback) {
  let index = 0;
  const displayNextMessage = () => {
    if (index < messages.length) {
      textArea.textContent = messages[index];
      index++;
      setTimeout(displayNextMessage, 1500);
    } else {
      callback();
    }
  };
  displayNextMessage();
}

// ツールチップの表示と非表示の関数
function showTooltip(event, message) {
  const tooltip = document.getElementById('tooltip');
  tooltip.style.left = '10px'; // 左から10pxに固定
  tooltip.style.top = '10px';  // 上から10pxに固定
  tooltip.textContent = message;
  tooltip.style.display = 'block';
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  tooltip.style.display = 'none';
}

// 選択肢表示エリアのボタン生成関数
function showOptions(options) {
  optionsDiv.innerHTML = ""; // 選択肢をリセット
  optionsDiv.classList.remove("hidden"); // 表示

  const ally = allies[currentAllyIndex]; // 現在のキャラクターを取得

  options.forEach(option => {
    const btn = document.createElement("button"); //それぞれに対して button 要素を作成
    let tooltipText;

    if (option === "特技") {
      btn.textContent = ally.specialSkill.name; //特技名をボタンに設定
      // 特技の説明を設定
      if (ally.specialSkill.name === "半月切り"){
        tooltipText = "半月切り：母直伝の必殺奥義\n\n・ターンの終わりに強力な一撃を放つ\n・その代わり１ターン疲労で動けなくなってしまう\n\n１００～１５０ダメージ　ＭＰー４０";
      }
      else if (ally.specialSkill.name === "メラメーラ"){
        tooltipText = "メラメーラ：火炎攻撃魔法\n\n・摩擦熱で火をおこし攻撃する\n・自分も燃えちゃうので注意\n\n５０～８０ダメージ　自傷２０ダメージ　ＭＰー３０";
      }
      else if (ally.specialSkill.name === "テクニカルステップ"){
        tooltipText = "テクニカルステップ：その名の通りの技\n\n・華麗なステップで攻撃する\n・不慣れなため転ぶ恐れがあるので注意\n\n０～１００ダメージ　ＭＰー３０";
      }
      
      btn.addEventListener("click", () => {
        handleOption(ally.specialSkill.name); // 特技の名前を渡す
      });
    } else if (option === "攻撃"){
      btn.textContent = option;
      tooltipText = "攻撃：シンプルに殴る\n\n３０ダメージ";
      btn.addEventListener("click", () => {
        handleOption(option);
      });
    } else if (option === "アイテム"){
      btn.textContent = option;
      tooltipText = "アイテム：いずれかを選択\n\n薬草：ＨＰを４０～８０回復\n\nポーション：ＭＰを３０～６０回復\n\nエリクサー：ＨＰを３０～４０回復、ＭＰを２０～４０回復"; // 各選択肢の説明を設定
      btn.addEventListener("click", () => {
        handleOption(option);
      });
    } else if (option === "逃げる"){
      btn.textContent = option;
      tooltipText = "逃げる：逃げちゃおう\n\n・逃げることも時には人生において大切なのです。";
      btn.addEventListener("click", () => {
        handleOption(option);
      });
    }

    // ツールチップのイベントリスナーを追加
    btn.setAttribute('data-tooltip', tooltipText);
    //マウスが上に来た時
    btn.addEventListener('mouseenter', (event) => {
      const message = btn.getAttribute('data-tooltip');
      showTooltip(event, message);
    });
    //マウスが離れた時
    btn.addEventListener('mouseleave', () => {
      hideTooltip();
    });

    optionsDiv.appendChild(btn);
  });

  // 選択してくださいメッセージの表示
  setTimeout(() => {
    textArea.textContent = `${ally.name}の行動を選択してください！`;
  }, 0); // ボタンを表示した直後にメッセージを更新するために0秒後に表示
}


// オプション処理
function handleOption(option) {
  optionsDiv.classList.add("hidden"); // 選択肢を非表示
  const ally = allies[currentAllyIndex];
  //戦闘不能チェック
  if (ally.hp <= 0) {
    currentAllyIndex++; //0以下ならスキップ
    checkNextAction();
    return;
  }

  if (option === "逃げる") {
    //矢印非表示
    document.querySelectorAll(".character-arrow").forEach(arrow => arrow.style.display = 'none');
    textArea.textContent = "パーティは試験から逃げ出した！"
    //1秒後bgmをストップ
    setTimeout(()=>{
      stopBGM();
      textArea.textContent = "魔王「逃げれると思ったか」";  
      //2秒後に全滅
      setTimeout(()=>{
        battleEnded = true;
        let damage = 100;
        allies.forEach(ally => {
          ally.hp = Math.max(0, ally.hp - damage); //HPがマイナスにならないように
          updateHpBar(ally);
        });
        damageSound();
        textArea.textContent = "全滅しました..."
        loseSound();
  
      },2000);
      
    },1000);
        
    return;
  }

  if (option === "アイテム") {
    showItemOptions(); // アイテム選択画面を表示
    return;
  }

  if (ally.name === "勇者" && option === "半月切り") {
    ally.specialSkill.isCharging = true;
    ally.specialSkill.isReadyToAttack = false;
    ally.action = "ためる"; // ため状態に設定
  } else {
    ally.action = option; // その他
  }

  setTimeout(() => {
    textArea.textContent = `${ally.name}は「${option}」を選択！`;
    setTimeout(() => {
      currentAllyIndex++;
      checkNextAction();
    }, 500); // 次のアクションを0.5秒後に開始
  }, 0);
}

//戦闘の進行関数
function checkNextAction() {
  if(battleEnded){
    return;
  }
  // 行動可能キャラを探す
  while (currentAllyIndex < allies.length && allies[currentAllyIndex].hp <= 0) {
    currentAllyIndex++;
  }
  //行動可能な味方がいるかチェック
  if (currentAllyIndex < allies.length) {
    selectActionForCurrentAlly();
  } else {
    document.querySelectorAll(".character-arrow").forEach(arrow => arrow.style.display = 'none');
    setTimeout(executeActions, 1000);
  }
}

// 行動実行
function executeActions() {
  currentAllyIndex = 0; // 最初のキャラにセット
  allies.reduce((promise, ally) => {
    return promise.then(() => {
      if (enemy.hp <= 0) {
        return Promise.resolve(); // 敵の体力がゼロ以下なら即座に終了
      }
      return performAction(ally);
    });
  }, Promise.resolve()).then(() => {
    if (enemy.hp > 0) {
      executeEnemyAction();
    } 
  });
}

//勝利関数
function checkVictory(messages, resolve) {
  const displayVictoryMessage = () => {
    if (enemy.hp <= 0 && !battleEnded) {
      console.log("勝ち");
      setTimeout(()=>{messages.push("魔王を倒した！ 勝利です！");
      battleEnded = true;
      stopBGM(); // バトルが終了したらBGMを停止
      winSound(); // 勝利メッセージが表示される直前に勝利音を再生
        setTimeout(()=>{
          messages.push("魔王「俺の負けだ...」");
        },1500);
      },1500);
    }
    displayNextMessage();
  };

  let index = 0;
  const displayNextMessage = () => {
    if (index < messages.length) {
      textArea.textContent = messages[index];
      index++;
      setTimeout(displayNextMessage, 1500);
    } else {
      resolve();
    }
  };

  displayVictoryMessage();
}

function performAction(ally) {
  return new Promise(resolve => {
    if (ally.hp <= 0 || enemy.hp <= 0) {
      resolve();
      return;
    }

    let messages = [];

    if (ally.action && ally.action.name) {
      messages = useItem(ally, ally.action); // アイテム使用
      ally.action = null; // アクションをリセット
      displayMessagesSequentially(messages, resolve);
      return;
    }

    // 半月切り
    if (ally.name === "勇者" && ally.specialSkill.isCharging) {
      if (ally.mp >= 40) {
        if (ally.specialSkill.isReadyToAttack) {
          const damage = ally.specialSkill.damage();
          enemy.hp = Math.max(0, enemy.hp - damage);
          ally.mp = Math.max(0, ally.mp - 40);
          updateMpBar(ally);
          superattackSound();
          updateHpBar(enemy);
          messages.push(`${ally.name}の半月切り！ 魔王に${damage}ダメージ！`);
          ally.specialSkill.isCharging = false;
          ally.specialSkill.isReadyToAttack = false;
          ally.action = null;
          checkVictory(messages, resolve);
          return;
        } else {
          ally.specialSkill.isReadyToAttack = true;
          messages.push(`${ally.name}は力を溜めている！`);
          chargeSound();
        }
      } else {
        messages.push(`しかし${ally.name}はMPが足りなかった！`);
        ally.specialSkill.isCharging = false;
        ally.specialSkill.isReadyToAttack = false;
        ally.action = null;
      }
    } else if (ally.specialSkill.isCharging === false && ally.specialSkill.isReadyToAttack === false && (ally.action != "攻撃" && ally.action != "アイテム")) {
      messages.push(`${ally.name}は疲れて動けない！`);
      debuffSound();
    }
    // メラメーラ
    else if (ally.name === "魔法使い" && ally.action === ally.specialSkill.name) {
      if (ally.mp >= 30) {
        const damage = ally.specialSkill.damage();
        enemy.hp = Math.max(0, enemy.hp - damage);
        ally.mp = Math.max(0, ally.mp - 30);
        updateMpBar(ally);
        updateHpBar(enemy);
        superattackSound();
        ally.hp = Math.max(0, ally.hp - 20);
        updateHpBar(ally);
        messages.push(`${ally.name}の${ally.specialSkill.name}！ 魔王に${damage}ダメージ！`);
        messages.push(`${ally.name}も燃えてしまった！${ally.name}に20ダメージ`);
        checkVictory(messages, resolve);
        return;
      } else {
        messages.push(`しかし${ally.name}はMPが足りなかった！`);
        ally.action = null;
      }
    }
    // 通常攻撃
    else if (ally.action === "攻撃") {
      const damage = 30;
      enemy.hp = Math.max(0, enemy.hp - damage);
      attackSound();
      updateHpBar(enemy);
      messages.push(`${ally.name}の攻撃！ 魔王に${damage}ダメージ！`);
      checkVictory(messages, resolve);
      return;
    }
    // 他の特技
    else if (ally.action === ally.specialSkill.name) {
      if (ally.mp >= 30) {
        const damage = ally.specialSkill.damage();
        enemy.hp = Math.max(0, enemy.hp - damage);
        ally.mp = Math.max(0, ally.mp - 30);
        updateMpBar(ally);
        superattackSound();
        updateHpBar(enemy);
        messages.push(`${ally.name}の${ally.specialSkill.name}！ 魔王に${damage}ダメージ！`);
        checkVictory(messages, resolve);
        return;
      } else {
        messages.push(`しかし${ally.name}はMPが足りなかった！`);
        ally.action = null;
      }
    }
    
    // メッセージを順番に表示する関数
    let index = 0;
    const displayNextMessage = () => {
      if (index < messages.length) {
        textArea.textContent = messages[index];
        index++;
        setTimeout(displayNextMessage, 1500);
      } else {
        resolve();
      }
    };

    displayNextMessage();
  });
}

function isChargingAndNotReady(ally) {
  return ally.name === "勇者" && ally.specialSkill.isCharging && !ally.specialSkill.isReadyToAttack;
}


// 魔王の行動
function executeEnemyAction() {
  textArea.textContent = "魔王のターン！";
  rand = Math.random() < 0.3 ? 1 :0;
  setTimeout(() => {
    const availableTargets = allies.filter(ally => ally.hp > 0);
    if (availableTargets.length === 0) {
      textArea.textContent = "魔王「出直して来やがれ」";
      stopBGM();
      loseSound();
      battleEnded = true;
      return;
    }

    if (rand === 0) {
      console.log("１");
      const target = availableTargets[Math.floor(Math.random() * availableTargets.length)];
      const damage = Math.floor(Math.random() * 44) + 55;
      target.hp = Math.max(0, target.hp - damage);
      enemyattackSound();
      updateHpBar(target);
      textArea.textContent = `魔王の攻撃！ ${target.name}に${damage}ダメージ！`;

    } else if (rand === 1 ) {
      console.log("２");
      const damage = 50;
      availableTargets.forEach(target => {
        target.hp = Math.max(0, target.hp - damage);
        updateHpBar(target);
      });
      enemyattackSound();
      textArea.textContent = `魔王の 滅びのマオウストリーム！ 全員に${damage}ダメージ！`;
    }
  

    setTimeout(() => {
      // 次のターン開始
      if (!battleEnded) {
        currentAllyIndex = 0;
        initializeBattle();
      }
    }, 2000);
  }, 1500);
}


let blinkIntervals = {}; // 各キャラクターに対して点滅インターバルを保存

function startBlinking(imageId, duration, interval) {
    const image = document.getElementById(imageId);
    let blinkCount = 0;
    clearInterval(blinkIntervals[imageId]); // 既存の点滅をクリア

    blinkIntervals[imageId] = setInterval(() => {
        if (image.style.opacity === '0') {
            image.style.opacity = '1';
        } else {
            image.style.opacity = '0';
        }
        blinkCount += 1;
        if (blinkCount === duration / interval) {
            clearInterval(blinkIntervals[imageId]);
            image.style.opacity = '1';
        }
      }, interval);
}


//クリック効果音
document.addEventListener('DOMContentLoaded',(event)=>{
  const buttonAll = document.getElementById('buttonAll');
  const soundClick = document.getElementById('soundClick');

  buttonAll.addEventListener('click',()=>{
    soundClick.play();
  });
});

// 共通の効果音再生関数
function playSound(id, volume = 1.0) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.volume = volume;
    sound.currentTime = 0;
    sound.play();
  }
}

// 各種効果音関数
function attackSound() { playSound("attackSound"); }//通常攻撃音
function superattackSound() { playSound("superattackSound"); }//特殊攻撃音
function damageSound() { playSound("damageSound"); }//ダメージ音
function recoverySound() { playSound("recoverySound"); }//回復音
function enemyattackSound() { playSound("enemyattackSound"); }//敵の攻撃音
function chargeSound() { playSound("chargeSound", 0.6); }//チャージ音(ボリュームが大きいので0.6にしてる)
function debuffSound() { playSound("debuffSound", 0.6); }//疲労音(ボリュームが大きいので0.6にしてる)
function loseSound() { playSound("loseSound"); }//敗北音
function winSound() { playSound("winSound"); }//勝利音

// バトル終了時にBGMを停止する関数
function stopBGM() {
  const bgm = document.getElementById('bgm');
  if (bgm) {
    bgm.pause();
    bgm.currentTime = 0; // 曲の再生位置をリセット
  }
}
//bgm
document.addEventListener('DOMContentLoaded', (event) => {
  const bgm = document.getElementById('bgm');

  document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
          const playPromise = bgm.play();
          if (playPromise !== undefined) {
              playPromise.then(() => {
                  console.log("BGM is playing");
              }).catch(error => {
                  console.log("BGM auto-play was prevented. Handling accordingly.");
              });
          }
      }
  });
});



// バトル開始
initializeBattle();
