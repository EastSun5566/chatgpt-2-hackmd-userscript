// ==UserScript==
// @name         ChatGPT 2 HackMD
// @namespace
// @version      0.0.1
// @description  ship stuff from chatgpt to hackmd
// @author       Michael Wang (https://github.com/EastSun5566)
// @license      MIT
// @homepageURL  https://github.com/EastSun5566
// @supportURL   https://github.com/EastSun5566
// @match        https://chat.openai.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hackmd.io
// ==/UserScript==

// @ts-check

(function () {
  /** @see {@url https://www.reddit.com/r/ChatGPT/comments/zm237o/save_your_chatgpt_conversation_as_a_markdown_file/} */
  function h(html) {
    return html.replace(/<p>/g, '\n\n')
      .replace(/<\/p>/g, '')
      .replace(/<b>/g, '**')
      .replace(/<\/b>/g, '**')
      .replace(/<i>/g, '_')
      .replace(/<\/i>/g, '_')
      .replace(/<code[^>]*>/g, (match) => {
        const lm = match.match(/class="[^"]*language-([^"]*)"/);
        return lm ? `\n\`\`\`${lm[1]}\n` : '```';
      })
      .replace(/<\/code[^>]*>/g, '```')
      .replace(/<[^>]*>/g, '')
      .replace(/Copy code/g, '')
      .replace(/This content may violate our content policy. If you believe this to be in error, please submit your feedback — your input will aid our research in this area./g, '')
      .trim();
  }

  const elements = document.querySelectorAll('.text-base');
  let text = '';
  for (const element of elements) {
    if (element.querySelector('.whitespace-pre-wrap')) {
      text += `**${element.querySelector('img') ? 'You' : 'ChatGPT'}**: ${h(element.querySelector('.whitespace-pre-wrap')?.innerHTML)}\n\n`;
    }
  }

  const output = [
    `[${document.title}](${window.location.href})`,
    '',
    `\`${new Date().toLocaleString()}\`\n\n`,
    ...text.split(/\n/g).map((t) => ` > ${t}`),
    '',
  ].join('\n');
  window.open(`https://hackmd.io/new?title=${encodeURIComponent(output)}`);
}());
