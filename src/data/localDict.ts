export interface DictEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningZh: string;
  meaningEn: string;
  exampleEn: string;
  exampleZh: string;
}

export const LOCAL_DICTIONARY: Record<string, DictEntry> = {
  abandon: {
    word: "abandon",
    phonetic: "/əˈbændən/",
    partOfSpeech: "v.",
    meaningZh: "放弃；遗弃；中止",
    meaningEn: "To give up completely a practice or a course of action.",
    exampleEn: "They had to abandon the plan due to heavy rain.",
    exampleZh: "因为大雨，他们不得不放弃了这个计划。"
  },
  ability: {
    word: "ability",
    phonetic: "/əˈbɪləti/",
    partOfSpeech: "n.",
    meaningZh: "能力；本领；才能",
    meaningEn: "Possession of the means or skill to do something.",
    exampleEn: "She has an extraordinary ability to learn new languages.",
    exampleZh: "她拥有学习新语言的非凡能力。"
  },
  abundant: {
    word: "abundant",
    phonetic: "/əˈbʌndənt/",
    partOfSpeech: "adj.",
    meaningZh: "大量的；充裕的；丰富的",
    meaningEn: "Existing or available in large quantities; plentiful.",
    exampleEn: "The region is abundant in natural mineral resources.",
    exampleZh: "该地区自然矿产资源十分丰富。"
  },
  accelerate: {
    word: "accelerate",
    phonetic: "/əkˈseləreɪt/",
    partOfSpeech: "v.",
    meaningZh: "加速；加快；促进",
    meaningEn: "To increase in speed or rate of occurrence.",
    exampleEn: "New policies will accelerate economic growth.",
    exampleZh: "新政策将加快经济增长。"
  },
  accommodate: {
    word: "accommodate",
    phonetic: "/əˈkɒmədeɪt/",
    partOfSpeech: "v.",
    meaningZh: "容纳；提供住宿；顺应",
    meaningEn: "To provide lodging or sufficient space for somebody.",
    exampleEn: "The new hotel can accommodate over 500 guests.",
    exampleZh: "这家新酒店可容纳500多名宾客。"
  },
  achieve: {
    word: "achieve",
    phonetic: "/əˈtʃiːv/",
    partOfSpeech: "v.",
    meaningZh: "实现；达成；获得",
    meaningEn: "Successfully bring about or reach by effort or skill.",
    exampleEn: "With diligence, you will achieve your dreams.",
    exampleZh: "只要勤奋，你就能实现自己的梦想。"
  },
  acquire: {
    word: "acquire",
    phonetic: "/əˈkwaɪər/",
    partOfSpeech: "v.",
    meaningZh: "获得；学到；取得",
    meaningEn: "Buy or obtain for oneself; learn or develop a skill.",
    exampleEn: "Children acquire languages naturally and rapidly.",
    exampleZh: "孩子们能够自然且迅速地习得语言。"
  },
  adapt: {
    word: "adapt",
    phonetic: "/əˈdæpt/",
    partOfSpeech: "v.",
    meaningZh: "适应；改写；改造",
    meaningEn: "Make something suitable for a new use or purpose; become adjusted.",
    exampleEn: "Living organisms adapt to changing environments.",
    exampleZh: "生物体会适应不断变化的环境。"
  },
  aesthetic: {
    word: "aesthetic",
    phonetic: "/iːsˈθetɪk/",
    partOfSpeech: "adj. / n.",
    meaningZh: "美学的；审美的；悦目的",
    meaningEn: "Concerned with beauty or the appreciation of beauty.",
    exampleEn: "The building has great aesthetic appeal.",
    exampleZh: "这座建筑极具美学吸引力。"
  },
  ambition: {
    word: "ambition",
    phonetic: "/æmˈbɪʃn/",
    partOfSpeech: "n.",
    meaningZh: "抱负；志向；野心",
    meaningEn: "A strong desire to do or to achieve something.",
    exampleEn: "His ambition is to become a world-renowned scientist.",
    exampleZh: "他的抱负是成为一名世界著名的科学家。"
  },
  analyze: {
    word: "analyze",
    phonetic: "/ˈænəlaɪz/",
    partOfSpeech: "v.",
    meaningZh: "分析；剖析；解析",
    meaningEn: "Examine methodically and in detail the constitution or structure of.",
    exampleEn: "We must carefully analyze the experiment data.",
    exampleZh: "我们必须仔细分析实验数据。"
  },
  anticipate: {
    word: "anticipate",
    phonetic: "/ænˈtɪsɪpeɪt/",
    partOfSpeech: "v.",
    meaningZh: "预料；预期；期盼",
    meaningEn: "Regard as probable; expect or predict.",
    exampleEn: "We anticipate positive results from this project.",
    exampleZh: "我们期待这个项目能取得积极成果。"
  },
  authentic: {
    word: "authentic",
    phonetic: "/ɔːˈθentɪk/",
    partOfSpeech: "adj.",
    meaningZh: "真正的；真实的；地道的",
    meaningEn: "Of undisputed origin; genuine and accurate.",
    exampleEn: "This restaurant serves authentic Italian pasta.",
    exampleZh: "这家餐厅供应正宗的地道意大利面。"
  },
  benevolent: {
    word: "benevolent",
    phonetic: "/bəˈnevələnt/",
    partOfSpeech: "adj.",
    meaningZh: "仁慈的；乐善好施的；慈祥的",
    meaningEn: "Well meaning and kindly; serving a charitable purpose.",
    exampleEn: "A benevolent donor funded the school library.",
    exampleZh: "一位慈善捐助人为学校图书馆资助了建设款项。"
  },
  brilliant: {
    word: "brilliant",
    phonetic: "/ˈbrɪliənt/",
    partOfSpeech: "adj.",
    meaningZh: "杰出的；卓越的；灿烂的",
    meaningEn: "Exceptionally clever or talented; very bright.",
    exampleEn: "He proposed a brilliant idea that solved the problem.",
    exampleZh: "他提出了一个绝妙的想法，解决了这个问题。"
  },
  build: {
    word: "build",
    phonetic: "/bɪld/",
    partOfSpeech: "v. / n.",
    meaningZh: "建造；建立；逐步增强；体型",
    meaningEn: "To construct something by putting parts or materials together; to develop, strengthen or increase gradually.",
    exampleEn: "They plan to build a modern community medical center next year.",
    exampleZh: "他们计划明年建造一座现代化社区医疗中心。"
  },
  create: {
    word: "create",
    phonetic: "/kriˈeɪt/",
    partOfSpeech: "v.",
    meaningZh: "创造；创作；引起",
    meaningEn: "Bring something into existence; cause something to happen as a result of one's actions.",
    exampleEn: "The artist used recycled materials to create a stunning sculpture.",
    exampleZh: "这位艺术家利用回收材料创作出了一座令人赞叹的雕塑。"
  },
  design: {
    word: "design",
    phonetic: "/dɪˈzaɪn/",
    partOfSpeech: "v. / n.",
    meaningZh: "设计；构思；图案",
    meaningEn: "Decide upon the look and functioning of something by making a detailed sketch or plan.",
    exampleEn: "Engineers worked together to design an eco-friendly vehicle.",
    exampleZh: "工程师们齐心协力设计出了一款环保汽车。"
  },
  develop: {
    word: "develop",
    phonetic: "/dɪˈveləp/",
    partOfSpeech: "v.",
    meaningZh: "发展；开发；培养；成长",
    meaningEn: "Grow or cause to grow and become more mature, advanced, or elaborate.",
    exampleEn: "Reading every day will help you develop strong language skills.",
    exampleZh: "每天阅读将有助于你培养过硬的语言能力。"
  },
  improve: {
    word: "improve",
    phonetic: "/ɪmˈpruːv/",
    partOfSpeech: "v.",
    meaningZh: "改善；提高；改进",
    meaningEn: "Make or become better in quality, value, or condition.",
    exampleEn: "Consistent daily practice will dramatically improve your fluency.",
    exampleZh: "坚持日常练习将极大地提高你的流利度。"
  },
  practice: {
    word: "practice",
    phonetic: "/ˈpræktɪs/",
    partOfSpeech: "n. / v.",
    meaningZh: "练习；实践；惯例",
    meaningEn: "Repeated exercise in an activity or skill so as to acquire or maintain proficiency in it.",
    exampleEn: "Practice makes perfect when learning any foreign language.",
    exampleZh: "在学习任何外语时，熟能生巧永远是不二法门。"
  },
  remember: {
    word: "remember",
    phonetic: "/rɪˈmembər/",
    partOfSpeech: "v.",
    meaningZh: "记得；记住；记起",
    meaningEn: "Have in or be able to bring to one's mind an awareness of someone or something from the past.",
    exampleEn: "Spaced repetition helps you remember new words for a lifetime.",
    exampleZh: "间隔重复记忆法能帮助你终身牢记新单词。"
  },
  capable: {
    word: "capable",
    phonetic: "/ˈkeɪpəbl/",
    partOfSpeech: "adj.",
    meaningZh: "有能力的；有才能的；足以胜任的",
    meaningEn: "Having the ability, fitness, or quality necessary to do something.",
    exampleEn: "She is capable of handling complex challenges with calm.",
    exampleZh: "她完全有能力冷静地应对复杂的挑战。"
  },
  coherent: {
    word: "coherent",
    phonetic: "/kəʊˈhɪərənt/",
    partOfSpeech: "adj.",
    meaningZh: "连贯的；条理清楚的；一致的",
    meaningEn: "Logical and consistent; easy to understand.",
    exampleEn: "His argument was remarkably clear and coherent.",
    exampleZh: "他的论点非常清晰且条理分明。"
  },
  comprehensive: {
    word: "comprehensive",
    phonetic: "/ˌkɒmprɪˈhensɪv/",
    partOfSpeech: "adj.",
    meaningZh: "全面的；广泛的；综合的",
    meaningEn: "Complete; including all or nearly all elements or aspects.",
    exampleEn: "The report provides a comprehensive overview of the market.",
    exampleZh: "该报告提供了对市场的全面概述。"
  },
  diligent: {
    word: "diligent",
    phonetic: "/ˈdɪlɪdʒənt/",
    partOfSpeech: "adj.",
    meaningZh: "勤勉的；孜孜不倦的",
    meaningEn: "Having or showing care and conscientiousness in one's work.",
    exampleEn: "Diligent study is the true key to academic excellence.",
    exampleZh: "勤奋刻苦是取得优异学业成绩的真正钥匙。"
  },
  eloquent: {
    word: "eloquent",
    phonetic: "/ˈeləkwənt/",
    partOfSpeech: "adj.",
    meaningZh: "雄辩的；有说服力的；口才好的",
    meaningEn: "Fluent or persuasive in speaking or writing.",
    exampleEn: "Her eloquent speech moved the entire audience.",
    exampleZh: "她那充满说服力的雄辩演讲打动了在场所有听众。"
  },
  empathy: {
    word: "empathy",
    phonetic: "/ˈempəθi/",
    partOfSpeech: "n.",
    meaningZh: "共情；同理心；同感",
    meaningEn: "The ability to understand and share the feelings of another.",
    exampleEn: "Great leaders possess deep empathy for their team members.",
    exampleZh: "伟大的领导者对团队成员怀有深切的同理心。"
  },
  enhance: {
    word: "enhance",
    phonetic: "/ɪnˈhɑːns/",
    partOfSpeech: "v.",
    meaningZh: "提高；增加；加强",
    meaningEn: "Intensify, increase, or further improve the quality or value.",
    exampleEn: "Reading every day will greatly enhance your vocabulary.",
    exampleZh: "每天阅读会极大地丰富你的词汇量。"
  },
  enthusiasm: {
    word: "enthusiasm",
    phonetic: "/ɪnˈθjuːziæzəm/",
    partOfSpeech: "n.",
    meaningZh: "热情；热忱；狂热",
    meaningEn: "Intense and eager enjoyment, interest, or approval.",
    exampleEn: "He approached every new project with boundless enthusiasm.",
    exampleZh: "他带着无限的热情投入到每一个新项目中。"
  },
  epiphany: {
    word: "epiphany",
    phonetic: "/ɪˈpɪfəni/",
    partOfSpeech: "n.",
    meaningZh: "顿悟；神启；骤然领悟",
    meaningEn: "A moment of sudden and great revelation or insight.",
    exampleEn: "While taking a quiet walk, he had an sudden epiphany.",
    exampleZh: "在安静散步时，他突然有了一个顿悟。"
  },
  essential: {
    word: "essential",
    phonetic: "/ɪˈsenʃl/",
    partOfSpeech: "adj.",
    meaningZh: "必不可少的；极其重要的；本质的",
    meaningEn: "Absolutely necessary; extremely important.",
    exampleEn: "Water and sleep are essential to human health.",
    exampleZh: "水和睡眠对人体健康至关重要。"
  },
  flexible: {
    word: "flexible",
    phonetic: "/ˈfleksəbl/",
    partOfSpeech: "adj.",
    meaningZh: "灵活的；柔韧的；易适应的",
    meaningEn: "Capable of bending easily without breaking; adaptable to change.",
    exampleEn: "A flexible schedule allows better work-life balance.",
    exampleZh: "灵活的工作时间表有助于更好地平衡工作与生活。"
  },
  flourish: {
    word: "flourish",
    phonetic: "/ˈflʌrɪʃ/",
    partOfSpeech: "v.",
    meaningZh: "繁荣；茁壮成长；蓬勃发展",
    meaningEn: "Grow or develop in a healthy or vigorous way.",
    exampleEn: "The local arts and culture scene continues to flourish.",
    exampleZh: "当地的艺术与文化领域持续蓬勃发展。"
  },
  gratitude: {
    word: "gratitude",
    phonetic: "/ˈɡrætɪtjuːd/",
    partOfSpeech: "n.",
    meaningZh: "感激；感恩；谢意",
    meaningEn: "The quality of being thankful; readiness to show appreciation.",
    exampleEn: "She expressed heartfelt gratitude for all their help.",
    exampleZh: "她对他们所有的帮助表达了由衷的感激之情。"
  },
  harmony: {
    word: "harmony",
    phonetic: "/ˈhɑːməni/",
    partOfSpeech: "n.",
    meaningZh: "和谐；协调；和睦",
    meaningEn: "Agreement or concord; pleasing arrangement of parts.",
    exampleEn: "Humans must strive to live in harmony with nature.",
    exampleZh: "人类必须努力与大自然和谐共生。"
  },
  illuminate: {
    word: "illuminate",
    phonetic: "/ɪˈluːmɪneɪt/",
    partOfSpeech: "v.",
    meaningZh: "照亮；阐明；启发",
    meaningEn: "Light up; help to clarify or explain.",
    exampleEn: "The teacher used simple analogies to illuminate the concept.",
    exampleZh: "老师用简单的类比阐明了这个概念。"
  },
  inevitable: {
    word: "inevitable",
    phonetic: "/ɪnˈevɪtəbl/",
    partOfSpeech: "adj.",
    meaningZh: "不可避免的；必然发生的",
    meaningEn: "Certain to happen; unavoidable.",
    exampleEn: "Change is an inevitable part of modern life.",
    exampleZh: "变化是现代生活中不可避免的一部分。"
  },
  innovative: {
    word: "innovative",
    phonetic: "/ˈɪnəveɪtɪv/",
    partOfSpeech: "adj.",
    meaningZh: "创新的；革新的；新颖的",
    meaningEn: "Featuring new methods; advanced and original.",
    exampleEn: "The startup introduced an innovative solution for clean energy.",
    exampleZh: "这家初创公司推出了一种创新的清洁能源解决方案。"
  },
  insight: {
    word: "insight",
    phonetic: "/ˈɪnsaɪt/",
    partOfSpeech: "n.",
    meaningZh: "洞察力；深刻见解；眼光",
    meaningEn: "The capacity to gain an accurate and deep intuitive understanding.",
    exampleEn: "His years of experience gave him valuable insights.",
    exampleZh: "他多年的经验赋予了他宝贵的洞察力。"
  },
  integrity: {
    word: "integrity",
    phonetic: "/ɪnˈteɡrəti/",
    partOfSpeech: "n.",
    meaningZh: "正直；诚实；完整性",
    meaningEn: "The quality of being honest and having strong moral principles.",
    exampleEn: "A person of integrity always stands by their principles.",
    exampleZh: "一个正直的人总是坚守自己的原则。"
  },
  lucid: {
    word: "lucid",
    phonetic: "/ˈluːsɪd/",
    partOfSpeech: "adj.",
    meaningZh: "清晰易懂的；头脑清醒的",
    meaningEn: "Expressed clearly; easy to understand; thinking clearly.",
    exampleEn: "The professor delivered a lucid explanation of quantum physics.",
    exampleZh: "教授对量子物理学作出了清晰易懂的解释。"
  },
  meticulous: {
    word: "meticulous",
    phonetic: "/məˈtɪkjələs/",
    partOfSpeech: "adj.",
    meaningZh: "一丝不苟的；缜密的；极其细致的",
    meaningEn: "Showing great attention to detail; very careful and precise.",
    exampleEn: "He conducted meticulous research before publishing his paper.",
    exampleZh: "他在发表论文前进行了极其严密细致的研究。"
  },
  navigate: {
    word: "navigate",
    phonetic: "/ˈnævɪɡeɪt/",
    partOfSpeech: "v.",
    meaningZh: "导航；操纵；应对(困难)",
    meaningEn: "Plan and direct the route; find one's way through difficult terrain.",
    exampleEn: "She skillfully navigated through the complex negotiations.",
    exampleZh: "她巧妙地应对了复杂的谈判局面。"
  },
  optimistic: {
    word: "optimistic",
    phonetic: "/ˌɒptɪˈmɪstɪk/",
    partOfSpeech: "adj.",
    meaningZh: "乐观的；抱乐观看法的",
    meaningEn: "Hopeful and confident about the future.",
    exampleEn: "Despite hardships, she maintained an optimistic outlook on life.",
    exampleZh: "尽管历经磨难，她依然对生活保持着乐观的态度。"
  },
  perseverance: {
    word: "perseverance",
    phonetic: "/ˌpɜːsɪˈvɪərəns/",
    partOfSpeech: "n.",
    meaningZh: "坚持不懈；毅力；不屈不挠",
    meaningEn: "Persistence in doing something despite difficulty or delay.",
    exampleEn: "Success is the fruit of relentless perseverance.",
    exampleZh: "成功是坚持不懈的果实。"
  },
  perspective: {
    word: "perspective",
    phonetic: "/pəˈspektɪv/",
    partOfSpeech: "n.",
    meaningZh: "视角；观点；透视法",
    meaningEn: "A particular attitude toward or way of regarding something.",
    exampleEn: "Traveling opens your mind to different cultural perspectives.",
    exampleZh: "旅行能开阔视野，让你接纳不同的文化视角。"
  },
  profound: {
    word: "profound",
    phonetic: "/prəˈfaʊnd/",
    partOfSpeech: "adj.",
    meaningZh: "深奥的；深刻的；深沉的",
    meaningEn: "Very great or intense; having deep meaning.",
    exampleEn: "The book had a profound impact on my philosophical thinking.",
    exampleZh: "这本书对我的哲学思考产生了深远的影响。"
  },
  resilient: {
    word: "resilient",
    phonetic: "/rɪˈzɪliənt/",
    partOfSpeech: "adj.",
    meaningZh: "有韧性的；能迅速恢复的；适应力强的",
    meaningEn: "Able to withstand or recover quickly from difficult conditions.",
    exampleEn: "Children are often remarkably resilient in facing adversity.",
    exampleZh: "孩子们在面对逆境时往往具有惊人的韧性与复原力。"
  },
  serendipity: {
    word: "serendipity",
    phonetic: "/ˌserənˈdɪpəti/",
    partOfSpeech: "n.",
    meaningZh: "意外之喜；机缘巧合；不期而遇的幸运",
    meaningEn: "The occurrence of events by chance in a happy or beneficial way.",
    exampleEn: "Meeting an old friend in a distant city was pure serendipity.",
    exampleZh: "在遥远的城市偶遇老友纯粹是美妙的机缘巧合。"
  },
  tranquil: {
    word: "tranquil",
    phonetic: "/ˈtræŋkwɪl/",
    partOfSpeech: "adj.",
    meaningZh: "宁静的；安详的；平静的",
    meaningEn: "Free from disturbance; calm and peaceful.",
    exampleEn: "The morning lake was still and serene, truly tranquil.",
    exampleZh: "清晨的湖面平静祥和，十分宁静。"
  },
  unprecedented: {
    word: "unprecedented",
    phonetic: "/ʌnˈpresɪdentɪd/",
    partOfSpeech: "adj.",
    meaningZh: "史无前例的；空前的",
    meaningEn: "Never done or known before; extraordinary.",
    exampleEn: "The advancement in AI is occurring at an unprecedented speed.",
    exampleZh: "人工智能的发展正以前所未有的速度推进。"
  },
  versatile: {
    word: "versatile",
    phonetic: "/ˈvɜːsətaɪl/",
    partOfSpeech: "adj.",
    meaningZh: "多功能的；多才多艺的；万能的",
    meaningEn: "Able to adapt or be adapted to many different functions or activities.",
    exampleEn: "He is a versatile actor who excels in drama and comedy.",
    exampleZh: "他是一位多才多艺的演员，擅长正剧和喜剧。"
  },
  vibrant: {
    word: "vibrant",
    phonetic: "/ˈvaɪbrənt/",
    partOfSpeech: "adj.",
    meaningZh: "充满生机的；充满活力的；鲜艳的",
    meaningEn: "Full of energy, enthusiasm, and vitality.",
    exampleEn: "The city has a vibrant nightlife and rich cultural events.",
    exampleZh: "这座城市拥有充满生机的夜生活和丰富的文化活动。"
  },
  wisdom: {
    word: "wisdom",
    phonetic: "/ˈwɪzdəm/",
    partOfSpeech: "n.",
    meaningZh: "智慧；明智；知识",
    meaningEn: "The quality of having experience, knowledge, and good judgment.",
    exampleEn: "True wisdom comes from learning from one's own mistakes.",
    exampleZh: "真正的智慧来源于从自身的错误中吸取教训。"
  },
  zenith: {
    word: "zenith",
    phonetic: "/ˈzenɪθ/",
    partOfSpeech: "n.",
    meaningZh: "鼎盛时期；巅峰；天顶",
    meaningEn: "The time at which something is most powerful or successful.",
    exampleEn: "His athletic career reached its zenith with an Olympic gold medal.",
    exampleZh: "他的体育生涯随着一枚奥运金牌达到了巅峰。"
  },
  aspect: {
    word: "aspect",
    phonetic: "/ˈæspekt/",
    partOfSpeech: "n.",
    meaningZh: "方面；面貌；方向",
    meaningEn: "A particular part or feature of something.",
    exampleEn: "We need to consider every aspect of the problem.",
    exampleZh: "我们需要考虑这个问题的每一个方面。"
  },
  aspire: {
    word: "aspire",
    phonetic: "/əˈspaɪər/",
    partOfSpeech: "v.",
    meaningZh: "渴望；追求；立志",
    meaningEn: "Direct one's hopes or ambitions towards achieving something.",
    exampleEn: "Many young athletes aspire to compete in the Olympics.",
    exampleZh: "许多年轻运动员都渴望参加奥运会。"
  },
  assert: {
    word: "assert",
    phonetic: "/əˈsɜːrt/",
    partOfSpeech: "v.",
    meaningZh: "断言；主张；维护",
    meaningEn: "State a fact or belief confidently and forcefully.",
    exampleEn: "She continued to assert her innocence throughout the trial.",
    exampleZh: "在整个审判过程中，她始终坚持自己的清白。"
  },
  assess: {
    word: "assess",
    phonetic: "/əˈses/",
    partOfSpeech: "v.",
    meaningZh: "评估；评定；核定",
    meaningEn: "Evaluate or estimate the nature, ability, or quality of.",
    exampleEn: "The committee will assess the feasibility of the project.",
    exampleZh: "委员会将评估该项目的可行性。"
  },
  asset: {
    word: "asset",
    phonetic: "/ˈæset/",
    partOfSpeech: "n.",
    meaningZh: "资产；财富；有价值的人或物",
    meaningEn: "A useful or valuable quality, person, or thing.",
    exampleEn: "Her fluency in three languages is a tremendous asset.",
    exampleZh: "她精通三种语言是一笔巨大的财富。"
  },
  assist: {
    word: "assist",
    phonetic: "/əˈsɪst/",
    partOfSpeech: "v.",
    meaningZh: "帮助；协助；援助",
    meaningEn: "Help typically by providing money or information.",
    exampleEn: "The AI tool is designed to assist developers in writing code.",
    exampleZh: "这款人工智能工具旨在帮助开发者编写代码。"
  },
  associate: {
    word: "associate",
    phonetic: "/əˈsəʊʃieɪt/",
    partOfSpeech: "v.",
    meaningZh: "联系；联想；交往",
    meaningEn: "Connect someone or something in one's mind with someone or something else.",
    exampleEn: "People usually associate sunshine with happiness and energy.",
    exampleZh: "人们通常把阳光与快乐和活力联系在一起。"
  },
  assume: {
    word: "assume",
    phonetic: "/əˈsjuːm/",
    partOfSpeech: "v.",
    meaningZh: "假定；设想；承担",
    meaningEn: "Suppose to be the case, without proof; take on responsibility.",
    exampleEn: "Let us not assume the outcome before seeing the data.",
    exampleZh: "在看到数据之前，我们不要对结果妄加揣测。"
  },
  assure: {
    word: "assure",
    phonetic: "/əˈʃʊər/",
    partOfSpeech: "v.",
    meaningZh: "向...保证；使确信；确保",
    meaningEn: "Tell someone something positively or confidently to dispel doubts.",
    exampleEn: "I can assure you that everything is running according to plan.",
    exampleZh: "我可以向你保证，一切都在按计划顺利进行。"
  },
  astonish: {
    word: "astonish",
    phonetic: "/əˈstɒnɪʃ/",
    partOfSpeech: "v.",
    meaningZh: "使十分惊讶；使大吃一惊",
    meaningEn: "Surprise or impress someone greatly.",
    exampleEn: "Her breathtaking performance astonished the entire crowd.",
    exampleZh: "她那惊艳全场的表演让所有观众大为赞叹。"
  },
  astute: {
    word: "astute",
    phonetic: "/əˈstjuːt/",
    partOfSpeech: "adj.",
    meaningZh: "机敏的；精明的；敏锐的",
    meaningEn: "Having or showing an ability to accurately assess situations.",
    exampleEn: "His astute business sense made the company a huge success.",
    exampleZh: "他精明的商业敏锐度让这家公司获得了巨大的成功。"
  },
  esthetic: {
    word: "esthetic",
    phonetic: "/esˈθetɪk/",
    partOfSpeech: "adj. / n.",
    meaningZh: "美学的；审美的（aesthetic美式拼写变体）",
    meaningEn: "American spelling variant of aesthetic; concerned with beauty.",
    exampleEn: "The modern design emphasizes both functionality and esthetic appeal.",
    exampleZh: "这一现代设计同时强调了功能性与美学吸引力。"
  },
  run: {
    word: "run",
    phonetic: "/rʌn/",
    partOfSpeech: "v. / n.",
    meaningZh: "跑，奔跑；运转，管理；连续赛程",
    meaningEn: "To move at a speed faster than a walk; to manage or operate something.",
    exampleEn: "She goes for a five-mile run every morning.",
    exampleZh: "她每天早晨进行五英里的晨跑。"
  },
  work: {
    word: "work",
    phonetic: "/wɜːk/",
    partOfSpeech: "v. / n. / adj.",
    meaningZh: "工作，劳动；运转，奏效；作品，职业",
    meaningEn: "Activity involving mental or physical effort done in order to achieve a purpose or result.",
    exampleEn: "Hard work and dedication always yield great rewards.",
    exampleZh: "辛勤的工作与奉献终将带来丰厚的回报。"
  },
  play: {
    word: "play",
    phonetic: "/pleɪ/",
    partOfSpeech: "v. / n.",
    meaningZh: "玩耍；演奏，播放；剧本，比赛",
    meaningEn: "Engage in activity for enjoyment and recreation rather than a serious purpose.",
    exampleEn: "Children love to play freely in the community park.",
    exampleZh: "孩子们喜欢在社区公园里自由自在地玩耍。"
  },
  study: {
    word: "study",
    phonetic: "/ˈstʌdi/",
    partOfSpeech: "v. / n.",
    meaningZh: "学习，攻读；研究，调查；书房",
    meaningEn: "The devotion of time and attention to gaining knowledge of an academic subject.",
    exampleEn: "He spends two hours every evening studying English vocabulary.",
    exampleZh: "他每天晚上花两个小时学习英语词汇。"
  },
  love: {
    word: "love",
    phonetic: "/lʌv/",
    partOfSpeech: "v. / n.",
    meaningZh: "喜爱，爱恋；热爱；关爱，爱情",
    meaningEn: "An intense feeling of deep affection or great pleasure in something.",
    exampleEn: "She truly loves exploring new cultures and languages.",
    exampleZh: "她由衷地热爱探索新的文化与语言。"
  },
  book: {
    word: "book",
    phonetic: "/bʊk/",
    partOfSpeech: "n. / v.",
    meaningZh: "书籍，册子；预订，预约",
    meaningEn: "A written or printed work consisting of pages bound together; to reserve something in advance.",
    exampleEn: "Remember to book your tickets in advance for the exhibition.",
    exampleZh: "记得提前为这次展览预订门票。"
  },
  water: {
    word: "water",
    phonetic: "/ˈwɔːtər/",
    partOfSpeech: "n. / v.",
    meaningZh: "水，水域；浇水，灌溉",
    meaningEn: "A colorless, transparent, odorless liquid; to pour water on plants.",
    exampleEn: "Don't forget to water the indoor plants twice a week.",
    exampleZh: "别忘了每周给室内植物浇两次水。"
  },
  light: {
    word: "light",
    phonetic: "/laɪt/",
    partOfSpeech: "n. / adj. / v.",
    meaningZh: "光线，光芒；轻便的，浅色的；点燃，照亮",
    meaningEn: "The natural agent that stimulates sight and makes things visible; of little weight.",
    exampleEn: "The morning light streamed softly through the bedroom window.",
    exampleZh: "晨光柔和地洒进卧室的窗台。"
  },
  train: {
    word: "train",
    phonetic: "/treɪn/",
    partOfSpeech: "n. / v.",
    meaningZh: "火车，列车；训练，培训",
    meaningEn: "A series of connected railway carriages or wagons; to teach a particular skill or type of behavior.",
    exampleEn: "Athletes train rigorously every day to reach peak physical form.",
    exampleZh: "运动员们每天严格训练以达到巅峰体能状态。"
  },
  kind: {
    word: "kind",
    phonetic: "/kaɪnd/",
    partOfSpeech: "adj. / n.",
    meaningZh: "亲切的，善良的；种类，类型",
    meaningEn: "Having or showing a friendly, generous, and considerate nature; a group with similar characteristics.",
    exampleEn: "Always be kind and considerate to people around you.",
    exampleZh: "对周围的人始终保持友善与体贴。"
  },
  fast: {
    word: "fast",
    phonetic: "/fɑːst/",
    partOfSpeech: "adj. / adv.",
    meaningZh: "快的，迅速的；迅速地，紧紧地",
    meaningEn: "Moving or capable of moving at high speed; firmly fixed or attached.",
    exampleEn: "Technological progress is happening at a very fast pace.",
    exampleZh: "科技进步正以极其迅速的步伐向前迈进。"
  },
  hard: {
    word: "hard",
    phonetic: "/hɑːd/",
    partOfSpeech: "adj. / adv.",
    meaningZh: "坚硬的，困难的；努力地，猛烈地",
    meaningEn: "Solid and firm; done with a great deal of force, endurance, or effort.",
    exampleEn: "She worked hard every day to achieve her academic aspirations.",
    exampleZh: "她每天刻苦努力以实现自己的学业抱负。"
  },
  well: {
    word: "well",
    phonetic: "/wel/",
    partOfSpeech: "adv. / adj. / n.",
    meaningZh: "良好地，顺利地；健康的；水井，源泉",
    meaningEn: "In a good or satisfactory manner; in good health.",
    exampleEn: "Everything went remarkably well during the presentation.",
    exampleZh: "演讲过程中一切都进行得异常顺利。"
  },
  mind: {
    word: "mind",
    phonetic: "/maɪnd/",
    partOfSpeech: "n. / v.",
    meaningZh: "头脑，心智；介意，留意",
    meaningEn: "The element of a person that enables them to be aware of the world and their experiences; to object to.",
    exampleEn: "Keep an open mind when listening to different perspectives.",
    exampleZh: "倾听不同视角时，请保持开放的心态。"
  },
  time: {
    word: "time",
    phonetic: "/taɪm/",
    partOfSpeech: "n. / v.",
    meaningZh: "时间，时代，时机；测定时间，安排时间",
    meaningEn: "The indefinite continued progress of existence and events; to measure the time taken by.",
    exampleEn: "Time and consistency are the greatest keys to mastery.",
    exampleZh: "时间与坚持是通往精通的最伟大钥匙。"
  },
  change: {
    word: "change",
    phonetic: "/tʃeɪndʒ/",
    partOfSpeech: "v. / n.",
    meaningZh: "改变，变革；零钱，变化",
    meaningEn: "Make or become different; the act or instance of making or becoming different.",
    exampleEn: "Embrace positive change as a pathway to personal growth.",
    exampleZh: "拥抱积极的改变，将其作为个人成长的途径。"
  },
  help: {
    word: "help",
    phonetic: "/help/",
    partOfSpeech: "v. / n.",
    meaningZh: "帮助，协助；援助，有益的事物",
    meaningEn: "Make it easier for someone to do something by offering services or resources.",
    exampleEn: "Never hesitate to help someone who is in genuine need.",
    exampleZh: "帮助真正需要的人时，永远不要犹豫。"
  },
  focus: {
    word: "focus",
    phonetic: "/ˈfəʊkəs/",
    partOfSpeech: "v. / n.",
    meaningZh: "聚焦，集中；焦点，核心",
    meaningEn: "Adapt to the prevailing level of light and become able to see clearly; the center of interest or activity.",
    exampleEn: "Deep focus enables you to complete complex tasks efficiently.",
    exampleZh: "深度专注能让你高效完成复杂的任务。"
  },
  order: {
    word: "order",
    phonetic: "/ˈɔːdər/",
    partOfSpeech: "n. / v.",
    meaningZh: "秩序，指令，订单；命令，订购，整理",
    meaningEn: "The arrangement or disposition of people or things; to give an authoritative direction.",
    exampleEn: "Maintain neat order on your desk to boost productivity.",
    exampleZh: "保持书桌整洁有序以提高学习工作效率。"
  },
  plan: {
    word: "plan",
    phonetic: "/plæn/",
    partOfSpeech: "n. / v.",
    meaningZh: "计划，方案；规划，打算",
    meaningEn: "A detailed proposal for doing or achieving something; to decide on and arrange in advance.",
    exampleEn: "A well-thought-out plan turns ambitious goals into reality.",
    exampleZh: "深思熟虑的周密计划能将宏伟目标变为现实。"
  },
  sound: {
    word: "sound",
    phonetic: "/saʊnd/",
    partOfSpeech: "n. / v. / adj.",
    meaningZh: "声音；听起来；健全的，可靠的",
    meaningEn: "Vibrations that travel through the air; to convey a specified impression; in good condition.",
    exampleEn: "His financial advice was based on sound practical principles.",
    exampleZh: "他的财务建议建立在健全务实的原则之上。"
  },
  value: {
    word: "value",
    phonetic: "/ˈvæljuː/",
    partOfSpeech: "n. / v.",
    meaningZh: "价值，重要性；珍视，估价",
    meaningEn: "The regard that something is held to deserve; the importance, worth, or usefulness.",
    exampleEn: "We deeply value the trust and loyalty of our community.",
    exampleZh: "我们由衷地珍视社区赋予的信任与支持。"
  },
  support: {
    word: "support",
    phonetic: "/səˈpɔːt/",
    partOfSpeech: "v. / n.",
    meaningZh: "支持，赞助；支撑物，拥护",
    meaningEn: "Bear all or part of the weight of; give assistance, encouragement, or approval to.",
    exampleEn: "True friends always support each other during difficult moments.",
    exampleZh: "真正的朋友总是在艰难时刻相互支持鼓励。"
  },
  impact: {
    word: "impact",
    phonetic: "/ˈɪmpækt/",
    partOfSpeech: "n. / v.",
    meaningZh: "影响，冲击力；产生影响，冲击",
    meaningEn: "The action of one object coming forcibly into contact with another; a marked effect or influence.",
    exampleEn: "Positive habits create a profound long-term impact on your life.",
    exampleZh: "良好的习惯会对你的整个人生产生深远持久的影响。"
  },
  challenge: {
    word: "challenge",
    phonetic: "/ˈtʃælɪndʒ/",
    partOfSpeech: "n. / v.",
    meaningZh: "挑战，艰巨任务；向...挑战",
    meaningEn: "A call to take part in a contest or competition; a task that tests someone's abilities.",
    exampleEn: "Every new challenge brings an opportunity to learn and grow.",
    exampleZh: "每一个新挑战都带来学习与成长的绝佳机会。"
  },
  experience: {
    word: "experience",
    phonetic: "/ɪkˈspɪəriəns/",
    partOfSpeech: "n. / v.",
    meaningZh: "经验，经历；体会，体验",
    meaningEn: "Practical contact with and observation of facts or events; to encounter or undergo.",
    exampleEn: "Traveling allows you to experience diverse cultural traditions firsthand.",
    exampleZh: "旅行让你能够亲身体验丰富多元的文化传统。"
  },
  process: {
    word: "process",
    phonetic: "/ˈprəʊses/",
    partOfSpeech: "n. / v.",
    meaningZh: "过程，工序；处理，加工",
    meaningEn: "A series of actions or steps taken in order to achieve a particular end; to perform operations on.",
    exampleEn: "Learning a new language is a gradual and rewarding process.",
    exampleZh: "学习一门新语言是一个渐进且充满成就感的过程。"
  }
};

