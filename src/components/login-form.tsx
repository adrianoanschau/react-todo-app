import React from 'react';

export type LoginFormInput = {
  email: string
  name?: string
}

type Props = {
  register?: boolean;
  disabled?: boolean;
  onSubmit(data: LoginFormInput): void
}

export const LoginFormComponent: React.FC<Props> = ({ register = false, disabled = false, onSubmit }) => {

  const emailInput = React.useRef<HTMLInputElement|null>(null);
  const nameInput = React.useRef<HTMLInputElement|null>(null);

  const handleSubmit = React.useCallback(() => {
    if (emailInput.current) {
      const data: LoginFormInput = {
        email: emailInput.current.value
      };
      if (register && nameInput.current) {
        data.name = nameInput.current.value;
      }
      onSubmit(data);
    }
  }, [register, emailInput, nameInput, onSubmit]);

  return (
    <form style={{ width: 480, maxWidth: '100%' }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>

      <h1 className="title">
        {register ? 'Registre-se' : 'Login'}
      </h1>

      <div className="field">
        <label className="label">E-mail</label>
        <div className="control">
          <input ref={emailInput} type="text"
                 className="input"
                 placeholder="Digite seu e-mail"
                 disabled={disabled}
                 autoFocus
          />
        </div>
      </div>

      {register && (
        <div className="field">
          <label className="label">Nome</label>
          <div className="control">
            <input ref={nameInput} type="text"
                   className="input"
                   placeholder="Digite seu nome"
                   disabled={disabled}
                   autoFocus
            />
          </div>
        </div>
      )}

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link" disabled={disabled}>Entrar</button>
        </div>
      </div>
    </form>
  );
};