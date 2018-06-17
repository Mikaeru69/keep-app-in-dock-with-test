// keep-app-in-dock-with-test.js
const electron = require ('electron');
const app = electron.app || electron.remote.app;
const path = require ('path');
const url = require ('url');
const { spawnSync } = require ('child_process');
//
function isAppInDock (appURL)
{
    let isInDock = false;
    let defaults = spawnSync ('defaults', [ 'read', 'com.apple.dock', 'persistent-apps' ], { encoding: 'utf8' });
    if (!defaults.error)
    {
        let pattern = `"_CFURLString" = "${appURL}"`;
        let grep = spawnSync ('grep', [ '-e', pattern ], { input: defaults.stdout, encoding: 'utf8' });
        if (!grep.error)
        {
            if (grep.stdout.length)
            {
                isInDock = true;
            }
        }
    }
    return isInDock;
}
//
function keepAppInDock (appURL)
{
    let entry = `<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>${appURL}</string><key>_CFURLStringType</key><integer>15</integer></dict></dict></dict>`;
    let defaults = spawnSync ('defaults', [ 'write', 'com.apple.dock', 'persistent-apps', '-array-add', entry ], { encoding: 'utf8' });
    if (!defaults.error)
    {
        let killall = spawnSync ('killall', [ 'Dock' ], { encoding: 'utf8' });
    }
}
//
let appPackagePath = path.join (app.getPath ('exe'), '..', '..', '..');
let appPackageURL = encodeURI (url.format ({ protocol: 'file', slashes: true, pathname: appPackagePath })) + '/';
//
if (!isAppInDock (appPackageURL))
{
    keepAppInDock (appPackageURL)
}
