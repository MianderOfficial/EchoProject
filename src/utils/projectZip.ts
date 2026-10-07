import JSZip from 'jszip';
import { PresentationProject } from '../types/presentation';

export async function createProjectZip(project: PresentationProject): Promise<Blob> {
  const zip = new JSZip();

  // Load the 100% complete, fully inlined React production bundle
  let fullBundleHtml = '';
  try {
    const res = await fetch('/full_app_bundle.html');
    if (res.ok) {
      fullBundleHtml = await res.text();
    }
  } catch (err) {
    console.error('Failed to fetch full bundle:', err);
  }

  if (fullBundleHtml) {
    // 1. index.html - 100% COMPLETE REACT APPLICATION WITH ALL ANIMATIONS AND STYLES
    zip.file('index.html', fullBundleHtml);

    // 2. Also save as echo_presentation.html
    zip.file('echo_presentation.html', fullBundleHtml);
  }

  // 3. Project data JSON
  zip.file('project_data.json', JSON.stringify(project, null, 2));

  // 4. README.md with clear GitHub instructions
  const readmeContent = `# Презентация университетского проекта команды «Эхо»

Полноценное интерактивное веб-приложение на React 19 + TypeScript с полными стилями, звуками, анимированным холстом и интерактивным редактором.

---

## 🚀 Публикация на GitHub Pages:
Файл \`index.html\` в этом архиве является полностью самодостаточным автономным приложением React со всеми стилями и анимациями.

1. Загрузите \`index.html\` в репозиторий GitHub.
2. Откройте ссылку: \`https://<ваш-логин>.github.io/<репозиторий>/\`
3. Все анимации, эхо-импульсы, звуковые эффекты и 12 слайдов будут работать точно так же, как в Preview!

Команда «Эхо» · 2026
`;
  zip.file('README.md', readmeContent);

  // Generate the zip blob
  return await zip.generateAsync({ type: 'blob' });
}
