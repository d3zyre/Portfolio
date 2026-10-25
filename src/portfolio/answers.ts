/**
 * The answer bank behind typed questions. No AI model and no server: a typed
 * question is matched to the closest entry here by its words, so the chat can
 * only ever say what's written below. Edit answers freely; add `words` to help
 * a question find its answer.
 */

export type Answer = {
  /** Words that point to this answer. Each match adds to its score. */
  words: string[]
  /** Short phrases that point to this answer more strongly. */
  phrases?: string[]
  /** One answer, or a few variations to rotate through so repeats don't feel canned. */
  text: string | string[]
}

export const FALLBACK =
  "I haven't written an answer for that one yet. Email me at akanksha.guptaa4@gmail.com and I'll reply properly, or try asking about my projects, internships or how I work."

export const answers: Answer[] = [
  // Personal and interview-style questions, answered only from what's already on the site.
  { words: ['enjoy', 'love', 'passion', 'passionate', 'excites', 'excite', 'interest', 'interested', 'motivates', 'motivate'],
    phrases: ['what do you like', 'what you like', 'what do you love', 'what do you enjoy', 'what excites you', 'what are you passionate about', 'what drives you'],
    text: [
      "I love how humans interact with cool tech. I enjoy walking into a domain I don't know, like a doctor's OPD or a flood-hit island, and making something complicated feel obvious to the person using it.",
      "Unfamiliar problems! I like learning a new domain from the people in it, then building a prototype to see if my idea actually holds up. Outside work: Rubik's cubes, chess and games.",
    ] },
  { words: ['strength', 'strengths', 'best', 'superpower', 'good'],
    phrases: ['what are you good at', 'your strengths', 'biggest strength', 'what makes you different', 'why should we hire you', 'why hire you'],
    text: "Two things. I go into domains I don't know and talk to the people in them before deciding anything, like the seven interviews behind Prescribble. And I build working prototypes, so ideas get tested in use, not just on screen. Prescribble and ChemAR both run live in the browser." },
  { words: ['weakness', 'weaknesses', 'improve', 'improving', 'mistake', 'mistakes', 'failure', 'failed', 'wrong'],
    phrases: ['biggest weakness', 'what would you do differently', 'a mistake you made', 'what went wrong'],
    text: "On Wordgate, I relied on the founder to relay feedback from players. It was useful, but filtered. Next time I'd run sessions myself, include brand-new players, and start from accessibility standards (WCAG) instead of checking contrast and tap sizes at the end." },
  { words: ['favourite', 'favorite', 'proud', 'proudest'],
    phrases: ['favourite project', 'favorite project', 'most proud of', 'best project', 'which project'],
    text: "Glance Coach is the one I'd show first: a workout coach for a shared family TV, made in 48 hours (/glance/). ResQ (/resq/) is my favourite story to tell, because it's designed for the floods in Assam, where I live." },
  { words: ['challenge', 'challenging', 'hardest', 'hard', 'difficult', 'tough', 'problem'],
    phrases: ['hardest problem', 'biggest challenge', 'most difficult', 'toughest'],
    text: "In Glance Coach, the hardest part was that the TV is shared with the whole family. Profiles and on-screen cards both failed, because anyone in the room could see them. So the agent talks only on her phone, and the TV shows nothing until she presses play." },
  { words: ['learn', 'learned', 'learnt', 'lesson', 'lessons', 'takeaway', 'takeaways'],
    phrases: ['what did you learn', 'what have you learned', 'biggest lesson'],
    text: "Bringing working options beats arguing opinions: on Wordgate, two or three alternatives per flow turned \"I don't like it\" into \"this one feels better\". And the fix is rarely more instructions; it's one clear sentence in the right place." },
  { words: ['team', 'teams', 'collaborate', 'collaboration', 'collaborating', 'stakeholder', 'stakeholders', 'feedback', 'critique', 'disagree', 'conflict'],
    phrases: ['work with developers', 'work with engineers', 'handle feedback', 'take feedback', 'work in a team'],
    text: "At Mobiclay I was the only designer, working with the founder and a developer. Every flow went to them as two or three working options, we chose on pros and cons, and the developer saw everything early, so feasibility came up before handoff, not after." },
  { words: ['accessibility', 'accessible', 'inclusive', 'inclusion', 'wcag', 'a11y'],
    phrases: ['design for accessibility', 'accessible design'],
    text: "In ResQ, nothing depends on reading English: Assamese and Hindi sit in their own scripts, and you can ask for help by voice. Prescribble lets doctors keep their pen instead of learning to type. On Wordgate, my one regret is checking accessibility at the end; next time I'd start from WCAG." },
  { words: ['resume', 'cv'],
    phrases: ['your resume', 'download resume', 'see your resume'],
    text: "It's the Download Resume button at the bottom of the sidebar. Happy to walk through any of it too: akanksha.guptaa4@gmail.com." },
  { words: ['looking', 'internship', 'summer', '2027', 'role', 'roles', 'job', 'opening'],
    phrases: ['are you looking', 'open to work', 'looking for', 'summer internship', 'next internship'],
    text: "Yes! I'm looking for a product or UX design internship for summer 2027. The quickest way to reach me is akanksha.guptaa4@gmail.com." },
  { words: ['research', 'methods', 'usability', 'interviews', 'survey', 'surveys', 'testing'],
    phrases: ['research methods', 'how do you research', 'user testing', 'usability testing'],
    text: "It depends on the project: seven semi-structured interviews for Prescribble, 19 survey responses and four discussions for ResQ, and clickable Figma prototypes tested with returning players for Wordgate. I pick the method by what I need to learn, then check ideas with a working prototype." },
  { words: ['hi', 'hello', 'hey', 'hii', 'heyy', 'howdy', 'yo', 'sup', 'namaste', 'hola'],
    text: [
      "Hi! I'm Akanksha. Ask me about my projects, my internships, or how I work, and I'll point you to the right case study.",
      "Hey there! Welcome in. Want the quick tour? Ask \"what have you built?\"",
      "Hello! Anything you're curious about? My projects, how I work, or where I've interned.",
    ] },

  { words: ['who', 'yourself', 'introduce', 'about', 'background', 'summary'],
    phrases: ['about you', 'tell me about yourself', 'who are you'],
    text: "I'm a product and interaction designer studying for my B.Des at IIT Guwahati, graduating in 2028. I like unfamiliar domains, like a doctor's OPD or a flood-hit island, and making them simple for the person in the middle of it." },

  { words: ['education', 'college', 'university', 'degree', 'bdes', 'iit', 'guwahati', 'graduate', 'graduating', 'year', 'cgpa', 'gpa', 'grades', 'study', 'studying', 'student', 'uceed', 'rank'],
    text: "I'm doing a Bachelor of Design at IIT Guwahati (2024 to 2028), with a CGPA of 8.31. I got in through UCEED 2024 with an All India Rank of 38." },

  { words: ['projects', 'work', 'portfolio', 'built', 'build', 'made', 'case', 'studies', 'show'],
    phrases: ['what have you built', 'your work', 'case studies'],
    text: "Five. The main four: Glance Coach, a workout coach for a shared TV (/glance/); Prescribble, handwritten prescriptions on iPad (/prescribble/); Wordgate, from my internship (/wordgate/); and ResQ, disaster communication for Assam (/resq/). Then ChemAR, AR chemistry built with AI (/chem-ar/)." },

  { words: ['glance', 'inmobi', 'workout', 'fitness', 'tv', 'television', 'remote', 'agent', 'coach', 'shared', 'living', 'exercise', 'maasi'],
    text: "Glance Coach is an AI workout coach that lives on the phone and a shared family TV, made in 48 hours for a design exercise. It sizes each evening workout to the day you've had, talks only on your phone, and counts a 15-minute session as a win. Case study at /glance/." },

  { words: ['glance', 'tv', 'shared', 'privacy', 'private', 'nudge', 'notification', 'silent'],
    phrases: ['shared tv', 'why phone', 'why not the tv', 'on the tv', 'show it on the tv', 'on tv'],
    text: "In Glance Coach the TV is shared with the whole family, so the agent never speaks on it: it talks only on your phone, sends one nudge a day, and the TV shows nothing until you press play. The TV only ever receives a workout title and length." },

  { words: ['glance', 'guilt', 'short', 'counts', 'minutes', 'skip', 'skipped'],
    phrases: ['that counts', '15 minutes'],
    text: "The insight behind Glance Coach: one too-hard workout leads to guilt, and guilt leads to a skipped day. So stopping early is a normal ending, and the TV says \"15 minutes. That counts.\" Her rating then resizes tomorrow's plan." },

  { words: ['resq', 'disaster', 'flood', 'floods', 'assam', 'mesh', 'emergency', 'rescue', 'char', 'earthquake'],
    text: "ResQ is a disaster communication app for Assam that keeps working over a phone-to-phone mesh network when cell towers fail. If 200 phones exist on a cut-off island, 200 nodes of a rescue network exist too. The case study is at /resq/." },

  { words: ['resq', 'language', 'languages', 'assamese', 'hindi', 'multilingual', 'script', 'literacy', 'accessible', 'accessibility'],
    phrases: ['own language'],
    text: "In ResQ, Assamese and Hindi are set in their own scripts, so recognising your language never depends on reading English first. It also supports voice requests, because people in a crisis can't always read, think or type normally." },

  { words: ['resq', 'human', 'coordinator', 'coordinators', 'domain', 'domains', 'field', 'team', 'volunteer', 'volunteers'],
    phrases: ['field team', 'who sees what'],
    text: "In ResQ, a request first goes to nearby volunteers. If nobody can take it, it lands with one of three coordinators: medical, search and rescue, or resources and shelter. Each sees only their own domain, and field teams see only the cases assigned to them, so nobody is flooded with every report." },

  { words: ['prescribble', 'prescription', 'prescriptions', 'doctor', 'doctors', 'ipad', 'pencil', 'handwriting', 'opd', 'healthcare', 'medical', 'pharmacist'],
    text: "Prescribble is an iPad prescription system for busy government OPDs. Doctors won't give up speed to write more clearly, so I stopped asking them to: they keep writing with Apple Pencil, and the system makes it readable, finds the drug and keeps the record. Case study at /prescribble/." },

  { words: ['prescribble', 'research', 'interview', 'interviews', 'interviewed', 'users', 'talked', 'spoke'],
    phrases: ['user research', 'how did you research'],
    text: "For Prescribble I ran seven semi-structured interviews of about 20 minutes each: four doctors, two patients and a pharmacist. Each described the problem differently, but it was the same breakdown seen from three sides." },

  { words: ['prescribble', 'decisions', 'decision', 'salt', 'generic', 'dosage', 'blocks', 'form'],
    phrases: ['key decisions'],
    text: "Three decisions carry Prescribble: suggestions list by salt (the generic name) first, so writing \"Clotrim\" narrows 42 options to 3; dosage takes three taps using the 1-0-1 pattern doctors already write; and a prescription is made of blocks, not a long form." },

  { words: ['typing', 'typed', 'voice', 'dictation', 'rejected', 'alternatives', 'alternative'],
    phrases: ['paths not taken', 'why not typing', 'why not voice'],
    text: "For Prescribble, the obvious answers were typing and talking, and doctors rejected both. Typing assumes a long consultation, and voice fails in noisy clinics, with varied accents, and when there's a queue of patients right outside." },

  { words: ['prototype', 'deployed', 'live', 'tested', 'test', 'testing', 'demo', 'try'],
    phrases: ['is it live', 'can i try'],
    text: "Prescribble is a real, deployed build at prescribble.vercel.app, and you can use it inside the case study at /prescribble/. ChemAR also runs in the browser with hand tracking." },

  { words: ['chemar', 'chem', 'chemistry', 'ar', 'augmented', 'molecule', 'molecules', 'education', 'educators', 'teachers', 'unity', 'mediapipe', 'hand', 'tracking'],
    text: "ChemAR started from a question: can AI help non-technical educators make interactive learning material? I built an AI-assisted, no-code workflow and tested it by making ChemAR, where students build organic molecules with hand tracking. Case study at /chem-ar/." },

  { words: ['published', 'publication', 'paper', 'springer', 'conference', 'ric'],
    text: "ChemAR's workflow was presented at RIC, IIT Guwahati, and accepted for publication by Springer Nature." },

  { words: ['experience', 'internship', 'internships', 'interned', 'worked', 'jobs', 'job', 'companies'],
    phrases: ['where have you worked', 'where have you interned', 'past internships'],
    text: "Three places so far: Mobiclay Technology (UI/UX intern, sole designer on Wordgate, 2026), Creative Banjara (visual design intern, 2025), and ArtLabs (workshop facilitator, 2023 to 2024). They're all in the sidebar." },

  { words: ['mobiclay', 'wordgate', 'game', 'word', 'intern', 'startup', 'sole'],
    text: "At Mobiclay I was the sole designer on Wordgate, a strategy word game whose first version had shipped. Players kept coming back but had to guess how it worked, so I redesigned it to be easy to understand and quick to get around, across 10+ flows and 120+ screens, and filled in the hosting and Wordmine flows that didn't exist yet. Case study at /wordgate/." },

  { words: ['wordgate', 'mobiclay', 'testing', 'tested', 'validate', 'validated', 'feedback', 'ab'],
    phrases: ['a/b', 'how did you test'],
    text: "Wordgate's testing was informal: I brought two or three alternatives for each flow to the founder and developer, and for bigger flows, like the home screen, the founder shared Figma prototypes with a small group of players who knew version 1. That round caught two swipes fighting each other on the home screen. It wasn't formal A/B testing." },

  { words: ['wordgate', 'launched', 'shipped', 'status', 'nda', 'built'],
    text: "The Wordgate redesign was built alongside the developer, and I reviewed each build on a phone. It hasn't launched yet, and some of it is under NDA. Happy to walk through it on a call." },

  { words: ['system', 'components', 'tokens', 'consistency'],
    phrases: ['design system'],
    text: "On Wordgate I set up reusable components and gave each kind of play one colour: green for solo, red for hosted games, brown for Wordmine. It isn't a full design system yet, but it kept 120+ screens consistent." },

  { words: ['creative', 'banjara', 'branding', 'brand', 'packaging', 'visual', 'graphic', 'illustrator'],
    text: "At Creative Banjara I did branding, packaging and presentation decks for 6+ client brands across legal, F&B, fashion and nutrition, working directly with the founder. I taught myself Illustrator in two weeks for it." },

  { words: ['artlabs', 'workshop', 'workshops', 'community', 'jamshedpur'],
    text: "At ArtLabs I was one of six core team members behind one of Jamshedpur's first creative workshop studios. We grew the community to 1,200+ members and ran 20+ workshops in a year." },

  { words: ['skills', 'tools', 'figma', 'software', 'photoshop', 'procreate', 'stack'],
    text: "I work in Figma, Photoshop, Illustrator, InDesign and Procreate, and prototype with Claude Code and Vercel. My skills cover user research, information architecture, user flows, wireframing, high-fidelity prototyping, service blueprints and systems thinking." },

  { words: ['process', 'approach', 'method', 'methods', 'start', 'think'],
    phrases: ['how do you work', 'your process', 'design process'],
    text: "I start by talking to the people involved, since my projects usually live in domains I don't know yet. Then I sketch the structure before it looks finished, and build a working prototype to see if the idea holds up in use." },

  { words: ['code', 'coding', 'developer', 'engineering', 'ai', 'claude', 'vibe', 'terminal'],
    phrases: ['do you code', 'ai prototyping'],
    text: "I design interfaces and then build them into working prototypes, often with AI tools like Claude Code, so I can test real behaviour before handoff. Prescribble and ChemAR both run live in the browser." },

  { words: ['leadership', 'mun', 'lead', 'led', 'team', 'coordinator', 'ccd', 'placement'],
    text: "I'm Director of Design for IITG MUN'27 (promoted from Head of Design for MUN'26), leading the visual identity for 150+ participants. I was also a student coordinator at IIT Guwahati's Centre for Career Development." },

  { words: ['hobbies', 'hobby', 'fun', 'free', 'outside', 'interests', 'chess', 'rubik', 'cube', 'gaming', 'games'],
    phrases: ['what are you into'],
    text: "Outside work you'll find me solving a Rubik's cube, playing chess or gaming." },

  { words: ['contact', 'email', 'mail', 'reach', 'linkedin', 'connect', 'call', 'hire', 'hiring', 'available', 'availability', 'opportunity', 'opportunities'],
    text: "Email me at akanksha.guptaa4@gmail.com, or find me on LinkedIn at linkedin.com/in/akanksha-gupta4. I'd love to hear from you." },

  { words: ['resume', 'cv'],
    text: "My resume is at /assets/resume.pdf, and the Download Resume button is in the sidebar." },

  // Draft written from the case studies. Edit it into your own words.
  { words: ['hire', 'why', 'strengths', 'strength', 'different', 'stand', 'special', 'unique', 'value'],
    phrases: ['why should we hire you', 'why you', 'what makes you different', 'stand out'],
    text: "I go into domains I don't know, talk to the people in them, and make decisions I can defend: in Prescribble, doctors rejected typing and voice, so I kept the pen. Then I build working prototypes to check the idea holds up, and Prescribble and ChemAR both run live." },

  { words: ['salary', 'pay', 'stipend', 'compensation'],
    text: "That's best discussed over email: akanksha.guptaa4@gmail.com." },

  { words: ['chat', 'bot', 'chatbot', 'gpt', 'chatgpt', 'real', 'fake', 'answering'],
    phrases: ['are you ai', 'are you real', 'how does this chat work'],
    text: "No AI model here: typed questions are matched to answers I wrote myself, so nothing in this chat is made up. If I haven't written an answer yet, I'll point you to my email." },

  // Small talk. Playful on purpose; edit freely, but keep it true.
  { words: ['how', 'doing', 'going', 'up', 'wassup', 'whatsup'],
    phrases: ['how are you', 'how r u', 'how are u', 'hows it going', 'how is it going', 'whats up', 'what is up', 'how you doing', 'how have you been'],
    text: [
      "Doing great, thanks for asking! Probably mid-way through a Rubik's cube or a Figma file. What would you like to know?",
      "Pretty good! Curious and ready for questions. How about you?",
      "All good here! Ask me anything about my work.",
    ] },

  { words: ['where', 'location', 'located', 'based', 'live', 'city', 'country', 'from', 'india', 'remote', 'relocate'],
    phrases: ['where are you', 'where do you live', 'where are you from', 'where are you based'],
    text: "I'm in Guwahati, Assam, studying at IIT Guwahati. Assam is also where ResQ comes from: it's designed for the floods that cut off its river islands every year." },

  { words: ['morning', 'evening', 'afternoon', 'night', 'gm', 'gn'],
    phrases: ['good morning', 'good evening', 'good afternoon', 'good night'],
    text: "Hello to you too! Whatever time it is where you are, thanks for stopping by. Want the 30-second tour? Ask \"what have you built?\"" },

  { words: ['name', 'called'],
    phrases: ['whats your name', 'what is your name', 'who is this'],
    text: "I'm Akanksha Gupta. Online I go by d3zyre, which is also this site's address." },

  { words: ['d3zyre', 'buddy', 'mascot', 'purple', 'blob', 'creature', 'corner'],
    phrases: ['who is d3zyre', 'the purple thing', 'whos that', 'who is that'],
    text: [
      "That's d3zyre, my little buddy in the corner! She's named after my handle. Say hi to her, she says hi back.",
      "Meet d3zyre! She keeps an eye on visitors (literally, her eyes follow your cursor).",
    ] },

  { words: ['joke', 'funny', 'laugh', 'pun'],
    phrases: ['tell me a joke', 'make me laugh'],
    text: "Why did the designer break up with the font? It wasn't their type. (I'll see myself out, toward the case studies.)" },

  { words: ['lol', 'haha', 'hahaha', 'lmao', 'hehe', 'rofl'],
    text: "Glad I made you smile! If you've got a minute, ResQ (/resq/) is my favourite story to tell." },

  { words: ['website', 'site', 'built', 'made', 'design', 'designed', 'coded'],
    phrases: ['who made this', 'who built this', 'who designed this', 'how did you make this', 'this website', 'this site'],
    text: "I designed and built this site myself, chat and all. It's styled like an AI chat because that's how I like to work: designer, with a terminal open." },

  { words: ['bored', 'fact', 'random', 'surprise', 'interesting'],
    phrases: ['fun fact', 'tell me something', 'surprise me'],
    text: "Fun fact: I taught myself Illustrator in two weeks for an internship. Another one: I'll happily drop everything to solve a Rubik's cube." },

  { words: ['favourite', 'favorite', 'colour', 'color', 'food', 'movie', 'song', 'music', 'book', 'coffee', 'tea'],
    phrases: ['favourite colour', 'favorite color', 'coffee or tea'],
    text: "Ooh, that's a coffee-chat question! Email me at akanksha.guptaa4@gmail.com and let's find out. Meanwhile, my favourite project to talk about is ResQ." },

  { words: ['single', 'date', 'dating', 'girlfriend', 'boyfriend', 'married', 'marry', 'cute', 'pretty', 'beautiful'],
    text: "Ha, this chat is strictly about design! Ask me about my projects instead. Prescribble is a good one." },

  { words: ['age', 'old', 'birthday', 'born'],
    phrases: ['how old are you'],
    text: "Old enough to have been designing for a few years, young enough to graduate in 2028. That's all the chat is telling!" },

  { words: ['love', 'friend', 'friends', 'awesome', 'amazing', 'wow', 'impressive', 'beautiful', 'lovely'],
    phrases: ['love this', 'love your', 'love the site', 'love this site', 'love your site', 'this is cool', 'so cool'],
    text: "Aw, thank you, that genuinely made my day! If you'd like to chat properly, I'm at akanksha.guptaa4@gmail.com." },

  { words: ['ok', 'okay', 'okk', 'hmm', 'hm', 'k', 'yes', 'yeah', 'yep', 'sure', 'alright'],
    text: [
      "Happy to keep going! Try \"what have you built?\", \"where have you worked?\" or \"how do you work?\"",
      "Cool! Want to see something? Ask me about Glance Coach, Prescribble or ResQ.",
      "Alright! If you're short on time, Prescribble (/prescribble/) is the quickest good read.",
    ] },

  { words: ['no', 'nope', 'nah', 'nothing', 'never'],
    text: [
      "No worries! Everything's in the sidebar if you'd rather browse.",
      "That's fine! I'll be here if a question pops up.",
      "Fair enough! If you change your mind, ask me about my projects.",
    ] },

  { words: ['weather', 'time', 'today', 'news', 'date', 'day'],
    phrases: ['what time is it', 'whats the weather'],
    text: "I'm a portfolio, not a weather app! But I can tell you everything about my projects. Ask away." },

  { words: ['thanks', 'thank', 'thx', 'ty', 'cool', 'nice', 'great', 'bye', 'goodbye', 'cya'],
    text: [
      "Thank you for stopping by! The case studies have the full stories, and my email is akanksha.guptaa4@gmail.com.",
      "Thanks for visiting! Hope something here caught your eye.",
    ] },
]

