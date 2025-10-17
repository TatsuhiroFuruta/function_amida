window.addEventListener('beforeunload', function (event) {
  // 何らかの処理を実行する
  // console.log('ページが更新されようとしています。');

  // 更新処理をキャンセルする場合（ユーザーに確認メッセージを表示させる）
  // この行がないと、キャンセルされずに更新が進行します
  // confirm メソッドはうまくいかないことが確認（セキュリティーの都合上、メッセージをカスタムできない。）
  // if (confirm('タイトル画面に戻ります。よろしいでしょうか？')) {
  event.preventDefault();
  // }
});

// window.onbeforeunload = function() {
//   // return 'このページを離れると、変更は失われます。よろしいですか？';
//   return 'タイトル画面に戻ります。よろしいでしょうか？';
// };

// window.addEventListener('beforeunload', (e) => {
//   // イベントのデフォルトアクションをキャンセル
//   e.preventDefault();

//   // 最新のブラウザでは、カスタムメッセージは表示されず、
//   // ブラウザが用意した汎用的なメッセージが表示されます。
//   e.returnValue = 'ページを離れてもよろしいですか？a';
// });

// if (!confirm('ページを再読み込みしますか？')) {
//   location.reload();
// }

// window.onbeforeunload = function() {
//   // カスタムメッセージの表示
//   // alert("このページから移動すると、変更が保存されない可能性があります。本当に移動しますか？");
//   // または、confirm関数を使用する
//   let userConfirm = confirm("このページから移動しますか？");
//   if (userConfirm) {
//     return true; // 移動を許可
//   } else {
//     return false; // 移動をキャンセル
//   }
// };

// window.addEventListener("beforeunload", (ev) => {
//   ev.preventDefault ();
//   ev.returnValue = "check";
//   if( confirm('ページを閉じますか？') ){
//     alert('ページから離れます');
//     return true;
//   }
//   else {
//     alert('ページに留まりました');
//     return false;
//   }
// });

// window.addEventListener('beforeunload', function(event) {
//     // 確認メッセージを設定
//     const message = 'タイトル画面に戻ります。よろしいでしょうか？';

//     // 標準的な方法（モダンブラウザ）
//     // event.preventDefault();
//     event.returnValue = message;

//     // 古いブラウザ対応
//     return message;
// });