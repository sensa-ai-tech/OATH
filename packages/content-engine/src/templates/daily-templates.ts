/**
 * 每日運勢正向引導模板庫
 *
 * 模板設計原則（Placebo Framing）：
 * 1. 永遠正向重框架 — 沒有「壞日子」
 * 2. 具體可執行的行動建議
 * 3. 科學/心理學語言而非玄學語言
 * 4. 星象/八字作為「框架」而非「命運」
 */

export interface FortuneTemplate {
  readonly id: string;
  /** 觸發條件標籤 */
  readonly tags: readonly string[];
  /** 主題（中文） */
  readonly theme: string;
  /** 正向訊息模板（支援 {{variable}} 語法） */
  readonly message: string;
  /** 行動建議模板 */
  readonly actionSuggestion: string;
}

/**
 * 基礎模板庫 — MVP 第一批（50 條）
 * Phase 2 目標：200+ 條
 */
export const DAILY_TEMPLATES: readonly FortuneTemplate[] = [
  // ============================================
  // 五行主題：木 (Wood)
  // ============================================
  {
    id: 'wood-growth-01',
    tags: ['wood', 'favorable', 'spring'],
    theme: '成長萌芽',
    message: '今天的能量場特別適合開始新計畫。就像春天的種子破土而出，你內在的創造力正在甦醒。{{dayElement}}的力量為你帶來自然的生長動能。',
    actionSuggestion: '找一件你一直想開始但遲遲沒動手的事，今天就踏出第一步——哪怕只是寫下第一行字或傳出第一封信。',
  },
  {
    id: 'wood-flexibility-01',
    tags: ['wood', 'challenge', 'adaptation'],
    theme: '柔韌應變',
    message: '今天可能會遇到一些需要調整方向的狀況。記住：最強壯的樹木不是最硬的，而是在風中能彎曲卻不折斷的那種。你的適應力就是你最大的優勢。',
    actionSuggestion: '如果今天計畫有變，試著把它看成一個意外的轉彎而非阻礙。問自己：這個變化帶來了什麼新的可能性？',
  },
  {
    id: 'wood-connection-01',
    tags: ['wood', 'social', 'network'],
    theme: '人際連結',
    message: '木性能量強調連結與成長。今天是強化人際網絡的好時機。一通久違的問候電話，可能帶來意想不到的正向連鎖效應。',
    actionSuggestion: '主動聯繫一位你最近想到但沒聯絡的朋友或同事，一句簡單的「最近好嗎？」就足夠了。',
  },

  // ============================================
  // 五行主題：火 (Fire)
  // ============================================
  {
    id: 'fire-passion-01',
    tags: ['fire', 'favorable', 'energy'],
    theme: '熱情驅動',
    message: '今天你的內在火焰特別明亮。{{sunSign}}帶來的能量讓你的表達力和領導力處於高峰。這是展現真實自我的絕佳時機。',
    actionSuggestion: '大膽表達你的想法。今天適合在會議中發言、分享你的創意，或是告訴某人你的真實感受。',
  },
  {
    id: 'fire-patience-01',
    tags: ['fire', 'challenge', 'temperance'],
    theme: '溫和之火',
    message: '火的能量有時需要被引導，而非壓抑。今天你可能會感到特別急躁或衝動，這其實是創造力想要找到出口的訊號。',
    actionSuggestion: '感到急躁時，試試「5-4-3-2-1」呼吸法：吸氣 5 秒、屏息 4 秒、吐氣 3 秒。把急躁的能量轉化為專注力。',
  },
  {
    id: 'fire-inspiration-01',
    tags: ['fire', 'creative', 'art'],
    theme: '靈感之火',
    message: '創意能量今天特別活躍。你的直覺比平常更敏銳，那些突然冒出的想法很值得被記錄下來。',
    actionSuggestion: '隨身帶一本小筆記本或用手機備忘錄。今天每個突然冒出的靈感都記下來，不要評判——晚上再回顧。',
  },

  // ============================================
  // 五行主題：土 (Earth)
  // ============================================
  {
    id: 'earth-stability-01',
    tags: ['earth', 'favorable', 'grounding'],
    theme: '穩固基礎',
    message: '今天的土元素能量帶來踏實感和安定感。這是整理思緒、建立系統的好日子。你的可靠和耐心正是現在最需要的品質。',
    actionSuggestion: '整理一個你一直拖延的空間——無論是書桌、資料夾還是行事曆。外在的整齊會帶來內在的清明。',
  },
  {
    id: 'earth-nourish-01',
    tags: ['earth', 'selfcare', 'body'],
    theme: '滋養自我',
    message: '土的能量提醒我們照顧好根基。今天特別適合關注身體的需求——你的身體一直在為你工作，它值得被善待。',
    actionSuggestion: '今天選一餐好好吃，不急不趕。或是睡前做 10 分鐘的伸展，感謝身體的辛勞。',
  },
  {
    id: 'earth-trust-01',
    tags: ['earth', 'challenge', 'patience'],
    theme: '信任過程',
    message: '有些事需要時間才能看到結果，就像播種到收成之間需要耐心等待。今天的考驗在於信任自己已經付出的努力。',
    actionSuggestion: '寫下三件你正在努力但還沒看到成果的事，然後在旁邊寫下「持續中」。提醒自己：看不見不代表沒發生。',
  },

  // ============================================
  // 五行主題：金 (Metal)
  // ============================================
  {
    id: 'metal-clarity-01',
    tags: ['metal', 'favorable', 'focus'],
    theme: '清晰專注',
    message: '金元素帶來刀鋒般的清晰度。今天你的分析能力和判斷力特別敏銳，適合處理需要精確思考的事務。',
    actionSuggestion: '把你最需要專注思考的任務安排在今天。關掉通知，給自己 25 分鐘不被打擾的深度工作時間。',
  },
  {
    id: 'metal-release-01',
    tags: ['metal', 'challenge', 'letting-go'],
    theme: '適度放手',
    message: '金的能量也包含「收」與「放」的智慧。有時候最有力量的決定不是抓得更緊，而是知道什麼時候該優雅地放手。',
    actionSuggestion: '想一件佔據你心理空間但你無法控制的事。在心中對它說「我已經盡力了」，然後深呼吸一口氣，把注意力轉回你能影響的事物。',
  },
  {
    id: 'metal-value-01',
    tags: ['metal', 'wealth', 'worth'],
    theme: '價值肯定',
    message: '今天適合重新審視自己的價值。不是市場上的價格，而是你作為一個人帶給世界的獨特貢獻。',
    actionSuggestion: '列出三件你做得好的事——不用很大，「按時交付」「讓朋友笑了」都算。你的價值遠比你以為的多。',
  },

  // ============================================
  // 五行主題：水 (Water)
  // ============================================
  {
    id: 'water-intuition-01',
    tags: ['water', 'favorable', 'insight'],
    theme: '直覺深流',
    message: '水元素增強了你的直覺力。今天那些「說不出為什麼但就是覺得」的感受值得被重視——直覺是大腦在背景中運算的結果。',
    actionSuggestion: '面對今天的選擇時，先感受直覺告訴你什麼，再用邏輯驗證。兩者一致時，大膽行動。',
  },
  {
    id: 'water-flow-01',
    tags: ['water', 'challenge', 'flow'],
    theme: '順勢而行',
    message: '水不對抗岩石，它繞過去。今天如果遇到阻礙，不需要硬碰硬——找到另一條路往往更聰明。',
    actionSuggestion: '如果某件事進展不順，暫時放下它去做別的。很多時候，「不執著」反而是解決問題最快的路。',
  },
  {
    id: 'water-wisdom-01',
    tags: ['water', 'reflection', 'learning'],
    theme: '沉澱智慧',
    message: '今天適合向內看。{{moonSign}}的能量加深了你的洞察力。安靜的反思比忙碌的行動更有價值。',
    actionSuggestion: '睡前花 5 分鐘回顧今天：什麼讓你開心？什麼讓你成長？寫下一句話的今日心得。',
  },

  // ============================================
  // 星座主題
  // ============================================
  {
    id: 'zodiac-cardinal-01',
    tags: ['aries', 'cancer', 'libra', 'capricorn', 'initiative'],
    theme: '開創之力',
    message: '身為開創星座的你，今天的宇宙節奏特別配合你的行動力。不需要等到萬事俱備才開始。',
    actionSuggestion: '選一個你一直在「規劃」的事情，今天就執行它的第一步。完成比完美更重要。',
  },
  {
    id: 'zodiac-fixed-01',
    tags: ['taurus', 'leo', 'scorpio', 'aquarius', 'persistence'],
    theme: '堅定力量',
    message: '固定星座的你天生就有堅持到底的能力。今天這份毅力會成為你最大的資產。',
    actionSuggestion: '回想一個你已經堅持一段時間的目標，為自己的堅持鼓個掌。然後再往前推進一小步。',
  },
  {
    id: 'zodiac-mutable-01',
    tags: ['gemini', 'virgo', 'sagittarius', 'pisces', 'adaptability'],
    theme: '靈活應變',
    message: '變動星座的你擅長在變化中找到機會。今天的環境變化正好是你發揮長處的舞台。',
    actionSuggestion: '擁抱今天的每一個「意外」。用好奇心取代焦慮，問自己：這個變化教了我什麼？',
  },

  // ============================================
  // 行運主題
  // ============================================
  {
    id: 'transit-trine-01',
    tags: ['trine', 'harmony', 'flow'],
    theme: '和諧共振',
    message: '今天天象中有美好的三分相能量。事情會比平常更順利，人際互動也更和諧。享受這份流暢感。',
    actionSuggestion: '利用今天的順風，推進一個需要與人合作的計畫。今天的溝通特別容易達成共識。',
  },
  {
    id: 'transit-square-01',
    tags: ['square', 'tension', 'growth'],
    theme: '成長張力',
    message: '今天的四分相帶來建設性的張力。就像肌肉在阻力訓練中成長，這份挑戰正在幫助你變得更強。',
    actionSuggestion: '遇到摩擦時，把它當成升級的機會。問自己：這個挑戰在邀請我發展什麼新能力？',
  },
  {
    id: 'transit-conjunction-01',
    tags: ['conjunction', 'new-beginning', 'seed'],
    theme: '能量匯聚',
    message: '合相能量代表新的開始。今天適合播下新種子——一個想法、一段關係、一個計畫的起點。',
    actionSuggestion: '在今天做一件小小的「第一次」。嘗試新的咖啡店、學一個新單字、跟陌生人打個招呼。',
  },
  {
    id: 'transit-opposition-01',
    tags: ['opposition', 'balance', 'perspective'],
    theme: '平衡之鏡',
    message: '對分相提供了一面鏡子，讓你看見事情的另一面。今天特別適合換位思考，你會發現新的理解。',
    actionSuggestion: '選一個你很堅持的觀點，花 3 分鐘真心嘗試從對方角度思考。你不需要改變立場，但理解本身就有價值。',
  },

  // ============================================
  // 綜合主題
  // ============================================
  {
    id: 'general-gratitude-01',
    tags: ['general', 'positive', 'daily'],
    theme: '感恩時刻',
    message: '不管外在世界如何變化，你內在都有一個安靜的中心。今天花一點時間回到那裡，感受一下已經擁有的美好。',
    actionSuggestion: '起床後或睡前，想三件你感恩的事。它們不需要很大——一杯溫暖的咖啡、一個微笑、能自由呼吸。',
  },
  {
    id: 'general-courage-01',
    tags: ['general', 'courage', 'daily'],
    theme: '勇氣之日',
    message: '勇氣不是沒有恐懼，而是帶著恐懼依然前進。今天的天象支持你踏出舒適圈。',
    actionSuggestion: '做一件讓你有點緊張的事。公開演講、提出要求、承認錯誤——小小的勇敢累積起來就是巨大的改變。',
  },
  {
    id: 'general-rest-01',
    tags: ['general', 'rest', 'recovery'],
    theme: '充電日',
    message: '今天的能量場比較低沉，這不是壞事——就像手機需要充電，人也需要。允許自己慢下來。',
    actionSuggestion: '如果可以的話，今天減少一項待辦事項。用省下來的時間做一件「無用但開心」的事。',
  },
  {
    id: 'general-learning-01',
    tags: ['general', 'mercury', 'study'],
    theme: '學習之窗',
    message: '今天的水星能量特別活躍，你的學習效率比平常高。新資訊會比較容易被吸收和整合。',
    actionSuggestion: '花 20 分鐘學習一個你一直好奇的主題。看一篇文章、聽一集 Podcast、或觀看一段教學影片。',
  },
  {
    id: 'general-boundary-01',
    tags: ['general', 'saturn', 'boundary'],
    theme: '健康界限',
    message: '今天的能量提醒你：說「不」也是一種照顧自己的方式。設定界限不是自私，是負責。',
    actionSuggestion: '如果今天有人提出讓你為難的請求，給自己 24 小時再回覆。「讓我想想」是完全合理的回答。',
  },

  // ============================================
  // 十神主題
  // ============================================
  {
    id: 'ten-god-wealth-01',
    tags: ['zheng_cai', 'pian_cai', 'finance'],
    theme: '財富覺察',
    message: '今天的財星能量提醒你關注「價值交換」。財富不只是金錢，也包括你的時間、技能和注意力。',
    actionSuggestion: '花 10 分鐘檢視你最近的消費。有哪些帶來了真正的快樂？有哪些只是習慣性支出？',
  },
  {
    id: 'ten-god-authority-01',
    tags: ['zheng_guan', 'qi_sha', 'career'],
    theme: '領導時刻',
    message: '官星/殺星的能量帶來責任感和使命感。今天你可能需要為某件事做出決定或承擔責任——相信自己的判斷。',
    actionSuggestion: '如果有一個延宕的決定，今天就做。不完美的決定也比不做決定好。',
  },
  {
    id: 'ten-god-seal-01',
    tags: ['zheng_yin', 'pian_yin', 'wisdom'],
    theme: '智慧之印',
    message: '印星能量強化了你的學習力和洞察力。今天特別適合閱讀、思考和吸收新知識。',
    actionSuggestion: '找一本你一直想讀的書，今天至少讀完一章。或者和一位你尊敬的人聊聊天，向他們學習。',
  },
  {
    id: 'ten-god-expression-01',
    tags: ['shi_shen', 'shang_guan', 'creative'],
    theme: '表達創造',
    message: '食傷能量讓你的表達力和創造力達到高峰。今天說出的話、寫下的文字、做出的東西都會特別有感染力。',
    actionSuggestion: '創造一些東西。寫一篇日記、畫一幅畫、煮一道新菜——任何形式的創造都能釋放今天的能量。',
  },
  {
    id: 'ten-god-companion-01',
    tags: ['bi_jian', 'jie_cai', 'teamwork'],
    theme: '同行力量',
    message: '比劫能量帶來同儕的力量。今天你會發現身邊有人和你面臨類似的挑戰——你們可以互相支持。',
    actionSuggestion: '和同事或朋友分享你正在努力的事。你可能會驚訝地發現，他們正好有你需要的建議或資源。',
  },

  // ============================================
  // 月亮星座主題
  // ============================================
  {
    id: 'moon-fire-01',
    tags: ['moon-aries', 'moon-leo', 'moon-sagittarius', 'emotion'],
    theme: '情緒之火',
    message: '月亮在火象星座，今天的情緒能量熱烈而直接。讓自己感受這份強烈——它是你生命力的證明。',
    actionSuggestion: '用運動或任何身體活動來表達今天的情緒能量。跑步、跳舞、甚至大掃除都能幫助你釋放。',
  },
  {
    id: 'moon-earth-01',
    tags: ['moon-taurus', 'moon-virgo', 'moon-capricorn', 'emotion'],
    theme: '情緒紮根',
    message: '月亮在土象星座，今天你的情緒特別穩定踏實。利用這份安定感來處理一些需要耐心的事務。',
    actionSuggestion: '做一件讓你感覺「腳踏實地」的事：園藝、料理、整理空間，或是散步感受大地。',
  },
  {
    id: 'moon-air-01',
    tags: ['moon-gemini', 'moon-libra', 'moon-aquarius', 'emotion'],
    theme: '情緒輕盈',
    message: '月亮在風象星座，今天你的心智特別活躍。好奇心旺盛，適合社交和交流。',
    actionSuggestion: '找人聊天。不是為了解決問題，而是純粹享受思想的交流。一場好的對話能帶來意想不到的啟發。',
  },
  {
    id: 'moon-water-01',
    tags: ['moon-cancer', 'moon-scorpio', 'moon-pisces', 'emotion'],
    theme: '情緒深潛',
    message: '月亮在水象星座，今天你的情感特別細膩敏銳。這份敏感是禮物，不是弱點——它讓你能感受到別人感受不到的東西。',
    actionSuggestion: '如果今天感覺特別「有感覺」，給自己一些獨處的時間。聽一首你喜歡的歌、寫幾行字、或只是靜靜坐著。',
  },

  // ============================================
  // 通用正向
  // ============================================
  {
    id: 'fallback-positive-01',
    tags: ['fallback', 'general'],
    theme: '嶄新的一天',
    message: '每一天都是一個全新的開始。昨天的故事已經寫完了，今天的頁面是空白的。你是今天這一頁的作者。',
    actionSuggestion: '在今天開始之前，花 1 分鐘設定一個小小的意圖：「今天我想要______。」',
  },
  {
    id: 'fallback-positive-02',
    tags: ['fallback', 'general'],
    theme: '微小進步',
    message: '成長不需要戲劇性的突破。每天前進 1% 的人，一年後會進步 37 倍。你今天的小小努力，正在累積巨大的改變。',
    actionSuggestion: '今天做一件比昨天稍微好一點的事。多讀一頁書、多走 100 步、多喝一杯水——微小但持續。',
  },
  {
    id: 'fallback-positive-03',
    tags: ['fallback', 'general'],
    theme: '此刻安好',
    message: '深呼吸。在這一刻，你是安全的。不管腦中有多少待辦事項，此刻你只需要做一件事。',
    actionSuggestion: '每次感覺被壓力淹沒時，問自己：「我現在能做的一件最重要的事是什麼？」然後只做那件事。',
  },
];

/**
 * 根據標籤匹配模板
 */
export function matchTemplates(
  tags: readonly string[],
  limit: number = 3,
): FortuneTemplate[] {
  const scored = DAILY_TEMPLATES.map((template) => {
    const matchCount = template.tags.filter((tag) => tags.includes(tag)).length;
    return { template, score: matchCount };
  });

  scored.sort((a, b) => b.score - a.score);

  // 至少返回 fallback 模板
  const results = scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.template);

  if (results.length === 0) {
    const fallbacks = DAILY_TEMPLATES.filter((t) => t.tags.includes('fallback'));
    return fallbacks.slice(0, limit);
  }

  return results;
}
