# PIXEL RAGE: build e publicação

O jogo é um site estático, sem dependências de runtime. O build copia o HTML, o CSS e os módulos ES para `dist/`; todos os endereços são relativos ao site, então funcionam em subpastas como `https://usuario.github.io/repositorio/`.

## Build local

Requer Node.js 20 ou posterior, sem instalar pacotes:

```sh
npm test
npm run build
```

Para testar a pasta de produção no Windows:

```powershell
cd dist
py -m http.server 4173
```

Abra `http://localhost:4173` no navegador. Para servir os arquivos-fonte na pasta raiz, também funciona `py -m http.server 4173` a partir da raiz do projeto.

## GitHub Pages

1. Crie um repositório GitHub e envie os arquivos do projeto para a branch padrão. Inclua `.github/workflows/pages.yml`.
2. Em **Settings → Pages**, escolha **GitHub Actions** como fonte de publicação.
3. O workflow compila `dist/` em cada push; somente a branch padrão faz publicação. Pull requests podem ser usados para validar o build.
4. Aguarde a execução verde em **Actions → Deploy PIXEL RAGE to GitHub Pages**. A página de configurações de Pages mostrará o endereço publicado.

## Vercel

1. Importe o repositório GitHub no painel da Vercel ou conecte o projeto usando a Vercel CLI.
2. A configuração `vercel.json` seleciona o preset estático, executa `npm run build` e publica `dist/`.
3. Faça o deploy de produção pelo painel ou pela CLI (`vercel --prod`). Abra o domínio atribuído pela Vercel e teste o jogo.

O diretório `dist/` é gerado pelo build e está no `.gitignore`; a hospedagem o recria. Não inclua `node_modules`.
