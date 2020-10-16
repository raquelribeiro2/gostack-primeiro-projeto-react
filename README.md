# 🚀 Bootcamp GoStack 2020 - Primeiro Projeto ReactJS

## Executar projeto do repositório

- Abra a pasta no Visual Studio Code e execute o comando ``` yarn ``` ou ``` npm install ``` para instalar as dependências. 
- Para iniciar o servidor execute o comando ``` yarn start ```

# Conteúdo aprendido neste módulo

## Primeiro Projeto ReactJS

### Criando Rotas

- A primeira coisa que iremos fazer é instalar uma dependência para lidar com rotas e navegação na aplicação:

```bash
$ yarn add react-router-dom
```

- Precisaremos instalar o pacote de tipos também:

```bash
$ yarn add -D @types/react-router-dom
```

- Depois podemos criar uma pasta chamada *routes* e dentro dela criar um arquivo *index.tsx*.
- Vamos organizar o código em *pages*, para cada página, criaremos uma pasta que conterá todas as informações daquela página.
- Podemos criar a page Dashboard:

```tsx
import React from 'react';

const Dashboard: React.FC = () => {
  return <h1>Dashboard</h1>;
};

export default Dashboard;
```

- A page Repository:

```tsx
import React from 'react';

const Repository: React.FC = () => {
  return <h1>Repository</h1>;
};

export default Repository;
```

- O arquivo de rotas ficará da seguinte forma:

```tsx
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/repository" component={Repository} />
  </Switch>
);

export default Routes;
```

### Utilizando Styled Components

- Primeiramente precisamos instalar o pacote:

```bash
$ yarn add styled-components
```

- Também precisaremos do pacote de tipos:

```bash
$ yarn add -D @types/styled-components
```

### Conectando a API

- Para podermos utilizar as informações da nossa API, vamos começar instalando o pacote *axios*:

```bash
$ yarn add axios
```

- Criamos uma pasta *services* e dentro dela criamos o arquivo *api.ts*. O arquivo deve possuir o seguinte conteúdo:

```tsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.github.com',
});

export default api;
```

- Voltamos até a nossa página Dashboard e importamos o arquivo *api.ts*:

```tsx
import React, { useState, FormEvent} from 'react';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories } from './styles';

// Precisamos adicionar tipagem somente nas informações que iremos utilizar
interface Repository{
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {

// Estado para armazenar o valor do input
// Inicia com valor de string vazia
const [newRepo, setNewRepo] = useState('');

// Teremos um estado para armezenar os repositórios
// Começamos o estado com valor de array vazio
// repositories: valor da variável
// setRepositories: usamos sempre que queremos mudar o valor da variável
// useState([]): valor inicial do estado (vazio)
// Este estado é do tipo array de Repository
  const [repositories, setRepositories] = useState<Repository[]>([]);

// Função para lidar com a adição de novos repositórios
// Recebe como parâmetro o evento de Submit do formulário (FormEvent)
// O FormEvent precisa receber como parâmetro de tipagem o HTMLFormElement
// Ele representa o elemento HTML do Form
	async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {

// Vamos prevenir o comportamento padrão que o formulário tem dentro
// do HTML, que é recarregar a página quando um formulário é enviado
// Ou no caso, a pesquisa do repositório
		event.preventDefault();

// Chamada na API
// Após o repos/ estará o que o usuário digitou na barra de pesquisa
// Adição de um novo repositório baseado no preenchimento do newRepo
		const response = await api.get<Repository>(`repos/${newRepo}`);

{/* Consumir API do Github, buscando os dados do repositório
Na variável repository estará o repositório que acabei de pesquisar */}
    const repository = response.data;

{/* Salvar novo repositório no estado repositories
Para alterar o estado de repositories respeitando o conceito de imutabilidade
devemos trazer toda a lista de repositories antes e add repository no final */}
		setRepositories([...repositories, repository]);

{/* Para limpar o valor do input depois de pesquisar */}
		setNewRepo('');
 }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form onSubmit={handleAddRepository}>
        <input
{/* Texto que o input recebe */}
		      value={newRepo}

{/* Quando o usuário altera o valor do input recebemos um evento (e) e dentro
desse evento temos o valor do input disponível através do e.target.value 
Utiliza-se então o valor do setNewRepo para alterar o valor de repositories */}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      <Repositories>
{/* Vou percorrer todos os meus repositórios e para 
cada um dos repositórios retornamos as seguintes informações */}
    {repositories.map(repository => (

{/* No primeiro elemento dentro do map, colocamos uma key, que identifica
este repositório de uma maneira única, que no caso é o full_name */}
         <a key={repository.full_name} href="teste">
          <img
            src={repository.owner.avatar_url}
            alt={repository.owner.login}"
          />
          <div>
            <strong>{repository.full_name}</strong>
            <p>{repository.description}</p>>
          </div>
          <FiChevronRight size={20} />
        </a>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
```

### Salvando no LocalStorage

- Para salvar os repositórios no LocalStorage, vamos utilizar o useEffect:

```tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Error, Repositories } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');

// Para persistir os dados em tela quando a página for recarregada,
// fazemos a seguinte função
	const [repositories, setRepositories] = useState<Repository[]>(() => {
// Pegamos os repositórios que estão no LocalStorage
    const storagedRepositories = localStorage.getItem(
// passando o endereço em que eles estão
      '@GithubExplorer:repositories',
    );

// Se esta variável estiver presente
    if (storagedRepositories) {

// Vamos retorná-lo, "desconvertendo" para array 
      return JSON.parse(storagedRepositories);
    }

// Se não encontrar nada dentro de repositories, retorna array vazio
		return [];
  });

  useEffect(() => {
// *O useEffect permite disparar uma função, que é enviada como primeiro parâmetro
// **Então vamos salvar no Local Storage
    localStorage.setItem(
// O LocalStorage é por endereço, então se estamos usando localhost:3000 nessa
// e em outras aplicações, o LocalStorage vai ser compartilhado 
// Para não haver conflito com outras aplicações que estão no mesmo localhost,
// passamos @NomeDaAplicação:nomedainformaçãoquequerogravarnostorage
      '@GithubExplorer:repositories',
// Aqui dentro vamos salvar os repositories convertidos para JSON
// Por isso utilizamos o JSON.stringify
      JSON.stringify(repositories),
    );
// *sempre que uma variável mudar, que é enviada como segundo parâmetro [repositories]
// **sempre que houver mudanças na variável repositories
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório.');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por este repositório.');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <a key={repository.full_name} href="teste">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
```

### Listando issues da API

- Podemos usar o useEffect de duas formas para listar os repositórios:

```tsx
useEffect(() => {
    api.get(`repos/${params.repository}`).then(response => {
      console.log(response.data);
    });

    api.get(`repos/${params.repository}/issues`).then(response => {
      console.log(response.data);
    });

// Com async/await normalmente as requisições só 
// seriam feitas após a primeira terminar
    async function loadData(): Promise<void> {
// Dessa forma, com Promise.all, conseguimos fazer com que elas retornem
// ao mesmo tempo, poupando tempo de carregamento, assim como no exemplo acima
      const [repository, issues] = await Promise.all([
        api.get(`repos/${params.repository}`),
        api.get(`repos/${params.repository}/issues`),
      ]);

      console.log(repository);
      console.log(issues);
    }
  });
```

