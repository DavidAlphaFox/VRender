import { container, type Container } from '@visactor/vrender-core';
import { loadMathPicker } from '../picker/math-module';
import { nodeEnvModule } from './contributions/module';
import { nodeCanvasModule } from '../canvas/contributions/node/modules';
import { nodeWindowModule } from '../window/contributions/node-contribution';

let loaded = false;
export function loadNodeEnv(container: Container, loadPicker: boolean = true) {
  if (!loaded) {
    loaded = true;
    container.load(nodeEnvModule);
    container.load(nodeCanvasModule);
    container.load(nodeWindowModule);
    loadPicker && loadMathPicker(container);
  }
}

export function initNodeEnv() {
  loadNodeEnv(container);
}
