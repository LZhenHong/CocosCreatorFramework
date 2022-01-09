import { SettingAudioPrefKey, SettingMusicPrefKey } from "../const/Const";
import BaseManager from "../utility/BaseManager";
import AssetsManager from "./AssetsManager";
import PrefManager from "./PrefManager";
import PreloadManager from "./PreloadManager";

let AudioDirectory = 'audios/';

export default class AudioManager extends BaseManager {

    private _cacheAudioMap = new Map<string, cc.AudioClip>();

    set isMusicOn(on: boolean) {
        this.setSettingPref(SettingMusicPrefKey, on);
    }
    get isMusicOn(): boolean {
        return this.getSettingPref(SettingMusicPrefKey);
    }

    set isAudioOn(on: boolean) {
        this.setSettingPref(SettingAudioPrefKey, on);
    }
    get isAudioOn(): boolean {
        return this.getSettingPref(SettingAudioPrefKey);
    }

    private getPrefManager(): PrefManager {
        return this.gameManager.getManager(PrefManager);
    }

    private setSettingPref(key: string, value: boolean) {
        let mgr = this.getPrefManager();
        mgr.setBool(key, value);
    }

    private getSettingPref(key: string): boolean {
        let mgr = this.getPrefManager();
        return mgr.getBool(key, true);
    }

    protected onInit() { }

    protected onDestroy() { }

    private _playingAudioThisFrame = new Map<string, boolean>();
    override onUpdate() {
        this._playingAudioThisFrame.clear();
    }

    public playAudio(audioName: string, loop?: boolean) {
        if (!this.isAudioOn) {
            return;
        }

        if (this._playingAudioThisFrame.get(audioName)) {
            return;
        }

        if (this._cacheAudioMap.get(audioName)) {
            let audio = this._cacheAudioMap.get(audioName);
            cc.audioEngine.playEffect(audio, loop === true);
            this._playingAudioThisFrame[audioName] = true;
            return;
        }

        let preloadMgr = this.gameManager.getManager(PreloadManager);
        let audioClip = preloadMgr.getPreloadAssetWithName(audioName, cc.AudioClip);
        if (audioClip) {
            cc.audioEngine.playEffect(audioClip, loop === true);
            this._playingAudioThisFrame[audioName] = true;
            return;
        }

        let audioPath = `${AudioDirectory}${audioName}`;
        let assetMgr = this.gameManager.getManager(AssetsManager);
        assetMgr.loadAudio(audioPath, (isSucc, audio, error) => {
            if (isSucc) {
                this._cacheAudioMap.set(audioName, audio);
                this.playAudio(audioName);
            } else {
                console.error(`Load audio: ${audioName}, error: ${error.message}`);
            }
        });
    }

    public stopAudio() {

    }

    public playMusic(musicName: string) {
        if (!this.isMusicOn) {
            return;
        }

        if (cc.audioEngine.isMusicPlaying()) {
            return;
        }

        if (this._cacheAudioMap.get(musicName)) {
            let audio = this._cacheAudioMap.get(musicName);
            cc.audioEngine.playMusic(audio, true);
            return;
        }

        let preloadMgr = this.gameManager.getManager(PreloadManager);
        let audioClip = preloadMgr.getPreloadAssetWithName(musicName, cc.AudioClip);
        if (audioClip) {
            cc.audioEngine.playMusic(audioClip, true);
            return;
        }

        let audioPath = `${AudioDirectory}${musicName}`;
        let assetMgr = this.gameManager.getManager(AssetsManager);
        assetMgr.loadAudio(audioPath, (isSucc, audio, error) => {
            if (isSucc) {
                this._cacheAudioMap.set(musicName, audio);
                this.playMusic(musicName);
            } else {
                console.error(`Load audio: ${musicName}, error: ${error.message}`);
            }
        });
    }

    public stopMusic() {
        cc.audioEngine.stopMusic();
    }

    public pauseMusic() {
        cc.audioEngine.pauseMusic();
    }

    public resumeMusic() {
        cc.audioEngine.resumeMusic();
    }

}
