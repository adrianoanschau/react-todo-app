import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {setContext} from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: 'https://nestjs-graphql-api.herokuapp.com/',
});

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
  if (response && response.errors) {
    response.errors = response.errors.map(error => {
      return error.extensions?.exception?.response;
    });
  }
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    errorLink,
    authLink,
    httpLink,
  ]),
  defaultOptions: {
    mutate: {
      errorPolicy: 'all'
    }
  }
});