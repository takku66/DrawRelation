class Drawer {

    /**
     * @param {*} frameElement 描画対象の要素
     * @param {*} data 描画対象のデータセット
     */
    constructor(frameElement, data){
        this.frameElement = frameElement;
        this.data = data;
    }

    /**
     * 図形を描画する
     */
    draw(){
        for(let i = 0, ilen = this.data.length; i < ilen; i++){
            if(isNull(this.data[i]) || isUndefined(this.data[i])) continue;
            const relation = this.createRelation(this.data[i]);
            RelationEventCreator.appendDeleteButton(relation);
            RelationEventCreator.appendResizePoint(relation);
        }
    }
    /**
     * 図形の要素を作成する
     * @param {*} json 
     * @returns 
     */
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
        return newElm;
    }

}
class ToolBox {
    /**
     * @param {*} frameElement 描画対象の要素
     * @param {*} data 描画対象のデータセット
     */
    constructor(frameElement, data){
        this.frameElement = frameElement;
        this.data = data;
        this.defaultWidth = 30;
        this.defaultHeight = 30;
    }

    /**
     * ツールボックスを描画する
     */
    draw(){
        for(let i = 0, ilen = this.data.length; i < ilen; i++){
            if(this.data[i] === null || typeof(this.data[i]) === 'undefined') continue;
            this.createTool(this.data[i]);
        }
    }
    /**
     * ツール群を作成する
     * @param {*} json 
     */
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
    /**
     * 各図形に削除機能をつける
     * @param {*} elm 
     * @returns 
     */
    appendDeleteButton: function(elm){
        const deleteBtn = document.createElement('div');
        deleteBtn.innerText = '✕';
        deleteBtn.classList.add('btn-delete');
        const tmpDltBtn = deleteBtn.cloneNode(true);
        elm.appendChild(tmpDltBtn);
        tmpDltBtn.addEventListener('click', function(){
            RelationEvent.delete(this.parentNode);
        }, false);
        return elm;
    },
    /**
     * 各図形にリサイズ用の印をつける
     * @param {*} elm 
     * @returns 
     */
    appendResizePoint: function(elm){
        const northP = document.createElement('div');   // 上
        northP.classList.add('resize_point');
        const neP = northP.cloneNode(true);             // 右上
        const eastP = northP.cloneNode(true);           // 右
        const seP = northP.cloneNode(true);             // 右下
        const southP = northP.cloneNode(true);          // 下
        const wsP = northP.cloneNode(true);             // 左下
        const westP = northP.cloneNode(true);           // 左
        const wnP = northP.cloneNode(true);             // 左上

        northP.classList.add('n');
        neP.classList.add('ne');
        eastP.classList.add('e');
        seP.classList.add('se');
        southP.classList.add('s');
        wsP.classList.add('ws');
        westP.classList.add('w');
        wnP.classList.add('wn');

        // 「│」縦のリサイズイベント
        northP.addEventListener('mousedown', RelationEvent.resizeNs, false);
        southP.addEventListener('mousedown', RelationEvent.resizeNs, false);
        // 「─」横のリサイズイベント
        eastP.addEventListener('mousedown', RelationEvent.resizeEw, false);
        westP.addEventListener('mousedown', RelationEvent.resizeEw, false);
        // 「／」右斜めのリサイズイベント
        neP.addEventListener('mousedown', RelationEvent.resizeNesw, false);
        wsP.addEventListener('mousedown', RelationEvent.resizeNesw, false);
        // 「＼」左斜めのリサイズイベント
        seP.addEventListener('mousedown', RelationEvent.resizeNwse, false);
        wnP.addEventListener('mousedown', RelationEvent.resizeNwse, false);

        elm.appendChild(northP);
        elm.appendChild(neP);
        elm.appendChild(eastP);
        elm.appendChild(seP);
        elm.appendChild(southP);
        elm.appendChild(wsP);
        elm.appendChild(westP);
        elm.appendChild(wnP);

        return elm;
    },
};

