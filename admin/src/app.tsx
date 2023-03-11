import type { Component } from 'solid-js';
import { Navigate, Route, Router, Routes } from '@solidjs/router';

import Queues from './pages/queues';
import Queue from './pages/queue';
import NewQueue from './pages/new-queue';
import EditQueue from './pages/edit-queue';

const App: Component = () => {
  return (
    <Router>
      <Routes>
        <Route path='/queues' component={Queues} />
        <Route path='/queues/:name' component={Queue} />
        <Route path='/queues/:name/edit' component={EditQueue} />
        <Route path='/queues/_/new' component={NewQueue} />
        <Route path='*' element={<Navigate href='queues' />} />
      </Routes>
    </Router>
  );
};

export default App;
