import React from 'react';
import {gql, useMutation, useQuery} from '@apollo/client';
import {LoginFormComponent, LoginFormInput} from "./login-form";
import {AppContext} from "../App";

const LOGIN_MUTATION = gql`
    mutation Login($email: String!) {
        login(email: $email) {
            access_token
        }
    }
`;

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($name: String!, $email: String!) {
        createUser(name: $name, email: $email) {
            name
            email
        }
    }
`;

const ME_QUERY = gql`
  query Me {
      me {
          name
          email
      }
  }
`;

export const LoginComponent = () => {
  const { setUser } = React.useContext(AppContext);
  const [login, loginResponse] = useMutation(LOGIN_MUTATION);
  const [createUser, createUserResponse] = useMutation(CREATE_USER_MUTATION);
  const meResponse = useQuery(ME_QUERY);
  const [register, setRegister] = React.useState(false);

  React.useEffect(() => {
    if (meResponse.data) {
      setUser(meResponse.data.me);
    }
  }, [meResponse.data, setUser]);

  React.useEffect(() => {
    if (loginResponse.data) {
      (async () => {
        sessionStorage.setItem('token', loginResponse.data.login?.access_token);
        await meResponse.refetch();
      })();
    }
  }, [loginResponse.data, meResponse]);

  React.useEffect(() => {
    if (createUserResponse.data) {
      (async () => {
        const user = createUserResponse.data.createUser;
        if (user.email) {
          await login({ variables: { email: user.email } });
        }
      })();
    }
  }, [createUserResponse.data, login]);

  React.useEffect(() => {
    if (loginResponse.error?.message === 'email not found') {
      setRegister(true);
    }
  }, [loginResponse.error]);

  React.useEffect(() => {
    if (createUserResponse.error) {
      console.log(createUserResponse.error);
    }
  }, [createUserResponse.error]);

  const handleSubmit = React.useCallback(async (variables: LoginFormInput) => {
    if (register) {
      await createUser({ variables });
    } else {
      await login({ variables });
    }
  }, [register, login, createUser]);

  return (
    <div className="box" style={{
      position: 'relative',
      overflow: 'hidden',
    }}>
      {loginResponse.loading && (
        <progress className="progress is-medium is-info" style={{
          position: 'absolute',
          left: 0, top: 0, borderRadius: 0,
        }} />
      )}
      <LoginFormComponent
        register={register}
        disabled={loginResponse.loading || createUserResponse.loading}
        onSubmit={handleSubmit} />
    </div>
  );
};