`obs`: Notei que existe quase nenhum post em portugues falando sobre pwa com react então nessa primeira parte eu quis fazer algo bem introdutório para a galera que não tá manjando muito do assunto e nem de ingles. Na parte 2 abordarei React com Apollo.
`obs2`: Ainda falta eu dar uma revisada no portugues. 
`obs3`: os obs não fazem parte do post kk

# PWA com React Parte 1
## O que é PWA?
O PWA vem da sigla “Progressive Web App”, ele é um web app que usa as modernas funcionalidades dos browser para entregar uma experiência de um app na web para os usuários.  Ele é muito similar a um sistema web, tem só que satisfazer alguns requisitos (que será comentado abaixo), fora isso o deploy é feito num servidor, acessíveis por uma url e são indexados pelas engines de buscas.

## Características de um PWA
Abaixo citarei algumas características importantes que um PWA precisa ter:
* Progressivos: Eles vão progressivamente melhorando, com as novas funcionalidades dos browser. Por ser um sistema web ele funciona nos navegadores atuais e antigos.
* Rápido: As PWA precisam ter uma rápida fluidez entre as telas e animações suaves, para não tirar a experiência de um app.
* Confiável: Carregamento instantâneo e não mostrar telas de load. O PWA tem que funcionar persistir as informações localmente enquanto está off e quando voltar a conexão com a internet fazer a persistência no servidor. 
* Engajável: É importante ter a mesma experiência imersiva que um app oferece. 

## Porque desenvolver um PWA?
Existem muitos aplicativos em que não são usado com tanta frequência que poderiam ser uma simples página na web, como app de pagamento de estacionamento ou de companhias aéreas (queria poder usar este app com mais frequência -_- ). Além disso nem sempre temos o espaço para armazenar todos os aplicativos que desejamos e algumas vezes até queremos baixar mas o plano de dados já está no limite ou a conexão está lenta. 

Um PWA resolve todos esses problemas, pois deixa mais acessível para todos usuários e também garante uma estabilidade melhor do sistema porque quem tiver acessando usará sempre a última versão do sistema.

Ao contrário do que alguns pensam, é possível “instalar” o PWA no smartphone. É criado um atalho na tela inicial, simulando um app nativo. É possível também enviar push notifications, a empresa eXtra Electronics conseguiu aumentar em 4x o engajamento dos usuários e seus clientes passaram a ficar no site o dobro do tempo. Depois de adotar um PWA a AliExpress aumentou a taxa de conversão em 104% em todos os browsers e 82% no IOS.

