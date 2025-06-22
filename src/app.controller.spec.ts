import { AppController } from './app.controller';
import { AppService } from './app.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    const appService = { getHello: () => 'Hello World!' };
    appController = new AppController(appService as AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
