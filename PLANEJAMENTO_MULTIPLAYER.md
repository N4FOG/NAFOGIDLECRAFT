# Planejamento: Cidade Multiplayer & End-Game

Este documento contém o registro das ideias e mecânicas planejadas para expandir o **Idle Craft** com recursos multiplayer assíncronos via Firebase, focando em retenção de jogadores e criação de uma economia viva.

---

## 1. 🌍 A Cidade Multiplayer (Hub Central)
Nova categoria na Sidebar chamada **"🌍 CIDADE MULTIPLAYER"**.
Será o centro de todas as interações da comunidade, contendo sub-menus para os diversos sistemas sociais do jogo.

---

## 2. 🪙 O Poço dos Desejos (Gatilho de Eventos Globais)
Um grande "Resource Sink" (ralo de recursos) para tirar o excesso de Ouro da economia.

*   **A Mecânica:** O servidor inteiro joga Ouro no poço. Existe um medidor global (ex: 1 Milhão de Ouro).
*   **A Erupção:** Quando o servidor atinge a meta, o poço "Erupta", gerando um Evento Global Aleatório que afeta todos os jogadores por algumas horas.
*   **Ideias de Eventos Globais:**
    *   *Chuva de Estrelas:* +20% de chance de minérios raros passivos na aba de Mineração (dura 3 horas).
    *   *Bênção de Gaia:* Coleta dupla de árvores/ervas e trabalhadores mais eficientes.
    *   *A Forja Frenética:* Tempo de Crafting/Smithing/Alchemy cortado pela metade.
    *   *Fúria da Arena:* Monstros ganham +20% HP, mas dropam o dobro de Ouro/Itens.
    *   *O Mercador Viajante:* NPC lendário aparece vendendo itens por gemas/muito ouro.

---

## 3. 🛡️ Exibição de Passivas Ativas (Nova UI)
Para acomodar os Eventos Globais sem poluir a `topStatsBar`, será criada uma **Barra de Passivas Ativas** (Buff Bar).

*   **Design:** Ícones circulares exibidos no topo da tela. Passar o mouse (Hover) exibe um *Tooltip* com o nome, efeito e tempo restante.
*   **Integração Unificada:** Esta barra será o padrão para TODOS os buffs do jogo, abrigando:
    1.  Buffs Globais (Eventos do Poço, Projetos Comunitários).
    2.  Poções Temporárias (Alquimia).
    3.  Auras de Equipamentos.
    4.  Efeitos de Runas e Encantamentos.
    5.  Buffs permanentes de Reputação de Casas/Facções.

---

## 4. 🎣 Torneios Semanais de Profissão (Mecânica de "Peso")
Torneios que estimulam as profissões passivas de coleta.

*   **O Exemplo da Pesca:** NPCs anunciam o torneio. Todos os peixes pescados contam pontos. Os 10% melhores ganham títulos/medalhas no Hall da Fama.
*   **A Nova Mecânica de "Peso":**
    *   Todo peixe pescado (manualmente ou por trabalhadores) passa a ter um "Peso" aleatório.
    *   A fórmula baseia-se no `Peso Base + (Fator Aleatório * Nível da Skill)`.
    *   *Gap Progressivo:* Um pescador Nv. 10 pode pegar sardinhas de 100g a 500g. Um Nv. 30 pega de 100g a 1.5kg.
    *   O Torneio passa a ser avaliado pelo "Maior Peixe Pescado", tornando a notificação de trabalhadores do Acampamento muito mais emocionante.

---

## 5. 📊 O Grande Observatório (Estatísticas do Servidor)
Um mural na Cidade Multiplayer que puxa dados globais do Firebase para fazer o mundo parecer vivo. O jogo acumulará métricas localmente a cada 5 minutos e enviará um `increment()` pro Firebase para evitar sobrecarga.

*   **Métricas para exibir (sorteadas aleatoriamente a cada visita):**
    *   ⏳ **Tempo Total Jogado (Comunidade):** (Ex: *14 Anos, 3 Meses e 12 Dias*).
    *   ⚔️ Monstros derrotados na Arena.
    *   🪓 Total de árvores cortadas.
    *   💀 O Chefe/Monstro mais mortal (que mais causou *Game Over*).
    *   🔥 Jantares/Comidas queimadas.
    *   🐕 Mascotes adotados.
    *   ✨ Poções preparadas e Equipamentos forjados.
    *   🏆 Maior Dano Crítico já registrado (com o nome do jogador).

---

## 6. 🏗️ Outras Ideias para o Futuro (Projetos Comunitários e Comércio)
*   **Mercado de Leilão:** Compra e venda entre jogadores via Firebase, com "Taxa de Listagem" de 5% (Gold Sink).
*   **Sistema de Guildas:** Doações coletivas para subir a guilda de nível e ganhar buffs passivos.
*   **Hall da Fama:** Rankings de Gladiadores (Ondas), Magnatas (Ouro) e Mestres Artesãos.
*   **Metas Comunitárias (Esforço de Guerra):** O servidor precisa doar X milhões de recursos para construir monumentos. Recompensa o servidor inteiro se a meta for atingida (Ex: Muralhas de Aço para defesa, Navio Mercante para itens exclusivos, Torre do Mago para XP extra).
