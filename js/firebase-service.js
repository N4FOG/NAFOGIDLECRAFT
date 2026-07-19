import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, orderBy, limit, serverTimestamp, onSnapshot, increment, runTransaction } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCf0MilY-r6vU-KFfKJSbdoCAHsM70OxFI",
  authDomain: "nafog-idle-game.firebaseapp.com",
  projectId: "nafog-idle-game",
  storageBucket: "nafog-idle-game.firebasestorage.app",
  messagingSenderId: "226847752658",
  appId: "1:226847752658:web:40eaa38ae4e29ab125880b",
  measurementId: "G-T4JGH60C8Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to throttle updates so we don't spam the database
let isUpdating = false;
let pendingUpdate = null;

// Expose methods to global scope so other scripts (like ui.js) can call them
window.FirebaseService = {
  /**
   * Atualiza a pontuação do jogador no Firestore.
   * Usa "throttle" para enviar no máximo a cada 15 segundos.
   */
  updateScore: function(dataPayload) {
    if (!dataPayload || !dataPayload.playerName || dataPayload.playerName.trim() === '') return;

    // Guarda sempre o dado mais recente
    pendingUpdate = dataPayload;

    // Se já estivermos na janela de espera para atualizar, apenas aguarda
    if (isUpdating) return;

    isUpdating = true;
    
    setTimeout(async () => {
      const data = pendingUpdate;
      pendingUpdate = null;
      
      if (data) {
          try {
            const playerRef = doc(db, "leaderboard", data.playerName); // Usando o nome como ID
            await setDoc(playerRef, {
              name: data.playerName,
              level: data.totalLevel,
              avatar: data.avatarClass || '📜',
              class: data.className || 'Sem classe',
              house: data.houseName || 'Sem Casa',
              gearScore: data.totalGS || 0,
              gold: data.gold || 0,
              workers: data.workers || 0,
              achievementsCount: data.achievementsCount || 0,
              achievementsTotal: data.achievementsTotal || 56,
              gatherLvl: data.gatherLvl || 0,
              craftLvl: data.craftLvl || 0,
              gatherDetails: data.gatherDetails || '',
              craftDetails: data.craftDetails || '',
              charSnapshot: data.charSnapshot || null,
              lastUpdated: serverTimestamp()
            }, { merge: true });
          } catch (e) {
            console.error("Erro ao salvar progresso no Firebase: ", e);
          }
      }
      
      // Libera para uma nova atualização depois dos 15 segundos
      isUpdating = false;
    }, 15000); // A cada 15 segundos
  },

  /**
   * Busca os 50 melhores jogadores.
   */
  getTopPlayers: async function() {
    try {
      const q = query(
        collection(db, "leaderboard"),
        orderBy("level", "desc"),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const players = [];
      querySnapshot.forEach((doc) => {
        players.push(doc.data());
      });
      return players;
    } catch (e) {
      console.error("Erro ao buscar leaderboard: ", e);
      return [];
    }
  },

  // ==========================================
  // CHEFES GLOBAIS (WORLD BOSS)
  // ==========================================

  /**
   * Listen to the current World Boss status
   */
  listenToWorldBoss: function(callback) {
    const bossRef = doc(db, "worldboss", "current");
    return onSnapshot(bossRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    }, (error) => {
      console.error("Erro ao escutar worldboss: ", error);
    });
  },

  /**
   * Check if there is an active boss, otherwise spawn one (Decentralized Spawner)
   */
  checkAndSpawnWorldBoss: async function() {
    const bossRef = doc(db, "worldboss", "current");
    
    try {
      await runTransaction(db, async (transaction) => {
        const bossDoc = await transaction.get(bossRef);
        const now = Date.now();
        
        let needsSpawn = false;
        if (!bossDoc.exists()) {
          needsSpawn = true;
        } else {
          const data = bossDoc.data();
          if (data.hp <= 0) {
            // Se o chefe morreu e não tem defeatTime registrado, define agora
            if (!data.defeatTime) {
              transaction.update(bossRef, { defeatTime: now });
            } else if (now - data.defeatTime > 2 * 60 * 1000) {
              // 2 minutos se passaram desde a derrota, spawn um novo chefe!
              needsSpawn = true;
            }
          }
        }
        
        if (needsSpawn) {
          const bossList = [
            { name: "Dragão Ancestral de Ouro", icon: "🐉", maxHp: 10000 },
            { name: "Beholder do Vazio", icon: "👁️", maxHp: 10000 },
            { name: "Fênix de Magma", icon: "🔥", maxHp: 10000 },
            { name: "Golem de Mitril Silencioso", icon: "🗿", maxHp: 10000 },
            { name: "Lich do Cataclismo", icon: "💀", maxHp: 10000 },
            { name: "Kraken dos Abismos", icon: "🐙", maxHp: 10000 },
            { name: "Quimera da Tempestade", icon: "🦁⚡", maxHp: 10000 },
            { name: "Titã de Pedra Ancestral", icon: "⛰️", maxHp: 10000 },
            { name: "Lorde Vampiro Drácula", icon: "🧛", maxHp: 10000 },
            { name: "Rei Slime Corrompido", icon: "👑💧", maxHp: 10000 }
          ];
          const randomBoss = bossList[Math.floor(Math.random() * bossList.length)];
          
          transaction.set(bossRef, {
            name: randomBoss.name,
            icon: randomBoss.icon,
            maxHp: randomBoss.maxHp,
            hp: randomBoss.maxHp,
            spawnTime: now,
            isActive: true
          });
          
          // Limpa o placar de contribuições
          const lbRef = doc(db, "worldboss", "leaderboard");
          transaction.set(lbRef, { contributors: {} });
        }
      });
    } catch (e) {
      console.error("Erro ao fazer spawn do World Boss: ", e);
    }
  },

  /**
   * Submit damage to the World Boss and Leaderboard
   */
  submitWorldBossDamage: async function(damage, playerName, avatarClass) {
    if (!damage || damage <= 0) return;
    
    const bossRef = doc(db, "worldboss", "current");
    const lbRef = doc(db, "worldboss", "leaderboard");
    
    try {
      // We don't use a transaction here to avoid high contention.
      // We just increment the damage on the boss, and in the leaderboard document.
      await setDoc(bossRef, { hp: increment(-damage) }, { merge: true });
      
      const updateData = {};
      updateData[`contributors.${playerName}.damage`] = increment(damage);
      updateData[`contributors.${playerName}.avatarClass`] = avatarClass;
      updateData[`contributors.${playerName}.lastUpdate`] = serverTimestamp();
      
      await setDoc(lbRef, updateData, { merge: true });
    } catch (e) {
      console.error("Erro ao enviar dano ao World Boss: ", e);
    }
  },

  /**
   * Get World Boss Leaderboard
   */
  getWorldBossLeaderboard: async function() {
    const lbRef = doc(db, "worldboss", "leaderboard");
    try {
      const docSnap = await getDoc(lbRef);
      if (docSnap.exists()) {
        const data = docSnap.data().contributors || {};
        
        // Convert to array and sort by damage
        const players = Object.keys(data).map(name => ({
          name: name,
          damage: data[name].damage,
          avatarClass: data[name].avatarClass || 'knight'
        }));
        
        players.sort((a, b) => b.damage - a.damage);
        return players.slice(0, 50); // Top 50
      }
      return [];
    } catch (e) {
      console.error("Erro ao buscar leaderboard do World Boss: ", e);
      return [];
    }
  },

  // ==========================================
  // ADMIN — CHEFES GLOBAIS
  // ==========================================

  /**
   * Força o spawn de um chefe específico, substituindo o atual.
   */
  adminForceSpawnBoss: async function(boss) {
    const bossRef = doc(db, "worldboss", "current");
    const lbRef  = doc(db, "worldboss", "leaderboard");
    await setDoc(bossRef, {
      name:      boss.name,
      icon:      boss.icon,
      maxHp:     boss.maxHp,
      hp:        boss.maxHp,
      spawnTime: Date.now(),
      isActive:  true,
      defeatTime: null
    });
    await setDoc(lbRef, { contributors: {} });
  },

  /**
   * Define o HP (e maxHp) do chefe ativo diretamente.
   */
  adminSetBossHp: async function(hp, maxHp) {
    const bossRef = doc(db, "worldboss", "current");
    await setDoc(bossRef, { hp: hp, maxHp: maxHp }, { merge: true });
  },

  /**
   * Encerra o chefe atual zerando o HP e registrando defeatTime.
   */
  adminKillBoss: async function() {
    const bossRef = doc(db, "worldboss", "current");
    await setDoc(bossRef, { hp: 0, defeatTime: Date.now() }, { merge: true });
  },

  // ==========================================
  // POÇO DOS DESEJOS (WISHING WELL)
  // ==========================================

  /**
   * Listen to the current Wishing Well status
   */
  listenToWishingWell: function(callback) {
    const wellRef = doc(db, "wishingwell", "current");
    return onSnapshot(wellRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        // Initialize if not exists
        callback({
          currentGold: 0,
          targetGold: 100000,
          activeEvent: null,
          eventEndTime: 0
        });
      }
    }, (error) => {
      console.error("Erro ao escutar wishingwell: ", error);
    });
  },

  /**
   * Submit Gold to Wishing Well
   */
  donateToWishingWell: async function(amount, playerName) {
    if (!amount || amount <= 0) return false;
    
    const wellRef = doc(db, "wishingwell", "current");
    const events = ['star_shower', 'gaia_blessing', 'frenzy_forge', 'arena_fury'];
    
    try {
      let triggeredEvent = null;
      await runTransaction(db, async (transaction) => {
        const wellDoc = await transaction.get(wellRef);
        let data = wellDoc.exists() ? wellDoc.data() : { currentGold: 0, targetGold: 100000, activeEvent: null, eventEndTime: 0 };
        
        let newGold = data.currentGold + amount;
        let newEvent = data.activeEvent;
        let newEndTime = data.eventEndTime;

        // Se bater a meta, ativa o evento!
        if (newGold >= data.targetGold) {
            newGold = 0; // Reseta
            newEvent = events[Math.floor(Math.random() * events.length)];
            newEndTime = Date.now() + (3 * 60 * 60 * 1000); // 3 horas a partir de agora
            triggeredEvent = newEvent;
        }

        transaction.set(wellRef, {
            currentGold: newGold,
            targetGold: data.targetGold, // Mantém a meta (ou pode mudar caso queira escalar)
            activeEvent: newEvent,
            eventEndTime: newEndTime
        }, { merge: true });
      });
      return triggeredEvent;
    } catch (e) {
      console.error("Erro ao doar para o Poço dos Desejos: ", e);
      return false;
    }
  },

  /**
   * Salva a configuração de rebalanceamento no Firestore.
   */
  saveBalancingConfig: async function(configData) {
    try {
      const configRef = doc(db, "balancing", "config");
      await setDoc(configRef, configData);
      return true;
    } catch (e) {
      console.error("Erro ao salvar configuração de balanceamento: ", e);
      return false;
    }
  },

  /**
   * Escuta a configuração de rebalanceamento no Firestore em tempo real.
   */
  listenToBalancingConfig: function(callback) {
    const configRef = doc(db, "balancing", "config");
    return onSnapshot(configRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      } else {
        callback(null);
      }
    }, (error) => {
      console.error("Erro ao escutar configuração de balanceamento: ", error);
    });
  }
};

