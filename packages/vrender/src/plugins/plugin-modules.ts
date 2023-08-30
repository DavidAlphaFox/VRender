import { ContainerModule } from 'inversify';
import { PluginService } from './constants';
import { DefaultPluginService } from './plugin-service';
import { bindContributionProviderNoSingletonScope } from '../common/contribution-provider';
import { AutoEnablePlugins } from './constants';

export default new ContainerModule(bind => {
  bind(DefaultPluginService).toSelf();
  bind(PluginService).toService(DefaultPluginService);

  // image 渲染器注入contributions
  bindContributionProviderNoSingletonScope(bind, AutoEnablePlugins);
});
