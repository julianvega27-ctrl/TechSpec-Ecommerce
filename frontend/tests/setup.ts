import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';
import axios from 'axios';

beforeAll(() => {
  axios.defaults.baseURL = 'http://localhost:3000/api';
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  delete axios.defaults.headers.common.Authorization;
});

afterAll(() => {
  server.close();
});
