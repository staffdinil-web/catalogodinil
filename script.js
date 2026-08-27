
const $ = (selector) => document.querySelector(selector);

function formatTitle(title) {
  const parts = title.trim().split(/\s+/);
  if (parts.length < 2) return title;
  const lastTwo = parts.splice(-2).join(' ');
  return `${parts.join(' ')}<br><em>${lastTwo}</em>`;
}

function openLightbox(page) {
  $('#modalNumber').textContent = `Página ${page.numero}`;
  $('#modalTitle').textContent = page.titulo;
  $('#modalImage').src = page.imagem;
  $('#modalImage').alt = `Catálogo ampliado: ${page.titulo}`;
  $('#modalDownload').href = page.imagem;
  $('#lightbox').classList.add('open');
  $('#lightbox').setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeLightbox() {
  $('#lightbox').classList.remove('open');
  $('#lightbox').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

async function loadCatalog() {
  try {
    const response = await fetch('catalogo.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível carregar catalogo.json');
    const data = await response.json();
    $('#brandName').textContent = data.marca || 'moura';
    $('#eyebrow').textContent = data.chamada || 'Catálogo de produtos';
    $('#heroTitle').innerHTML = formatTitle(data.titulo || 'Energia para cada caminho.');
    $('#heroDescription').textContent = data.descricao || '';
    $('#footerText').textContent = data.rodape || '';

    const pages = Array.isArray(data.paginas) ? data.paginas : [];
    if (pages[0]) $('#heroFront').src = pages[0].imagem;
    if (pages[1]) $('#heroBack').src = pages[1].imagem;
    else if (pages[0]) $('#heroBack').src = pages[0].imagem;

    const grid = $('#catalogGrid');
    grid.innerHTML = '';
    pages.forEach((page) => {
      const article = document.createElement('article');
      article.className = 'catalog-card';
      article.innerHTML = `
        <button class="catalog-preview" type="button" aria-label="Ampliar ${page.titulo}">
          <img src="${page.imagem}" alt="Página do catálogo: ${page.titulo}">
          <span class="expand-label">⛶ Ampliar</span>
        </button>
        <div class="catalog-info">
          <span class="page-number">${page.numero}</span>
          <div><h3>${page.titulo}</h3><p>${page.descricao}</p></div>
          <a class="download-link" href="${page.imagem}" download>↓ Baixar</a>
        </div>`;
      article.querySelector('button').addEventListener('click', () => openLightbox(page));
      grid.appendChild(article);
    });
  } catch (error) {
    $('#catalogGrid').innerHTML = `<p class="error">${error.message}. Publique o projeto no GitHub Pages ou abra usando um servidor local.</p>`;
    console.error(error);
  }
}

document.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeLightbox));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
loadCatalog();
