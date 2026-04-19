export const EN_HOME_MARKDOWN_FILE = '/Yes%20or%20No%20Wheel.txt';

export const EN_HOME_HERO_FALLBACK = {
  title: 'Yes or No Wheel: Your Free Online Decision-Making Companion',
  subtitle: 'Make Quick Decisions with Our Random Yes No Generator'
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatBasicInline(escapedText) {
  return escapedText
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function formatInline(text) {
  const links = [];
  const withTokens = String(text).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => {
    const token = `@@LINK_${links.length}@@`;
    links.push({ label, url });
    return token;
  });

  let output = formatBasicInline(escapeHtml(withTokens));

  output = output.replace(/@@LINK_(\d+)@@/g, (_, index) => {
    const link = links[Number(index)];
    if (!link) return '';

    const safeUrl = escapeHtml(link.url);
    const safeLabel = formatBasicInline(escapeHtml(link.label));
    return `<a href="${safeUrl}" target="_blank" rel="noopener">${safeLabel}</a>`;
  });

  return output;
}

function splitTableRow(row) {
  return row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableDelimiter(row) {
  return /^\|[\s:|-]+\|$/.test(row.trim());
}

export function stripInlineMarkdown(text) {
  return String(text || '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/<\/?[^>]+>/g, '')
    .trim();
}

export function extractHomeHero(markdown, fallback = EN_HOME_HERO_FALLBACK) {
  const result = {
    title: fallback?.title || '',
    subtitle: fallback?.subtitle || ''
  };

  if (!markdown || typeof markdown !== 'string') {
    return result;
  }

  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const headingIndex = lines.findIndex((line) => /^#\s+/.test(line.trim()));

  if (headingIndex === -1) {
    return result;
  }

  const headingLine = lines[headingIndex].trim();
  result.title = stripInlineMarkdown(headingLine.replace(/^#\s+/, '')) || result.title;

  for (let i = headingIndex + 1; i < lines.length; i++) {
    const candidate = lines[i].trim();
    if (!candidate || /^---+$/.test(candidate)) continue;
    if (/^#{1,6}\s+/.test(candidate)) break;
    result.subtitle = stripInlineMarkdown(candidate) || result.subtitle;
    break;
  }

  return result;
}

export function renderHomeMarkdownToHtml(markdown, options = {}) {
  const { skipFirstHeading = false, skipFirstSubtitle = false } = options;

  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');

  if (skipFirstHeading || skipFirstSubtitle) {
    const firstHeadingIndex = lines.findIndex((line) => /^#\s+/.test(line.trim()));
    if (firstHeadingIndex !== -1) {
      if (skipFirstHeading) {
        lines[firstHeadingIndex] = '';
      }

      if (skipFirstSubtitle) {
        for (let i = firstHeadingIndex + 1; i < lines.length; i++) {
          const candidate = lines[i].trim();
          if (!candidate || /^---+$/.test(candidate)) continue;
          lines[i] = '';
          break;
        }
      }
    }
  }

  const html = [];
  let paragraphLines = [];
  let listType = '';
  let blockquoteLines = [];
  let inFaqSection = false;
  const detailsModeStack = [];

  const closeParagraph = () => {
    if (!paragraphLines.length) return;
    html.push(`<p>${formatInline(paragraphLines.join(' '))}</p>`);
    paragraphLines = [];
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = '';
  };

  const closeBlockquote = () => {
    if (!blockquoteLines.length) return;
    html.push(`<blockquote><p>${formatInline(blockquoteLines.join(' '))}</p></blockquote>`);
    blockquoteLines = [];
  };

  const closeAllTextBlocks = () => {
    closeParagraph();
    closeList();
    closeBlockquote();
  };

  const renderFencedBlock = (fenceLines, language) => {
    const cleaned = fenceLines.map((line) => line.replace(/\s+$/g, ''));
    const nonEmpty = cleaned.filter((line) => line.trim().length > 0);
    const isChecklist = language === 'markdown' && nonEmpty.length > 0 && nonEmpty.every((line) => /^✅\s+/.test(line.trim()));

    if (isChecklist) {
      html.push('<ul class="home-markdown-checklist">');
      nonEmpty.forEach((line) => {
        const text = line.trim().replace(/^✅\s+/, '');
        html.push(`<li>${formatInline(text)}</li>`);
      });
      html.push('</ul>');
      return;
    }

    const safeLanguage = language ? ` data-language="${escapeHtml(language)}"` : '';
    const codeBody = escapeHtml(cleaned.join('\n'));
    html.push(`<pre class="home-markdown-code"${safeLanguage}><code>${codeBody}</code></pre>`);
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      closeAllTextBlocks();
      continue;
    }

    const fenceMatch = line.match(/^```(\w+)?$/);
    if (fenceMatch) {
      closeAllTextBlocks();
      const language = (fenceMatch[1] || '').toLowerCase();
      const fenceLines = [];
      i++;
      while (i < lines.length && !/^```$/.test(lines[i].trim())) {
        fenceLines.push(lines[i]);
        i++;
      }
      renderFencedBlock(fenceLines, language);
      continue;
    }

    if (/^<details\b/i.test(line)) {
      closeAllTextBlocks();
      const keepDropdown = inFaqSection;
      detailsModeStack.push(keepDropdown ? 'faq' : 'flat');
      if (keepDropdown) {
        const detailsTag = /class\s*=/i.test(line)
          ? line
          : line.replace(/^<details\b/i, '<details class="home-markdown-details"');
        html.push(detailsTag);
      } else {
        html.push('<section class="home-inline-section">');
      }
      continue;
    }

    if (/^<\/details>/i.test(line)) {
      closeAllTextBlocks();
      const mode = detailsModeStack.pop() || 'flat';
      html.push(mode === 'faq' ? '</details>' : '</section>');
      continue;
    }

    const summaryMatch = line.match(/^<summary>([\s\S]*?)<\/summary>$/i);
    if (summaryMatch) {
      closeAllTextBlocks();
      const summaryInner = summaryMatch[1];
      const summaryContent = /<[^>]+>/.test(summaryInner)
        ? summaryInner
        : formatInline(summaryInner);
      const mode = detailsModeStack[detailsModeStack.length - 1] || 'flat';
      if (mode === 'faq') {
        html.push(`<summary>${summaryContent}</summary>`);
      } else {
        html.push(`<h4 class="home-inline-summary">${summaryContent}</h4>`);
      }
      continue;
    }

    if (/^---+$/.test(line)) {
      closeAllTextBlocks();
      html.push('<hr class="home-markdown-divider" />');
      continue;
    }

    if (/^\|.*\|$/.test(line) && i + 1 < lines.length && isTableDelimiter(lines[i + 1].trim())) {
      closeAllTextBlocks();

      const headers = splitTableRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length) {
        const tableLine = lines[i].trim();
        if (!/^\|.*\|$/.test(tableLine)) break;
        rows.push(splitTableRow(tableLine));
        i++;
      }
      i--;

      html.push('<div class="comparison-table-wrap">');
      html.push('<table class="comparison-table">');
      html.push('<thead><tr>');
      headers.forEach((header) => html.push(`<th scope="col">${formatInline(header)}</th>`));
      html.push('</tr></thead>');
      html.push('<tbody>');
      rows.forEach((row) => {
        const normalized = [...row];
        while (normalized.length < headers.length) normalized.push('');
        html.push('<tr>');
        normalized.slice(0, headers.length).forEach((cell) => {
          html.push(`<td>${formatInline(cell)}</td>`);
        });
        html.push('</tr>');
      });
      html.push('</tbody>');
      html.push('</table>');
      html.push('</div>');
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      closeAllTextBlocks();
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      const plainHeading = stripInlineMarkdown(headingText).toLowerCase();
      if (level === 2) {
        inFaqSection = plainHeading.includes('common questions about yes or no wheels');
      }
      html.push(`<h${level}>${formatInline(headingText)}</h${level}>`);
      continue;
    }

    const quoteMatch = line.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      closeParagraph();
      closeList();
      blockquoteLines.push(quoteMatch[1]);
      continue;
    }
    closeBlockquote();

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      closeParagraph();
      if (listType !== 'ol') {
        closeList();
        html.push('<ol>');
        listType = 'ol';
      }
      html.push(`<li>${formatInline(orderedMatch[1])}</li>`);
      continue;
    }

    const unorderedMatch = line.match(/^-\s+(.+)$/);
    if (unorderedMatch) {
      closeParagraph();
      if (listType !== 'ul') {
        closeList();
        html.push('<ul>');
        listType = 'ul';
      }
      html.push(`<li>${formatInline(unorderedMatch[1])}</li>`);
      continue;
    }

    closeList();
    paragraphLines.push(line);
  }

  closeAllTextBlocks();

  return `<article class="home-markdown-article">\n${html.join('\n')}\n</article>`;
}
