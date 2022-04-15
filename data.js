class Node {
    constructor(id, group, content, image, position, link){
        if(id === null || typeof(id) === 'undefined'){
            throw new Error("id 属性は必ず設定してください。");
        }
        this.id = id;
        this.group = group || '';
        this.content = content || '';
        
        this.image = image;
        this.position = position;
        this.link = link;
    }
}
class Image {
    constructor(url, width, height){
        this.url = url || 0;
        this.width = width || 0;
        this.height = height || 0;
    }
}
class Position {
    constructor(top, left){
        this.top = top || 0;
        this.left = left || 0;
    }
}
class Link {
    constructor(prevNodeList, nextNodeList){
        this.prevNodeList = prevNodeList || [];
        this.nextNodeList = nextNodeList || [];
    }
}

const toolBoxSampleData = [
    {'no': '1', 'url':'img/サーバー1.svg'},
    {'no': '2', 'url':'img/丸矢印.svg'},
    {'no': '3', 'url':'img/矢印_ノーマル.svg'},
    {'no': '4', 'url':'img/矢印_黒塗り.svg'},
    {'no': '5', 'url':'img/矢印_三角.svg'},
    {'no': '6', 'url':'img/矢印_徐々.svg'},
    {'no': '7', 'url':'img/矢印_中抜き.svg'},
    {'no': '8', 'url':'img/ルーター１.svg'},
    {'no': '9', 'url':'img/スイッチ１.svg'},
];


const sampleJson = [
    {'id': 'sample1', 'group': 'sample', 'content': 'あいうえおかきくけこああああ', 'imageUrl': 'img/丸矢印.svg', 'imageWidth': '80', 'imageHeight': '80', 'top': '0', 'left': '0', 'prevNode': [], 'nextNode': []},
    {'id': 'sample2', 'group': 'sample', 'content': '', 'imageUrl': 'img/矢印_ノーマル.svg', 'imageWidth': '80', 'imageHeight': '80', 'top': '0', 'left': '100', 'prevNode': [], 'nextNode': []},
    {'id': 'sample3', 'group': 'sample', 'content': '<script>alert("aaa");</script>', 'imageUrl': 'img/サーバー1.svg', 'imageWidth': '80', 'imageHeight': '80', 'top': '0', 'left': '200', 'prevNode': [], 'nextNode': []},
    {'id': 'sample4', 'group': 'sample', 'content': 'http://www.co.jp/', 'imageUrl': 'img/サーバー1.svg', 'imageWidth': '80', 'imageHeight': '80', 'top': '0', 'left': '300', 'prevNode': [], 'nextNode': []},
];

const sampleData = [];

for(let i = 0, ilen = sampleJson.length; i < ilen; i++){
    sampleData.push(new Node(sampleJson[i].id,
                                sampleJson[i].group,
                                sampleJson[i].content,
                                new Image(sampleJson[i].imageUrl, sampleJson[i].imageWidth, sampleJson[i].imageHeight),
                                new Position(sampleJson[i].top, sampleJson[i].left),
                                new Link(sampleJson[i].prevNode, sampleJson[i].nextNode),
                                ));
}



// アイコンは下記サイトより
// https://sozai.cman.jp/icon/computer/