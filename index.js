class Drawer {
    constructor(frameElement, data){
        this.frameElement = frameElement;
        this.data = data;
    }

    draw(){
        for(let i = 0, ilen = this.data.length; i < ilen; i++){
            if(isNull(this.data[i]) || isUndefined(this.data[i])) continue;
            this.createRelation(this.data[i]);
        }
    }
    createRelation(json){
        const newElm = document.createElement('div');
        const imgDiv = document.createElement('div');
        newElm.id = json.id;
        newElm.innerText = json.content;
        newElm.classList.add(CLS.RELATION);
        newElm.style.top = json.position.top + 'px';
        newElm.style.left = json.position.left + 'px';

        imgDiv.classList.add('image');
        imgDiv.style.width = json.image.width + 'px';
        imgDiv.style.height = json.image.height + 'px';
        imgDiv.style.backgroundImage = `url(${json.image.url})`;
        imgDiv.style.backgroundSize = 'contain';
        imgDiv.style.backgroundRepeat = 'no-repeat';
        
        this.frameElement.appendChild(newElm);
        newElm.appendChild(imgDiv);
    }
}
class ToolBox {
    constructor(frameElement, data){
        this.frameElement = frameElement;
        this.data = data;
        this.defaultWidth = 30;
        this.defaultHeight = 30;
    }

    draw(){
        for(let i = 0, ilen = this.data.length; i < ilen; i++){
            if(this.data[i] === null || typeof(this.data[i]) === 'undefined') continue;
            this.createTool(this.data[i]);
        }
    }
    createTool(json){
        const newElm = document.createElement('div');
        const imgDiv = document.createElement('div');
        newElm.classList.add(CLS.RELATION);
        newElm.classList.add(CLS.TOOL_ITEM);
        newElm.style.top = json.no*this.defaultHeight + 10 + 'px';
        newElm.style.left = 0 + 'px';

        imgDiv.classList.add('image');
        imgDiv.style.width = this.defaultWidth + 'px';
        imgDiv.style.height = this.defaultHeight + 'px';
        imgDiv.style.backgroundImage = `url(${json.url})`;
        imgDiv.style.backgroundSize = 'contain';
        imgDiv.style.backgroundRepeat = 'no-repeat';
        
        this.frameElement.appendChild(newElm);
        newElm.appendChild(imgDiv);
    }
}

// ------------------------------
/**
 * イベント生成オブジェクト：図形
 */
const RelationEventCreator = {
    addEvents: function(elms){
        // 要素に対してマウスが押された時に、要素の移動に関わる各イベントを付与する
        for(let i = 0, ilen = elms.length; i < ilen; i++) {
            elms[i].addEventListener('mousedown', RelationEvent.down, false);
        }
    },
};
const RelationEvent = {
    
    x: 0,
    y: 0,

    /**
     * 図形をマウスダウンした時のイベント
     */ 
    down: function(e) {
        // ターゲットの図形のみをイベント発火させる
        e.stopPropagation();

        // moveイベント内だと毎回上書きされてしまうので
        x = e.pageX - this.offsetLeft;
        y = e.pageY - this.offsetTop;
        
        // 移動目的でマウスダウンされていれば、移動用のイベントを付与
        this.classList.add(CLS.DRAGING);
        document.body.addEventListener('mousemove', RelationEvent.move, false);

        // 選択目的でマウスダウンされていれば、選択用のイベントを付与
        document.body.addEventListener('click', RelationEvent.clear, false);
        this.addEventListener('click', RelationEvent.select, false);

        if(_drdebug_) console.log(`KeyDown Event. Target is ${e.target.innerHTML}`);
    },
    /**
     * 図形を動かすためのイベント
     * @param {Event} e 
     */
    move: function(e) {

        const dragingElm = document.getElementsByClassName(CLS.DRAGING)[0];
        dragingElm.style.left = e.pageX - x + 'px';
        dragingElm.style.top = e.pageY - y + 'px';

        this.removeEventListener('click', RelationEvent.select, false);

        // ドラッグを外した時も、画面外に行ったときも、同じ処理を実行
        dragingElm.addEventListener('mouseup', RelationEvent.clear, false);
        document.body.addEventListener('mouseleave', RelationEvent.clear, false);

    },

    /**
     * 図形の移動系イベント全てクリア
     * @param {Event} e 
     * @returns 
     */
    clear: function(e) {
        e.stopPropagation();

        document.body.removeEventListener('mousemove', RelationEvent.move, false);
        document.body.removeEventListener('mouseleave', RelationEvent.clear, false);

        const dragingElm = document.getElementsByClassName(CLS.DRAGING)[0];

        if(isNull(dragingElm) || isUndefined(dragingElm)) return;
        dragingElm.removeEventListener('mouseup', RelationEvent.clear, false);
        dragingElm.classList.remove(CLS.DRAGING);

        if(_drdebug_) console.log(`Event Cleared!: ${e.target.innerHTML}`);
    },
    /**
     * 図形の選択イベント
     * @param {Event} e 
     */
    select: function(e) {
        e.stopPropagation();

        const selectedElms = document.getElementsByClassName(CLS.SELECTED);

        if( !isOnCtrl){
            RelationEvent.selectOff();
        }
        this.classList.add(CLS.SELECTED);
        this.removeEventListener('click', RelationEvent.select, false);

        if(_drdebug_) console.log(`Select Target is ${e.target.innerHTML}`);
    },
    /**
     * 図形の選択解除
     * @param {Event} e 
     * @returns 
     */
    selectOff: function(e){
        const selectedElms = document.getElementsByClassName(CLS.SELECTED);

        if(isNull(selectedElms) || isUndefined(selectedElms)) return false;
        // for...of使うとなぜか1/2のループ回数になる
        // → getElementsByClass..で取得した要素に対して、removeでクラス名を取り除くとその状態が反映される。
        //   これはgetElements...で取得したリストにも影響があるっぽい。
        // ループ用変数をもっておいて、常に0番目を参照するように変更した。
        for(let i = 0, ilen = selectedElms.length; i < ilen; i++){
            if(_drdebug_) console.log(`Deselect all elements! : ${i}: ${selectedElms[0].innerHTML}`);
            selectedElms[0].removeEventListener('click', RelationEvent.selectOff, false);
            selectedElms[0].classList.remove(CLS.SELECTED);
        }
    },
};

