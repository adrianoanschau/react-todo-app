import React from 'react';
import './App.css';
import '../node_modules/bulma/css/bulma.min.css';
import {LoginComponent} from "./components/login";
import {TasksComponent} from "./components/tasks";

type User = {
  email: string
  name: string
}

export const AppContext = React.createContext<{
  user: User|null,
  setUser(user: User): void
}>({
  user: null,
  setUser: () => {},
});

function App() {

  const [user, setUser] = React.useState<User|null>(null);

  React.useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <div className="App">
        <main>
          <h1 className="title has-text-white">Todo App</h1>
          {!user && <LoginComponent />}
          {user && <TasksComponent />}
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;
