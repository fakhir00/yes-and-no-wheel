import { buildLocalizedPath, getLocalizedRouteContent } from '../i18n.js';

const SEO_CONTENT = {
  home: {
    type: 'a yes, no, and maybe decision spinner',
    audience: 'users who need quick answers for simple choices, daily decisions, games, and lightweight prompts',
    useCases: 'instant decisions, fun yes-or-no questions, quick maybe answers, casual games, and low-friction random choices',
    strengths: 'simple controls, fast results, repeat usability, and a familiar decision-making format',
    relatedSlug: 'rainbow',
    relatedReason: 'If you want a more visual and colorful variation after using the main decision wheel, the',
    timing: 'when you want a fast answer without building a full custom list first',
    scenarios: 'small daily decisions, group votes, playful challenges, content ideas, and quick moments where you want the wheel to answer for you'
  },
  rainbow: {
    type: 'a colorful random picker',
    audience: 'teachers, creators, students, streamers, and casual users',
    useCases: 'creative prompts, classroom picks, challenge games, brainstorming sessions, icebreakers, and visual decision making',
    strengths: 'bright design, easy readability, flexible custom entries, and a playful spinning experience',
    relatedSlug: 'word',
    relatedReason: 'If you prefer text-first selection instead of color-driven choices, the',
    timing: 'when visual energy matters as much as the final answer',
    scenarios: 'art classes, workshop warmups, kids activities, team-building moments, and quick random idea generation'
  },
  'wheel-of-fate': {
    type: 'a dramatic weighted decision wheel',
    audience: 'writers, roleplay groups, game masters, storytellers, and challenge-based creators',
    useCases: 'story prompts, fantasy outcomes, RPG turns, dramatic decisions, weighted choices, and suspense-driven random events',
    strengths: 'adjustable weights, strong thematic design, immersive presentation, and a result format that feels meaningful',
    relatedSlug: 'spin-the-wheel-truth-or-dare',
    relatedReason: 'For a more party-focused version of random suspense, the',
    timing: 'when the reveal should feel intense, theatrical, or narratively important',
    scenarios: 'campaign sessions, creative writing exercises, challenge videos, livestream events, and custom fate-based prompts'
  },
  word: {
    type: 'a text-based random selector for names, words, and custom lists',
    audience: 'teachers, event organizers, teams, workshop hosts, and anyone choosing from written entries',
    useCases: 'attendance picks, raffle draws, team assignments, prompt selection, brainstorming, and name picking',
    strengths: 'clean readability, flexible input, quick setup, and practical list-based spinning',
    relatedSlug: 'country',
    relatedReason: 'If you want a more topic-specific randomizer for geography or travel themes, the',
    timing: 'when fairness, speed, and clear text visibility are more important than decoration',
    scenarios: 'classrooms, meetings, contests, office games, live workshops, and group participation activities'
  },
  'spin-the-wheel-truth-or-dare': {
    type: 'a party game wheel that selects players and truth-or-dare prompts',
    audience: 'friends, party hosts, streamers, school groups, and social content creators',
    useCases: 'party games, sleepovers, friend hangouts, social challenges, audience participation, and live entertainment',
    strengths: 'fast player selection, built-in prompt flow, social replay value, and a game-ready layout',
    relatedSlug: 'wheel-of-fate',
    relatedReason: 'If you want a darker or more dramatic randomizer after party play, the',
    timing: 'when you need a ready-to-play group activity that keeps turns moving quickly',
    scenarios: 'birthday parties, dorm games, family nights, youth events, livestreams, and casual group challenges'
  },
  'dti-theme': {
    type: 'a Dress To Impress theme generator for outfit and styling ideas',
    audience: 'DTI players, fashion creators, styling challenge hosts, and trend-focused communities',
    useCases: 'outfit prompts, challenge rounds, fashion inspiration, theme selection, content planning, and replay variety',
    strengths: 'category filtering, broad theme coverage, fast idea generation, and strong repeat usability',
    relatedSlug: 'hair-color',
    relatedReason: 'For a beauty-focused companion tool that works well with styling sessions, the',
    timing: 'when you want a fresh fashion direction without repeating the same challenge concepts',
    scenarios: 'game nights, creator sessions, themed competitions, styling streams, and outfit brainstorming'
  },
  country: {
    type: 'a geography-focused random country picker',
    audience: 'teachers, students, quiz hosts, travelers, researchers, and geography fans',
    useCases: 'country selection, travel inspiration, map games, quiz practice, classroom activities, and cultural topic picking',
    strengths: 'continent filtering, broad country coverage, easy spinning, and educational usefulness',
    relatedSlug: 'zodiac',
    relatedReason: 'If you want a lighter entertainment-style randomizer instead of a geography tool, the',
    timing: 'when you need a random country but still want control over the region or continent',
    scenarios: 'lesson planning, trivia nights, travel brainstorming, homeschooling, and research prompts'
  },
  zodiac: {
    type: 'an astrology-inspired random zodiac selector',
    audience: 'astrology fans, social creators, event hosts, curious readers, and users looking for themed prompts',
    useCases: 'zodiac games, sign reveals, themed content, party prompts, light astrology exploration, and icebreakers',
    strengths: 'sign detail display, recognizable theme, simple random selection, and highly shareable results',
    relatedSlug: 'rainbow',
    relatedReason: 'If you want a brighter and more playful style of random selection, the',
    timing: 'when you want an easy star-sign prompt that mixes entertainment with recognizable zodiac themes',
    scenarios: 'social posts, themed parties, classroom fun, personality games, and casual astrology browsing'
  },
  'hair-color': {
    type: 'a random hair color suggestion wheel',
    audience: 'beauty lovers, stylists, creators, salon clients, cosplayers, and makeover planners',
    useCases: 'hair inspiration, dye ideas, beauty challenges, makeover planning, style experiments, and content prompts',
    strengths: 'classic and fantasy shades, custom color options, quick discovery, and visual style inspiration',
    relatedSlug: 'dti-theme',
    relatedReason: 'If you want to pair hair inspiration with a full outfit direction, the',
    timing: 'when you need a fast style suggestion instead of scrolling through endless color references',
    scenarios: 'salon planning, fashion shoots, cosplay prep, trend experiments, and beauty content creation'
  }
};

