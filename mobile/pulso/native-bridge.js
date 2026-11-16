import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { App } from '@capacitor/app';
if(Capacitor.isNativePlatform()){
 window.PulsoNative={async exportBackup(text,name){const result=await Filesystem.writeFile({path:name,data:text,directory:Directory.Cache,encoding:Encoding.UTF8});await Share.share({title:'Walamort Pulso · Backup',files:[result.uri]});}};
 App.addListener('appStateChange',({isActive})=>{if(!isActive)window.PulsoPause?.();});
 App.addListener('backButton',()=>{if(!window.PulsoBack?.())App.minimizeApp();});
}