// ------------------------------
/**
 * イベント生成オブジェクト：ツールbox周り
 */
const ToolBoxEventCreator = {
    addEvents: function(elms){
        for(let i = 0, ilen = elms.length; i < ilen; i++) {
            elms[i].addEventListener('mousedown', ToolBoxEvent.down, false);
        }
    },
};
/**
 * ツールboxのイベント群
 */
const ToolBoxEvent = {
    down: function(e) {
        // 選択したものはドラッグで移動してしまうので、
        // コピーしたものをツールboxの中に残す
        const copyToolElm = this.cloneNode(true);
        this.parentNode.appendChild(copyToolElm);
        copyToolElm.addEventListener('mousedown', ToolBoxEvent.down, false);

        let x = e.pageX - this.offsetLeft - this.parentNode.offsetLeft;
        let y = e.pageY - this.offsetTop - this.parentNode.offsetTop;
        document.getElementById(IDS.MAIN_FRAME).appendChild(this);
        this.style.left = e.pageX - x + 'px';
        this.style.top = e.pageY - y + 'px';

        // 通常の要素と同じ用にイベントを付与
        RelationEventCreator.addEvents([copyToolElm]);
        this.classList.remove(CLS.TOOL_ITEM);
        this.removeEventListener('mousedown', ToolBoxEvent.down, false);
    },

};

// ------------------------------
// 各フラグ的なもの
// Ctrlボタン押下中
var isOnCtrl = false;
var _drdebug_ = false;
var _drtest_ = false;
// ------------------------------
// グローバルイベント
const GlobalEvent = {
    kdown: function(e){

        if(e.ctrlKey && e.altKey && e.shiftKey){
            if(e.key === 'D'){
                if(_drdebug_){
                    _drdebug_ = false;
                    console.log(`Debug Mode Stop! [_drdebug_: ${_drdebug_}]`);
                }else{
                    _drdebug_ = true;
                    console.log(`Debug Mode Start! [_drdebug_: ${_drdebug_}]`);
                }                
            }
            if(e.key === 'T'){
                if(_drtest_){
                    _drtest_ = false;
                    console.log(`Test Mode Stop! [_drdebug_: ${_drdebug_}]`);
                }else{
                    _drtest_ = true;
                    console.log(`Test Mode Start! [_drdebug_: ${_drdebug_}]`);
                }                
            }
        }


        if(_drtest_) console.log(e.key);
        switch(e.key){
            case KEYS.ESCAPE:
                GlobalEvent.clearAll(e);
                break;
            case KEYS.CTRL:
                GlobalEvent.onCtrl();
                break;
            default:
                break;
        }
    },
    kup: function(e){

        switch(e.key){
            case KEYS.ESCAPE:
                break;
            case KEYS.CTRL:
                GlobalEvent.offCtrl();
                break;
            default:
                break;
        }
    },
    clearAll: function(e){
        RelationEvent.clear(e);
        RelationEvent.selectOff(e);
    },
    onCtrl: function(){
        isOnCtrl = true;
    },
    offCtrl: function(){
        isOnCtrl = false;
    }
};


// ------------------------------
// 定数
const KEYS = {
    'ESCAPE': 'Escape',
    'CTRL': 'Control',
    'SHIFT': 'Shift',
    'ALT': 'Alt',
};
const IDS = {
    'MAIN_FRAME': 'mainContainer',
    'TOOL_BOX': 'toolBox',
};
const CLS = {
    'DRAGING': 'draging',
    'RELATION': 'relation',
    'SELECTED' :'selected',
    'TOOL_BOX': 'toolBox',
    'TOOL_ITEM': 'tool',
    'RELATION_IN_TOOL': 'relation tool',
};

// ------------------------------
// 共通関数
function isUndefined(elm){
    if(typeof(elm) === 'undefined'){
        return true;
    }else{
        return false;
    }
}
function isNull(elm){
    if(typeof(elm) === null){
        return true;
    }else{
        return false;
    }
}

// ------------------------------

window.addEventListener('DOMContentLoaded', function(){

    const mainFrame = document.getElementById(IDS.MAIN_FRAME);
    const drawData = sampleData || {};
    const drawer = new Drawer(mainFrame, drawData);

    const toolBoxFrame = document.getElementById(IDS.TOOL_BOX);
    const toolBoxData = toolBoxSampleData || {};
    const toolBox = new ToolBox(toolBoxFrame, toolBoxData);
    drawer.draw();
    toolBox.draw();

    // ツールの要素を取得して、クリックされた時に要素をクローンするイベントを付与する
    const toolBoxElement = document.getElementsByClassName(CLS.TOOL_BOX);
    RelationEventCreator.addEvents(toolBoxElement);

    const toolElements = document.getElementsByClassName(CLS.RELATION_IN_TOOL);
    ToolBoxEventCreator.addEvents(toolElements);

    const relationTargets = document.getElementsByClassName(CLS.RELATION);
    RelationEventCreator.addEvents(relationTargets);


    window.addEventListener('keydown', GlobalEvent.kdown, false);
    window.addEventListener('keyup', GlobalEvent.kup, false);
    mainFrame.addEventListener('click', GlobalEvent.clearAll, false);

}, false);