function buildAnchor(locale, slug, label) {
  return `<a href="${buildLocalizedPath(locale, slug)}">${label}</a>`;
}

export function renderWheelSeoContent(primaryKeyword, slug, locale = 'en') {
  const copy = SEO_CONTENT[slug];
  if (!copy) return '';

  const relatedTitle = getLocalizedRouteContent(locale, copy.relatedSlug).title;
  const relatedAnchor = buildAnchor(locale, copy.relatedSlug, relatedTitle);

  const whatParagraphs = slug === 'home'
    ? [
        `${primaryKeyword} is ${copy.type} created for ${copy.audience}. It is built for people who want a fast answer without setting up a full custom spinner first. That makes it useful for ${copy.useCases}, especially when speed matters more than complexity.`,
        `Visitors can open the page, spin immediately, and get a clear result that still feels interactive and repeatable. The homepage version also acts as the central entry point for the broader wheel cluster, helping users move from simple decisions to more themed tools when needed.`,
        `${copy.relatedReason} ${relatedAnchor} is a natural next step. Overall, ${primaryKeyword} works as the main everyday decision wheel for users who want low friction, quick results, and a format that stays useful across repeated visits.`
      ]
    : [
        `${primaryKeyword} is ${copy.type} built for ${copy.audience} who want a faster and more engaging way to make choices online. Instead of using plain lists or manual picking, this wheel turns selection into a clearer visual experience that is easier to repeat.`,
        `It is useful for ${copy.useCases}, which gives the page value beyond a one-time novelty spin. One of the main strengths of ${primaryKeyword} is its balance of usefulness and presentation. Visitors can understand the result quickly, customize the tool when needed, and return without friction.`,
        `That mix of ${copy.strengths} makes the page relevant for entertainment, education, creativity, and practical selection. ${copy.relatedReason} ${relatedAnchor} can support a different kind of spin experience while keeping users inside the same topic cluster. Overall, ${primaryKeyword} is a focused randomization tool built around a clear keyword, a strong use case, and repeatable user intent.`
      ];

  const whenParagraphs = slug === 'home'
    ? [
        `You should use this ${primaryKeyword} ${copy.timing}. It works best for ${copy.scenarios}, where a simple direct answer is more useful than a complex setup.`,
        `Users can open the homepage, spin once, and move forward instead of spending time building options manually. This makes the page useful for repeat visits because the problem it solves is broad, common, and easy to understand.`,
        `A quick yes-or-no style result fits everyday choices, light games, content ideas, and small group activities. In short, use this ${primaryKeyword} when you want the fastest decision wheel on the site, with simple controls, clear answers, and strong repeat value.`
      ]
    : [
        `You should use this ${primaryKeyword} ${copy.timing}, because that is where a themed spinner adds more value than a generic picker. In practical terms, that can include ${copy.scenarios}.`,
        `In those moments, the wheel does more than generate a result. It adds pace, structure, and a sense of engagement that helps users keep moving instead of hesitating over the next choice. ${primaryKeyword} works best when the visitor wants a relevant themed outcome rather than any random answer, which makes it useful for planning, teaching, content creation, hosting, or solo inspiration.`,
        `The themed focus narrows the decision space while keeping the final result random. In short, use this ${primaryKeyword} when you want a wheel that fits the moment, supports the activity around it, and stays useful across repeated visits.`
      ];

  return `
    <section class="wheel-seo-content page-content">
      <section class="content-section">
        <h2>What is ${primaryKeyword}?</h2>
        ${whatParagraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}
      </section>
      <section class="content-section">
        <h2>When to Use This ${primaryKeyword}?</h2>
        ${whenParagraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}
      </section>
    </section>
  `;
}
