/**
 * 生活場景正向引導模板庫（35 條）
 *
 * 涵蓋五大分類：
 *   A. 職涯/工作（8 條）— career
 *   B. 人際/情感（8 條）— relationship
 *   C. 健康/自我照顧（7 條）— health
 *   D. 財務/豐盛（6 條）— finance
 *   E. 學習/成長（6 條）— growth
 *
 * 模板設計原則（Placebo Framing）：
 * 1. 永遠正向重框架 — 沒有「壞」「糟」「不幸」「倒霉」「災禍」「凶」「厄運」
 * 2. 具體可執行的行動建議（至少 10 字）
 * 3. 心理學/正向引導語言，避免迷信、恐嚇
 * 4. 支援 {{sunSign}} {{moonSign}} {{dayElement}} 變數
 * 5. message 50-120 字，actionSuggestion 20-80 字
 */

import type { FortuneTemplate } from './daily-templates.js';

export const LIFE_SCENE_TEMPLATES: readonly FortuneTemplate[] = [
  // ============================================
  // A. 職涯/工作（8 條）
  // ============================================
  {
    id: 'career-interview-01',
    tags: ['career', 'interview', 'preparation'],
    theme: '面試蓄勢',
    message:
      '心理學中的「自我效能感」理論指出，充分的準備能大幅提升臨場表現。今天{{sunSign}}的能量強化你的表達力，而面試本質上是一場雙向的對話——你在選擇對方，對方也在了解你。帶著自信去展現真實的自己。',
    actionSuggestion:
      '用「STAR 法則」準備三個過去的成就故事：情境、任務、行動、結果。對著鏡子練習一次，讓身體記住自信的姿態。',
  },
  {
    id: 'career-project-01',
    tags: ['career', 'project', 'momentum'],
    theme: '專案推進',
    message:
      '每一個偉大的專案都是由無數個小步驟堆疊而成的。{{dayElement}}的能量今天特別支持持續性的行動。研究顯示，把大目標拆成可衡量的小任務，能讓完成率提升三倍以上。讓進度條往前推一格吧。',
    actionSuggestion:
      '找出專案中下一個最小可交付的成果，設定今天的截止時間並專注完成它。進度會產生動力。',
  },
  {
    id: 'career-workplace-01',
    tags: ['career', 'workplace', 'interpersonal'],
    theme: '職場人際',
    message:
      '職場中最有影響力的人往往不是最會做事的，而是最會和人合作的。{{moonSign}}今天增強了你的同理心雷達，讓你更容易讀懂同事的需求與顧慮。真誠的傾聽是建立職場信任的最短路徑。',
    actionSuggestion:
      '今天找一位平時較少互動的同事聊五分鐘，問一句「最近工作上有什麼我能幫忙的嗎？」，真心傾聽對方的回答。',
  },
  {
    id: 'career-promotion-01',
    tags: ['career', 'promotion', 'visibility'],
    theme: '升遷視野',
    message:
      '升遷不只是「做得好」，更是「被看見做得好」。正向心理學強調，主動展示自己的貢獻不是自吹自擂，而是負責任的自我管理。{{sunSign}}的能量今天讓你的表達特別有說服力，是適合讓成果被看見的日子。',
    actionSuggestion:
      '整理你近三個月的關鍵成果清單，用一到兩句話為每項成果寫下「對團隊的具體貢獻」，找適當時機與主管分享。',
  },
  {
    id: 'career-burnout-01',
    tags: ['career', 'burnout', 'reframe'],
    theme: '能量重啟',
    message:
      '感覺工作熱情減退不是你的問題，而是大腦在發出「需要切換模式」的訊號。神經科學顯示，持續的認知負荷會消耗前額葉的執行功能資源。今天{{dayElement}}的能量邀請你暫停、充電、重新校準方向。',
    actionSuggestion:
      '列出工作中仍讓你感到有意義的三件事，並為今天安排一段至少二十分鐘完全脫離工作的「微度假」時間。',
  },
  {
    id: 'career-crossteam-01',
    tags: ['career', 'collaboration', 'cross-team'],
    theme: '跨域協作',
    message:
      '當不同背景的人坐在一起，創新的機率就大幅提升。組織行為學研究證實，多元團隊的解題能力優於同質團隊。今天{{moonSign}}的人際能量讓你成為跨部門溝通的最佳橋梁。',
    actionSuggestion:
      '主動邀請另一個部門的同事來一場十五分鐘的非正式對話，了解他們的挑戰，尋找可以互相支援的交集。',
  },
  {
    id: 'career-timemanage-01',
    tags: ['career', 'time-management', 'focus'],
    theme: '時間錬金',
    message:
      '時間管理的核心不是把每分鐘塞滿，而是把最重要的事放在精力最好的時段。{{dayElement}}今天帶來清晰的優先順序感。心理學家發現，一天中真正的「深度工作」時段通常只有三到四小時。善用它。',
    actionSuggestion:
      '用「時間塊」法重新安排今天：把最重要的任務放在你精力最充沛的時段，零碎時間留給低認知負荷的瑣事。',
  },
  {
    id: 'career-startup-01',
    tags: ['career', 'startup', 'entrepreneurship'],
    theme: '創業啟航',
    message:
      '創業的第一步不需要完美的計畫，而是一個「最小可行的行動」。{{sunSign}}今天的能量點燃你的行動力。哈佛商學院研究顯示，成功的創業者共同特質不是天才般的洞察，而是快速行動、從回饋中學習的能力。',
    actionSuggestion:
      '把你的商業想法濃縮成一句話告訴一位信任的朋友，認真聽取對方的第一反應。市場驗證從最簡單的對話開始。',
  },

  // ============================================
  // B. 人際/情感（8 條）
  // ============================================
  {
    id: 'relationship-friendship-01',
    tags: ['relationship', 'friendship', 'maintenance'],
    theme: '友誼灌溉',
    message:
      '友誼就像花園，需要定期灌溉才能持續綻放。研究顯示，維持親密友誼是幸福感最強的預測因子之一。{{moonSign}}今天強化了你的情感連結力，一通短短的問候就能重新點亮一段珍貴的友誼。',
    actionSuggestion:
      '傳一則訊息給你最近想到但還沒聯繫的朋友，分享一個你們共同的美好回憶，然後問問對方最近如何。',
  },
  {
    id: 'relationship-family-01',
    tags: ['relationship', 'family', 'communication'],
    theme: '家人對話',
    message:
      '家人之間最常見的溝通障礙不是不關心，而是用了對方聽不懂的「愛的語言」。{{dayElement}}今天帶來溫和的表達力，讓你更容易找到和家人同頻的溝通方式。嘗試放下「應該」，用好奇心去理解對方。',
    actionSuggestion:
      '今天和一位家人進行一次沒有手機干擾的對話，用「我感覺......」而非「你總是......」的句式表達自己的想法。',
  },
  {
    id: 'relationship-partner-01',
    tags: ['relationship', 'partner', 'intimacy'],
    theme: '伴侶默契',
    message:
      '關係心理學大師 Gottman 發現，穩定幸福的伴侶每天都有許多「微連結時刻」——一個眼神、一句關心、一個小舉動。今天{{moonSign}}的溫柔能量提醒你，浪漫不一定是大事件，更多是日常中刻意的溫柔。',
    actionSuggestion:
      '為你的伴侶做一件他/她通常自己做的小事：泡杯咖啡、整理桌面、或簡單地問一句「今天過得怎樣？」然後認真聽。',
  },
  {
    id: 'relationship-newconnection-01',
    tags: ['relationship', 'new-connection', 'openness'],
    theme: '新緣際會',
    message:
      '每一段珍貴的關係都曾經是陌生人之間的第一次對話。社會心理學研究發現，人們常低估陌生人之間互動帶來的愉悅感。{{sunSign}}今天散發的親和力讓你更容易和新朋友建立連結。',
    actionSuggestion:
      '在今天的日常場景中主動開啟一次對話——對咖啡店員多聊一句、向新同事自我介紹，讓善意成為連結的起點。',
  },
  {
    id: 'relationship-socialanxiety-01',
    tags: ['relationship', 'social-anxiety', 'reframe'],
    theme: '社交自在',
    message:
      '社交前的緊張感其實是大腦在為你準備「最佳表現模式」——和運動員賽前的腎上腺素一樣。{{dayElement}}的穩定能量今天是你的定心錨。記住：大多數人都更關注自己的表現，而非在評判你。',
    actionSuggestion:
      '在社交場合中給自己一個「三人任務」：找到三個人各聊兩分鐘。把注意力放在好奇對方身上，焦慮會自然減輕。',
  },
  {
    id: 'relationship-boundary-01',
    tags: ['relationship', 'boundary', 'self-respect'],
    theme: '溫柔的界限',
    message:
      '設定界限不是拒絕別人，而是尊重自己。臨床心理學強調，清晰的界限反而能讓關係更健康長久。{{moonSign}}今天增強了你的自我覺察力，讓你更清楚知道什麼是你真正願意承擔的。',
    actionSuggestion:
      '對一個讓你感到為難的請求，練習使用「我很珍惜我們的關係，同時我現在需要......」的溫和拒絕句式。',
  },
  {
    id: 'relationship-apology-01',
    tags: ['relationship', 'apology', 'reconciliation'],
    theme: '修復的勇氣',
    message:
      '道歉不是承認自己「錯了」，而是表達「你對我很重要」。研究顯示，高品質的道歉包含三個元素：承認影響、表達遺憾、提出修復方案。今天{{sunSign}}的真誠能量是打開和解之門的鑰匙。',
    actionSuggestion:
      '如果有一段需要修復的關係，今天用文字或面對面傳達：「我知道那件事讓你不舒服，我很在意你的感受，我想一起找到更好的方式。」',
  },
  {
    id: 'relationship-solitude-01',
    tags: ['relationship', 'solitude', 'independence'],
    theme: '獨處智慧',
    message:
      '獨處不是孤獨，而是和自己最重要的人相處的時刻。正向心理學研究發現，刻意的獨處能顯著提升創造力、自我覺察和情緒復原力。{{dayElement}}今天的沉靜能量特別適合這份內在的約會。',
    actionSuggestion:
      '今天為自己保留至少三十分鐘的獨處時光。關掉通知，做一件「只有你一個人」才能享受的事：散步、閱讀、發呆或泡澡。',
  },

  // ============================================
  // C. 健康/自我照顧（7 條）
  // ============================================
  {
    id: 'health-exercise-01',
    tags: ['health', 'exercise', 'motivation'],
    theme: '運動啟動',
    message:
      '運動科學證實，最難的永遠是「開始」——一旦動起來，大腦就會釋放內啡肽讓你想繼續。{{dayElement}}今天的活力能量降低了啟動門檻。不需要一小時的高強度訓練，十分鐘的輕度活動就能啟動正向循環。',
    actionSuggestion:
      '設定一個超低門檻的運動目標：穿上運動鞋走出門，或做十個深蹲。告訴自己只要做五分鐘就好，通常你會做更多。',
  },
  {
    id: 'health-sleep-01',
    tags: ['health', 'sleep', 'quality'],
    theme: '好眠提案',
    message:
      '睡眠是大腦進行記憶鞏固和情緒修復的核心時段。研究顯示，一致的睡前儀式能讓入睡時間縮短四成。{{moonSign}}今天的能量引導你回歸身體的自然節律，今晚是建立好眠習慣的絕佳起點。',
    actionSuggestion:
      '今晚嘗試「睡前三步驟」：提前三十分鐘關掉螢幕、做三分鐘的身體掃描放鬆、寫下明天最重要的一件事，然後安心入睡。',
  },
  {
    id: 'health-eating-01',
    tags: ['health', 'eating', 'mindfulness'],
    theme: '飲食覺察',
    message:
      '正念飲食不是限制，而是重新連結你和食物之間的關係。當你用心品嚐每一口，大腦的飽足訊號會更準確，你自然會做出對身體更好的選擇。{{dayElement}}今天特別適合練習這份覺察。',
    actionSuggestion:
      '今天選一餐放慢速度吃，每口咀嚼十五到二十下，注意食物的味道、口感和溫度。觀察吃完後身體的感受。',
  },
  {
    id: 'health-stress-01',
    tags: ['health', 'stress', 'management'],
    theme: '壓力轉化',
    message:
      '史丹佛大學的研究發現，把壓力視為「身體在幫你準備迎接挑戰」的人，健康狀況明顯優於視壓力為有害的人。{{sunSign}}今天的能量幫助你用全新的眼光看待壓力——它是你在乎某件事的證明。',
    actionSuggestion:
      '感到壓力時，先做三次深呼吸，然後對自己說：「這份壓力代表我正在做重要的事。」接著寫下你能控制的下一個行動步驟。',
  },
  {
    id: 'health-mentalhealth-01',
    tags: ['health', 'mental-health', 'self-care'],
    theme: '心理健康日',
    message:
      '照顧心理健康和照顧身體健康同樣重要。今天{{moonSign}}的能量溫柔地提醒你：允許自己有情緒、允許自己休息、允許自己不完美。「今天我已經很努力了」是一句你值得聽到的話。',
    actionSuggestion:
      '為自己安排一項「心理健康小儀式」：寫三行感恩日記、到戶外曬十分鐘陽光，或撥打一通讓你感到溫暖的電話。',
  },
  {
    id: 'health-bodylistening-01',
    tags: ['health', 'body-listening', 'awareness'],
    theme: '身體對話',
    message:
      '你的身體每天都在透過各種訊號和你溝通——肩膀的緊繃、胃的不適、眼睛的疲勞。這些不是抱怨，而是關心。{{dayElement}}今天增強了你和身體之間的連線，是練習「身體傾聽」的好時機。',
    actionSuggestion:
      '找一個安靜的時刻，從頭頂到腳趾做一次緩慢的身體掃描。注意哪裡感到緊繃或不適，輕輕對那個部位說：「我聽到你了。」',
  },
  {
    id: 'health-energy-01',
    tags: ['health', 'energy', 'recovery'],
    theme: '能量恢復',
    message:
      '精力管理比時間管理更重要。當你感覺疲憊時，身體不是在偷懶，而是在告訴你「需要切換充電模式」。{{sunSign}}今天的能量提醒你：策略性的休息是高效生活的核心能力，不是奢侈品。',
    actionSuggestion:
      '用「90 分鐘週期法」工作：專注九十分鐘後，用十到十五分鐘做完全不同的事——站起來走動、聽一首歌、看窗外風景。',
  },

  // ============================================
  // D. 財務/豐盛（6 條）
  // ============================================
  {
    id: 'finance-bookkeeping-01',
    tags: ['finance', 'bookkeeping', 'awareness'],
    theme: '記帳覺察',
    message:
      '記帳不是限制自由，而是看見自由的地圖。行為經濟學發現，「觀察效應」本身就能改善消費行為——當你開始記錄，潛意識會自動做出更好的選擇。{{dayElement}}今天帶來清晰的覺察力。',
    actionSuggestion:
      '花十分鐘回顧過去一週的消費，將每筆標記為「需要」「想要」或「意外」。不做批判，只是觀察，模式會自然浮現。',
  },
  {
    id: 'finance-investing-01',
    tags: ['finance', 'investing', 'learning'],
    theme: '投資學習',
    message:
      '投資的第一步不是選股票，而是投資自己的財商。{{sunSign}}今天的學習能量適合吸收新知。巴菲特曾說，最好的投資是對自己知識的投資。先理解規則，再進場參與比賽。',
    actionSuggestion:
      '今天花二十分鐘閱讀一篇理財入門文章或觀看一段基礎投資概念影片，記下一個你之前不了解的財務術語並弄懂它。',
  },
  {
    id: 'finance-spending-01',
    tags: ['finance', 'spending', 'mindfulness'],
    theme: '消費覺察',
    message:
      '心理學中的「冷卻期效應」指出，衝動消費後的滿足感通常在四十八小時內消退。{{dayElement}}今天帶來沉穩的判斷力，幫助你區分「真正需要」和「一時衝動」之間的差異。',
    actionSuggestion:
      '下次想購物時，先把商品加入收藏而非購物車，等待四十八小時。如果兩天後仍然想要，那才是真正值得的消費。',
  },
  {
    id: 'finance-sidehustle-01',
    tags: ['finance', 'side-hustle', 'exploration'],
    theme: '副業探索',
    message:
      '副業不只是額外收入，更是探索自我潛能的實驗場。{{sunSign}}今天的創業能量正在喚醒你心中那個想「試試看」的聲音。最好的副業往往從你已經擅長且喜歡的事情開始。',
    actionSuggestion:
      '列出三件你常被朋友請教的事或擅長的技能，挑選其中一件搜尋「如何用這個技能創造價值」，記下三個可能的方向。',
  },
  {
    id: 'finance-gratitude-01',
    tags: ['finance', 'gratitude', 'abundance'],
    theme: '感恩豐盛',
    message:
      '豐盛感不完全取決於銀行帳戶的數字，更來自你如何看待已經擁有的一切。正向心理學研究證實，「感恩練習」能顯著提升生活滿意度。{{moonSign}}今天的能量幫助你用富足的眼光看待生活。',
    actionSuggestion:
      '寫下五樣你目前擁有的「非金錢資產」：健康、技能、人脈、時間、經驗。感受一下：你其實比想像中更富有。',
  },
  {
    id: 'finance-goal-01',
    tags: ['finance', 'goal-setting', 'planning'],
    theme: '理財藍圖',
    message:
      '有清晰目標的人比沒有目標的人更容易達成財務里程碑，這不是玄學，是心理學中「目標設定理論」的實證結論。{{dayElement}}今天帶來規劃的清晰度，適合為你的財務畫一張路線圖。',
    actionSuggestion:
      '設定一個具體的六個月財務目標，然後往回推算：每月需要存多少、從哪裡省、如何增加收入。把數字寫在看得見的地方。',
  },

  // ============================================
  // E. 學習/成長（6 條）
  // ============================================
  {
    id: 'growth-newskill-01',
    tags: ['growth', 'new-skill', 'learning'],
    theme: '技能解鎖',
    message:
      '學習新技能初期的笨拙感不是失敗，而是大腦正在建立新的神經通路。{{dayElement}}今天的成長能量降低了「初學者恐懼」的門檻。神經科學告訴我們：每一次不完美的嘗試都在強化突觸連結。',
    actionSuggestion:
      '選一個你想學的技能，給自己「允許搞砸」的許可證，然後花十五分鐘做第一次嘗試。重點是開始，不是完美。',
  },
  {
    id: 'growth-reading-01',
    tags: ['growth', 'reading', 'habit'],
    theme: '閱讀滋養',
    message:
      '閱讀是投資報酬率最高的自我成長方式之一——一本書凝聚了作者數年的思考精華。{{sunSign}}今天的好奇心能量讓你的吸收效率特別高。不需要一次讀完整本書，每天幾頁就能累積深厚的知識底蘊。',
    actionSuggestion:
      '從你的書架或閱讀清單中選一本書，設定每天至少閱讀十頁的微習慣。讀完一段後用一句話寫下你的收穫。',
  },
  {
    id: 'growth-writing-01',
    tags: ['growth', 'writing', 'expression'],
    theme: '書寫力量',
    message:
      '寫作不只是記錄想法，更是「想清楚」的過程。認知心理學指出，將模糊的念頭轉化為文字的過程會啟動深層的分析與整合機制。{{moonSign}}今天增強了你的內在表達力，讓文字更容易流出來。',
    actionSuggestion:
      '打開一個空白頁面，用「自由書寫」法寫十分鐘：不修改、不停頓、想到什麼寫什麼。寫完後回讀一遍，畫出讓你驚喜的句子。',
  },
  {
    id: 'growth-reflection-01',
    tags: ['growth', 'reflection', 'self-awareness'],
    theme: '內在覆盤',
    message:
      '反思是把「經歷」轉化為「經驗」的關鍵步驟。管理學大師德魯克說：「沒有反思的經驗只是經歷。」{{dayElement}}今天帶來清澈的內在視野，適合安靜地和自己對話，看看最近的成長軌跡。',
    actionSuggestion:
      '用「三個問題法」做一次快速覆盤：這週我做得最好的一件事是什麼？我學到了什麼？下週我想做出什麼改變？',
  },
  {
    id: 'growth-failure-01',
    tags: ['growth', 'failure', 'reframe'],
    theme: '成長養分',
    message:
      '心理學家 Carol Dweck 的「成長心態」研究發現，把挫折視為「還沒成功」而非「失敗」的人，長期表現明顯更好。{{sunSign}}今天的能量幫助你用建設性的眼光重新檢視近期的挑戰——每一次跌倒都是資料收集。',
    actionSuggestion:
      '回想一個近期沒達到預期的事，寫下「這件事教會了我什麼」和「如果重來一次我會怎麼做」。把教訓轉化為下一次的策略。',
  },
  {
    id: 'growth-curiosity-01',
    tags: ['growth', 'curiosity', 'exploration'],
    theme: '好奇心引擎',
    message:
      '好奇心是人類最強大的學習引擎。神經科學研究顯示，好奇心啟動時大腦的海馬迴會進入「高效記憶模式」，連帶記住周邊的資訊。{{dayElement}}今天點燃了你的探索慾，跟著它走，你會發現意想不到的寶藏。',
    actionSuggestion:
      '今天追問一個你從沒深入研究的「為什麼」：為什麼天空是藍的？為什麼某個流程要這樣設計？讓好奇心帶你挖掘答案。',
  },
];
