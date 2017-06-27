const KeyValueManager = require('KeyValueManager');
const EventManager = require('EventManager');
const NetManager = require('NetManager');
const DataSend = require('dataSend');
const Utils = require('utils')
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        inputName: cc.EditBox,

    },
             onClick:function (event, id) {
                 switch (id) {
                     case "create": {

                         let event1 = {
                             url: KeyValueManager['server_url'],
                             msg_id: C2G_REQ_CREATE_TEAM,
                             user_id: KeyValueManager['player_data']['user_id'],
                             name: this.inputName.string,
                             session_key: KeyValueManager['session'],
                         };
                         NetManager.sendMsg(event1);

                         //
                     }
                         break;
                     case "return": {
                         EventManager.pushEvent({'msg_id': 'CLOSE_LAYER', 'destroy':true});
                     }
                     break;
                 }


             },
             reuse:function () {
                 EventManager.registerHandler(C2G_REQ_CREATE_TEAM, this);
                 let clip = this.getComponent(cc.Animation);
                 if (clip && clip.defaultClip) {
                     clip.play();
                 }
             },
    onDisable: function () {
                 EventManager.removeHandler(C2G_REQ_CREATE_TEAM, this);

                 let clip = this.getComponent(cc.Animation);
                 if (clip && clip.currentClip) {
                     clip.stop();
                 }
             },
             processEvent: function (event) {
                 let msg_id = event['msg_id'];
                 switch (msg_id) {
                     case C2G_REQ_CREATE_TEAM: {
                         if (event['result']) {
                             KeyValueManager['player_data']['player_info']['team'] = event['id'];
                             EventManager.pushEvent({'msg_id': 'CLOSE_LAYER', 'destroy':true});
                             EventManager.pushEvent({'msg_id': 'CLOSE_LAYER', 'destroy':true});
                             EventManager.pushEvent({'msg_id': 'OPEN_LAYER', 'layer_id': 'team_layer', 'hide_preLayer':false});
                         }
                         else if(event['error_code'] == 91010){
                             KeyValueManager['msg_text'] = '已存在该战队名';
                             EventManager.pushEvent({'msg_id': 'OPEN_LAYER', 'layer_id': 'msg_layer', 'hide_preLayer':false});
                         }
                     }
                         break;
                 }
             },
    // use this for initialization
    onLoad: function () {
        this.reuse();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
