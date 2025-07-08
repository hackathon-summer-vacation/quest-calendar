/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createHomework = /* GraphQL */ `
  mutation CreateHomework(
    $input: CreateHomeworkInput!
    $condition: ModelHomeworkConditionInput
  ) {
    createHomework(input: $input, condition: $condition) {
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
export const updateHomework = /* GraphQL */ `
  mutation UpdateHomework(
    $input: UpdateHomeworkInput!
    $condition: ModelHomeworkConditionInput
  ) {
    updateHomework(input: $input, condition: $condition) {
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
export const deleteHomework = /* GraphQL */ `
  mutation DeleteHomework(
    $input: DeleteHomeworkInput!
    $condition: ModelHomeworkConditionInput
  ) {
    deleteHomework(input: $input, condition: $condition) {
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
