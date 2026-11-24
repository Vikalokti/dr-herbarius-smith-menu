/* Small, dependency-free Markdown renderer for editor-authored catalog text. */
(function (global) {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeUrl(value) {
    var decoded = String(value || '').replace(/&amp;/g, '&').trim();
    return /^(https?:|mailto:)/i.test(decoded) ? escapeHtml(decoded) : '#';
  }

  function renderInline(value) {
    var text = escapeHtml(value);
    var code = [];
    text = text.replace(/`([^`]+)`/g, function (_, match) {
      code.push(match);
      return '\u0000' + (code.length - 1) + '\u0000';
    });
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, url) {
      return '<a href="' + safeUrl(url) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
    });
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/(^|[^_])_([^_]+)_(?!_)/g, '$1<em>$2</em>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>');
    return text.replace(/\u0000(\d+)\u0000/g, function (_, index) {
      return '<code>' + code[Number(index)] + '</code>';
    });
  }

  function renderFormattedText(value) {
    var source = String(value == null ? '' : value).replace(/\r\n?/g, '\n').trim();
    if (!source) return '';
    var lines = source.split('\n');
    var output = [];
    var paragraph = [];
    var list = [];
    var listType = '';

    function flushParagraph() {
      if (!paragraph.length) return;
      output.push('<p>' + paragraph.map(renderInline).join('<br>') + '</p>');
      paragraph = [];
    }
    function flushList() {
      if (!list.length) return;
      output.push('<' + listType + '>' + list.map(function (item) {
        return '<li>' + renderInline(item) + '</li>';
      }).join('') + '</' + listType + '>');
      list = [];
      listType = '';
    }

    for (var i = 0; i < lines.length; i += 1) {
      var line = lines[i];
      var trimmed = line.trim();
      var highlight = trimmed.match(/^:::highlight-(green|gold|rose)\s*$/);
      if (highlight) {
        flushParagraph();
        flushList();
        var content = [];
        i += 1;
        while (i < lines.length && lines[i].trim() !== ':::') {
          content.push(lines[i]);
          i += 1;
        }
        output.push('<aside class="text-highlight text-highlight--' + highlight[1] + '">' + renderFormattedText(content.join('\n')) + '</aside>');
        continue;
      }

      if (!trimmed) {
        flushParagraph();
        flushList();
        continue;
      }

      var heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        var level = heading[1].length;
        output.push('<h' + level + '>' + renderInline(heading[2]) + '</h' + level + '>');
        continue;
      }

      var quote = trimmed.match(/^>\s?(.*)$/);
      if (quote) {
        flushParagraph();
        flushList();
        output.push('<blockquote>' + renderInline(quote[1]) + '</blockquote>');
        continue;
      }

      var unordered = trimmed.match(/^[-*+]\s+(.+)$/);
      var ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
      if (unordered || ordered) {
        flushParagraph();
        var nextType = unordered ? 'ul' : 'ol';
        if (listType && listType !== nextType) flushList();
        listType = nextType;
        list.push((unordered || ordered)[1]);
        continue;
      }

      flushList();
      paragraph.push(line);
    }
    flushParagraph();
    flushList();
    return output.join('\n');
  }

  function plainText(value) {
    return String(value == null ? '' : value)
      .replace(/:::highlight-(?:green|gold|rose)\s*\n([\s\S]*?)\n:::/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^>\s?/gm, '')
      .replace(/^\s*[-*+]\s+|^\s*\d+[.)]\s+/gm, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~`#]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function firstSentence(value) {
    var text = plainText(value);
    return text.replace(/^(.+?[.!?])(?:\s+.*)?$/, '$1');
  }

  global.renderFormattedText = renderFormattedText;
  global.plainText = plainText;
  global.firstSentence = firstSentence;
})(window);
