import type { Component } from 'solid-js';
import { Navigate, Route, Router, Routes } from '@solidjs/router';

import Queues from './pages/queues';
import NewQueue from './pages/new-queue';

const App: Component = () => {
  return (
    <Router>
      <Routes>
        <Route path='/queues' component={Queues} />
        <Route path='/queues/new' component={NewQueue} />
        <Route path='*' element={<Navigate href='queues' />} />
      </Routes>
    </Router>
  );
};

export default App;
