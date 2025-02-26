import {delay, loadRes} from './delay.js'
import { Laya } from 'Laya.js';
import { Image } from 'laya/ui/Image.js';
import { Text } from 'laya/display/Text.js';
import { Sprite } from 'laya/display/Sprite.js';

class Main {
	constructor() {
        Laya.init(800,600);
		//Laya.stage.scaleMode = 'fixedwidth';
		Laya.stage.screenMode = 'none';
        //Laya.Stat.show();
        this.test1();
    }
    
    /**
     * cacheas normal 移动位置。
     */
    async test1(){
        await loadRes('./res/monkey0.png');
        var sp = new Image();
        sp.skin = './res/monkey0.png';
        sp.pos(100,100);
        sp.scale(0.5,1.5);          // 必须要有缩放。因为cacheas normal要先把缩放去掉。
        Laya.stage.addChild(sp);

        /**
         * cache as normal 。并且在一个完全相同条件的texture后面。容易出错
         * 这时候要防止错误优化（不再上传shadervalue，导致mmat没有正确给shader）
         */
        var sp2 = new Image();
        sp2.skin = './res/monkey0.png';
        sp2.cacheAs='normal';
        sp2.pos(100,100);
        sp.addChild(sp2);

        var tx1 = new Text();      // 文字有个问题 一旦cache之后，无法再像素对齐了，所以无法保证和不cache的一致
        tx1.text='ABCD';
        tx1.pos(100,0);
        tx1.scale(3,3);
        tx1.fontSize=20;
        tx1.color='red';
        sp2.addChild(tx1);

        // bitmap 下面 normal 要能正常
        var sp10 = new Image();
        sp10.skin = './res/monkey0.png';
        sp10.pos(300,10);
        sp10.scale(0.5,1.5);          // 必须要有缩放。因为cacheas normal要先把缩放去掉。
        sp10.cacheAs='bitmap'
        Laya.stage.addChild(sp10);
        var sp11 = new Sprite();
        sp11.cacheAs='normal';
        sp11.graphics.drawRect(0,0,10,10,'red');
        sp10.addChild(sp11);        

        await delay(10);  // 等待渲染结果
        (window as any).testEnd=true;   // 告诉测试程序可以停止了
    }
}

//激活启动类
new Main();
