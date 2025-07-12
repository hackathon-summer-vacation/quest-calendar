import { API, graphqlOperation } from 'aws-amplify';
import { createHomework } from './graphql/mutations';

const newHomework = {
  id: 'hw1',
  userId: 'user1',
  title: '宿題A',
  content: 'ページ1-10',
  dueDate: '2025-07-15',
  type: 'math',
  difficult: 'easy'
};

API.graphql(graphqlOperation(createHomework, { input: newHomework }))
  .then(res => console.log(res))
  .catch(err => console.error(err));