Se depois de tudo isso você não ficou interessado em aprender mais sobre PWA é uma pena, fiz o que pude :’(
## Show me the code!
Quem ficou animado e doido para meter a mão no código, chegou a hora. Mas é preciso que você já tenha uma base de react pois não irei explicar essa parte, o objetivo é  transformar um app react em um PWA. 

Vamos começar clonando um projeto que eu já deixei algumas coisas prontas, para focarmos somente no PWA:
```
$ git clone https://github.com/raivitor/pwa-taller.git
$ cd pwa-taller
$ yarn install
$ yarn start
```
Quem tiver algum problema com o `yarn` pode executar os mesmos comandos trocando por `npm`. Nesse momento deve abrir uma nova janela e o projeto já estará rodando nela.

### Configuração do manifest

O web app manifest é um simples arquivo JSON que nos dá a habilidade para controlar como o nosso app aparece para o usuário nas áreas que eles esperariam ver aplicativos (como por exemplo a home screen), direcionar o que o usuário pode iniciar e mais importante como eles podem iniciá-lo.

Usando o web app manifest, nosso web app pode:

* Ter uma boa presença na tela inicial do Android do usuário
* Seja iniciado no modo de tela cheia no Android sem barra de URL
* Controle a orientação da tela para visualização ideal
* Defina uma experiência de inicialização "tela inicial" e a cor do tema para o site
* Rastreie se você é iniciado a partir da tela inicial ou barra de URL

Quando se cria um arquivo pelo `creat-reat-app` já vem com um `./public/manifest.json` e é ele que vamos alterar. Copie e cole o código abaixo.

```
{
  "short_name": "todo",
  "name": "Lista de tarefas",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "start_url": "./index.html",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```
Vamos lá para a explicação desses atributos:
* `short_name`: Nome abreviado da PWA. Se informado, ele será usado em contextos onde o campo de nome for muito longo. É recomendado que o nome abreviado não deva exceder 12 caracteres.
* `name`: Nome da extensão. Ele é usado para identificar o PWA no browser e na home-screen do usuário. É uma boa prática manter o nome suficientemente curto para exibir na interface do usuário. O Google Chrome e o Microsoft Edge restringem o comprimento do nome a 45 caracteres. 
* `icons`: Esse é o ícone da PWA. É recomendável que tenha um icone de pelo menos 192x192. Esse icone aparecerá na home-screen do usuário.
* `start_url`: É o arquivo que será inicializado assim que o usuário abrir o seu app. É possivel passar alguns parametros também.
* `display`: Aqui definimos como browser mostrará o app. Se usarmos o `standalone` o app ficara fullscreen e não exibirá alguns itens do browser. Se usarmos o `browser`, será mostrado como um site normal no browser do usuário.
* `theme_color`: Define a cor da barra de ferramentas.
* `background_color`: Define a cor de fundo. Essa cor é apresentada enquanto o site não é renderizado.
 
### Service Worker
#### Pré-requisitos
* Compatibilidade de navegadores: O número de opções de navegadores está crescendo. Service Workers são compatíveis com Firefox, Opera e Chrome.
* HTTPS: Durante o desenvolvimento, você poderá utilizar Service Workers localmente (localhost) sem necessidade de certificado SSL. No entanto, para implantá-lo em produção, será necessário ter o SSL configurado.
 
#### Criando o service worker
Criaremos um arquivo `./public/service-worker.js` que será o nosso service worker. Após criar note que em `./src/registerServiceWorker.js`, há um referencia ao service-worker.js na linha 33: ```const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;```. Se por algum motivo você precise mudar o nome do service-worker.js em public, lembre-se de mudar em `registerServiceWorker.js`.

Começaremos criando uma constante para salvar o nome do nosso cache e logo em seguida adicionaremos as urls que desejaremos que realize o cacheamento. Note que adicionamos o `bundle.js` pois é o bundle que o webpack cria. Em seguida tem o link do bootstrap que chamamos em `./public/index.html`. Por ultimo, mas muito imporante, adicionamos o endpoint da API que estamos consumindo, sem esse link a PWA não vai funcionar corretamente offline. 
```
// Nome do cache
const CACHE_NAME = 'pwa-cache-v1';

const urlsToCache = [
  "/",
  "static/js/bundle.js",
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
  'https://5a9dd5a1a65e7d0014436b95.mockapi.io/note'
]
```
Agora explicarei os eventos de um service worker. O primeiro a ser executado é o `install`, ele é executado somente uma vez, depois de instalado não é mais executado. A promessa `waitUntil()` sinaliza a duração e o êxito ou uma falha na instalação. Dentro dela usamos o `caches.open(CACHE_NAME)` onde criamos o cache da PWA e ele retorna uma promessa quando termina de criar o cache, dentro dela chamamos `cache.addAll()` e passamos o array `urlsToCache` com as urls que queremos cachear.
```
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
  );
});
```
Depois da instalação o próximo passo é o `activate` esse é bem simples, ele verifica se tem cache antigo, limpa e adiciona o novo. Se você alterar o `CACHE_NAME` para `'pwa-cache-v2'` acontecerá uma exclusão dos caches antigos e será cacheado tudo novamente.
```
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }))
    )
  );
});
```
Aqui onde a magia acontece, toda vez que o PWA precisa de algum recurso o evento `fetch` dispara e ele busca no cache se já temos esse recurso e manda para o usuário. Caso não seja, segue o fluxo normal. O método `caches.match()` é quem faz a verificação se o que a aplicação tá requisitando está no cache.
```
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

@TODO: add fazer uma 'conclusão'.
@TODO: add o link da branch com o projeto completo.