const STOP = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'you', 'your', 'i', 'me', 'my', 'to', 'of', 'in', 'on', 'for', 'and', 'or', 'it', 'its', 'what', 'how', 'why', 'can', 'tell', 'about', 'with', 'at', 'be', 'have', 'has', 'any', 'this', 'that', 'so', 'like', 'please'])

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9/\s]/g, ' ').replace(/\s+/g, ' ').trim()
/** Rough singular/base form so "projects" meets "project" and "tested" meets "test". */
const stem = (w: string) => w.replace(/(ings|ing|ers|er|ed|es|s)$/, '') || w

let last = ''

/** Picks a variation, avoiding the reply that was just given. */
function pick(text: string | string[]) {
  const options = ([] as string[]).concat(text)
  const fresh = options.filter((t) => t !== last)
  const choice = (fresh.length ? fresh : options)[Math.floor(Math.random() * (fresh.length || options.length))]
  last = choice
  return choice
}

/** The best answer for a typed question, or the fallback when nothing fits well enough. */
export function answerFor(question: string): string {
  const q = norm(question)
  const tokens = q.split(' ').filter((w) => w && !STOP.has(w))
  const stems = new Set(tokens.map(stem))
  let best: { score: number; text: string | string[] } = { score: 0, text: FALLBACK }
  for (const a of answers) {
    let score = 0
    for (const w of a.words) if (stems.has(stem(w))) score += 1
    for (const p of a.phrases ?? []) if (q.includes(norm(p))) score += 2
    if (score > best.score) best = { score, text: a.text }
  }
  return pick(best.score > 0 ? best.text : FALLBACK)
}
