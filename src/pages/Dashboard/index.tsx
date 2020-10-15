import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories } from './styles';

const Dashboard: React.FC = () => {
  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form>
        <input placeholder="Digite o nome do repositório" />
        <button type="submit">Pesquisar</button>
      </Form>

      <Repositories>
        <a href="teste">
          <img
            src="https://avatars3.githubusercontent.com/u/57918707?s=460&u=0dfcf0e53b46a747752c4cfbc377936cbbf361b6&v=4"
            alt="Raquel Rodrigues"
          />
          <div>
            <strong>raquelribeiro2/primeiro-projeto-react</strong>
            <p>GoStack Bootcamp 2020 - Primeiro Projeto ReactJS</p>
          </div>
          <FiChevronRight size={20} />
        </a>
      </Repositories>
    </>
  );
};

export default Dashboard;
