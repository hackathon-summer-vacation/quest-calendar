/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getHomework = /* GraphQL */ `
  query GetHomework($id: ID!) {
    getHomework(id: $id) {
      id
      title
      description
      status
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listHomework = /* GraphQL */ `
  query ListHomework(
    $filter: ModelHomeworkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHomework(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        status
        userId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
