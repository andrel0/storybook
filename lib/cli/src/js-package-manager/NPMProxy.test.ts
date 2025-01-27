import { NPMProxy } from './NPMProxy';

describe('NPM Proxy', () => {
  let npmProxy: NPMProxy;

  beforeEach(() => {
    npmProxy = new NPMProxy();
  });

  describe('initPackageJson', () => {
    it('should run `npm init -y`', () => {
      const executeCommandSpy = jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('');

      npmProxy.initPackageJson();

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', ['init', '-y']);
    });
  });

  describe('installDependencies', () => {
    it('should run `npm install`', () => {
      const executeCommandSpy = jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('');

      npmProxy.installDependencies();

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', ['install'], expect.any(String));
    });
  });

  describe('addDependencies', () => {
    it('with devDep it should run `npm install -D @storybook/addons`', () => {
      const executeCommandSpy = jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('');

      npmProxy.addDependencies({ installAsDevDependencies: true }, ['@storybook/addons']);

      expect(executeCommandSpy).toHaveBeenCalledWith(
        'npm',
        ['install', '-D', '@storybook/addons'],
        expect.any(String)
      );
    });
  });

  describe('latestVersion', () => {
    it('without contraint it returns the latest version', async () => {
      const executeCommandSpy = jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('"5.3.19"');

      const version = await npmProxy.latestVersion('@storybook/addons');

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', [
        'info',
        '@storybook/addons',
        'version',
        '--json',
      ]);
      expect(version).toEqual('5.3.19');
    });

    it('with contraint it returns the latest version satisfying the constraint', async () => {
      const executeCommandSpy = jest
        .spyOn(npmProxy, 'executeCommand')
        .mockReturnValue('["4.25.3","5.3.19","6.0.0-beta.23"]');

      const version = await npmProxy.latestVersion('@storybook/addons', '5.X');

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', [
        'info',
        '@storybook/addons',
        'versions',
        '--json',
      ]);
      expect(version).toEqual('5.3.19');
    });

    it('throws an error if command output is not a valid JSON', async () => {
      jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('NOT A JSON');

      await expect(npmProxy.latestVersion('@storybook/addons')).rejects.toThrow();
    });
  });
});