const RelationEvent = {

    /** 位置座標 */
    movePos: {x: 0, y: 0,},
    /**
     * 図形をマウスダウンした時のイベント
     */ 
    down: function(e) {
        // ターゲットの図形のみをイベント発火させる
        e.stopPropagation();

        // moveイベント内だと毎回上書きされてしまうので
        RelationEvent.movePos.x = e.pageX - this.offsetLeft;
        RelationEvent.movePos.y = e.pageY - this.offsetTop;
        
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
        if(dragingElm === null || typeof(dragingElm) === 'undefined') return;
        dragingElm.style.left = e.pageX - RelationEvent.movePos.x + 'px';
        dragingElm.style.top = e.pageY - RelationEvent.movePos.y + 'px';

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

        if( !isOnCtrl){
            RelationEvent.selectOff(e);
        }
        elm.classList.add(CLS.SELECTED);
        elm.removeEventListener('click', RelationEvent.select, false);

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
    /**
     * 図形の削除
     * @param {*} elm 
     */
    delete: function(elm){
        elm.remove();
    },
    /**
     * 図形のリサイズ処理
     * @param {*} e 
     */
    resizeNs: function(e){
        RelationEvent.ResizeEvent.down(e, RelationEvent.ResizeEvent.type.NS);
    },
    resizeEw: function(e){
        RelationEvent.ResizeEvent.down(e, RelationEvent.ResizeEvent.type.EW);
    },
    resizeNesw: function(e){
        RelationEvent.ResizeEvent.down(e, RelationEvent.ResizeEvent.type.NESW);
    },
    resizeNwse: function(e){
        RelationEvent.ResizeEvent.down(e, RelationEvent.ResizeEvent.type.NWSE);
    },
    ResizeEvent: {
        type: {'NS': 'ns', 'EW': 'ew', 'NESW': 'nesw', 'NWSE': 'nwse'},
        baseNum: {x: 0, y: 0},
        baseSize: {height: 0, width: 0},
        
        down: function(e, type){
            // ターゲットの図形のみをイベント発火させる
            e.stopPropagation();

            // moveイベント内だと毎回上書きされてしまうので
            RelationEvent.ResizeEvent.baseNum.x = e.pageX;
            RelationEvent.ResizeEvent.baseNum.y = e.pageY;

            const targetElm = e.target.parentNode;
            RelationEvent.ResizeEvent.baseSize.height = targetElm.offsetHeight;
            RelationEvent.ResizeEvent.baseSize.width = targetElm.offsetWidth;
            
            // 移動目的でマウスダウンされていれば、移動用のイベントを付与
            targetElm.classList.add(CLS.RESIZING);

            RelationEvent.ResizeEvent.move.type = type;
            document.body.addEventListener('mousemove', RelationEvent.ResizeEvent.move, false);

            if(_drdebug_) console.log(`Resize Event [keydown]. Target is ${targetElm.innerHTML}`);
        },
        move: {
            type: null,
            handleEvent: function(e){
                // ターゲットの図形のみをイベント発火させる
                e.stopPropagation();
                const resizingElm = document.getElementsByClassName(CLS.RESIZING)[0];
                if(resizingElm === null || typeof(resizingElm) === 'undefined') return;

                switch(RelationEvent.ResizeEvent.move.type){
                    case RelationEvent.ResizeEvent.type.NS:
                        resizingElm.style.height = RelationEvent.ResizeEvent.baseSize.height + (e.pageY - RelationEvent.ResizeEvent.baseNum.y) + 'px';
                        break;
                    case RelationEvent.ResizeEvent.type.EW:
                        resizingElm.style.width = RelationEvent.ResizeEvent.baseSize.width + (e.pageY - RelationEvent.ResizeEvent.baseNum.x) + 'px';
                        break;
                    case RelationEvent.ResizeEvent.type.NESW:
                    case RelationEvent.ResizeEvent.type.NWSE:
                        resizingElm.style.height = RelationEvent.ResizeEvent.baseSize.height + (e.pageY - RelationEvent.ResizeEvent.baseNum.y) + 'px';
                        resizingElm.style.width = RelationEvent.ResizeEvent.baseSize.width + (e.pageX - RelationEvent.ResizeEvent.baseNum.x) + 'px';
                        break;
                }
                // ドラッグを外した時も、画面外に行ったときも、同じ処理を実行
                e.target.addEventListener('mouseup', RelationEvent.ResizeEvent.clear, false);
                document.body.addEventListener('mouseleave', RelationEvent.ResizeEvent.clear, false);
            },
        },
        clear: function(e){
            e.stopPropagation();

            document.body.removeEventListener('mousemove', RelationEvent.ResizeEvent.move, false);
            document.body.removeEventListener('mouseleave', RelationEvent.ResizeEvent.clear, false);
    
            const resizingElm = document.getElementsByClassName(CLS.RESIZING)[0];
    
            if(isNull(resizingElm) || isUndefined(resizingElm)) return;
            e.target.removeEventListener('mouseup', RelationEvent.ResizeEvent.clear, false);
            resizingElm.classList.remove(CLS.RESIZING);
    
            if(_drdebug_) console.log(`Event Cleared!: ${e.target.innerHTML}`);
        },
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
        // ツールbox内に残した要素にも、今処理中のイベントと同じイベントをつける
        copyToolElm.addEventListener('mousedown', ToolBoxEvent.down, false);
        RelationEventCreator.addEvents([copyToolElm]);
        
        // ツールboxの座標分要素がずれてしまうので、ツールboxの位置も取得して位置ずれをなくす
        let x = e.pageX - this.offsetLeft - this.parentNode.offsetLeft;
        let y = e.pageY - this.offsetTop - this.parentNode.offsetTop;
        // ツールbox内にあると外に出せないので、外のフレームにだしてあげる
        document.getElementById(IDS.MAIN_FRAME).appendChild(this);
        this.style.left = e.pageX - x + 'px';
        this.style.top = e.pageY - y + 'px';
        
        RelationEventCreator.appendDeleteButton(this);
        RelationEventCreator.appendResizePoint(this);
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
                GlobalEvent.initializeAll(e);
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
            case KEYS.DELETE:
                GlobalEvent.deleteSelectedElms();
            default:
                break;
        }
    },
    /**
     * 各要素のイベントや選択状態等を、初期状態に戻す
     * @param {*} e 
     */
    initializeAll: function(e){
        RelationEvent.clear(e);
        RelationEvent.selectOff(e);
    },
    /**
     * Ctrlキーを押下中
     */
    onCtrl: function(){
        isOnCtrl = true;
    },
    /**
     * Ctrlキーを押下していない状態
     */
    offCtrl: function(){
        isOnCtrl = false;
    },
    /**
     * 選択中の図形を削除する
     * @returns 
     */
    deleteSelectedElms: function(){
        const selectedElms = document.getElementsByClassName(CLS.SELECTED);

        if(isNull(selectedElms) || isUndefined(selectedElms)) return false;

        for(let i = 0, ilen = selectedElms.length; i < ilen; i++){
            if(_drdebug_) console.log(`Delete elements! : ${i}: ${selectedElms[0].innerHTML}`);
            RelationEvent.delete(selectedElms[0]);
        }
    }
};


// ------------------------------
// 定数
const KEYS = {
    'ESCAPE': 'Escape',
    'CTRL': 'Control',
    'SHIFT': 'Shift',
    'ALT': 'Alt',
    'DELETE': 'Delete',
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
    'RESIZING': 'resizing',
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
    mainFrame.addEventListener('click', GlobalEvent.initializeAll, false);

}, false);
