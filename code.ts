

figma.codegen.on("generate", async ({ node }) => {
    const cssProps = await node.getCSSAsync();
    let code = ""

    for (const [key, value] of Object.entries(cssProps)) {
      //console.log([key,value])


      // Color変数を抜き出し
      let regex = /var\((--\w+(-\w+)?)/;
      let match = value.match(regex);
      let _value;

      if(match){

        // Color定義のフォーマットを書き換え
        _value = match[1].replace(/--(\w+)/, "$$$1");

      }else if( key == 'font-family'){

        // フォント定義を置き換え
        if(value == 'Hiragino Kaku Gothic Pro'){
          _value = '$base-font-family';
        }else if(value == 'Helvetica Neue'){
          _value = '$latin-font-family';
        }else{
          _value = value;
        }

      }else if( key == 'font-weight'){

        // フォントウェイト定義を置き換え
        // 最上位のFrameの幅が375の場合はSPに判定
        let topFrame = getTopFrame(node)
        let isSp = (topFrame.width == 375)
        
        if(isSp){
          //SPの場合
          if(value == 300){
            _value = '$thin-font-weigh';
          }else if(value == 400){
            _value = '$base-font-weight';
          }else if(value == 500){
            _value = '$normal-font-weight';
          }else if(value == 600){
            _value = '$bold-font-weight';
          }else if(value == 700){
            _value = '$extra-bold-font-weight';
          }else{
            _value = value;
          }

        }else{
          //PCの場合
          if(value == 200){
            _value = '$thin-font-weigh';
          }else if(value == 300){
            _value = '$base-font-weight';
          }else if(value == 400){
            _value = '$normal-font-weight';
          }else if(value == 500){
            _value = '$medium-font-weight';
          }else if(value == 600){
            _value = '$bold-font-weight';
          }else if(value == 700){
            _value = '$extra-bold-font-weight';
          }else{
            _value = value;
          }

        }

      }else{
        _value = value;
      }
      code += `${key}: ${_value}\n`
    }
    return [
      {
        language: "CSS",
        code: code,
        title: "Codegen Plugin"
      }
    ];
});

// 指定したノードの最も上位にあるフレームを取得する関数
function getTopFrame(node) {
  let lastFrame
  if(node.type == 'FRAME'){
    lastFrame = node;
  }

  let _node = node;
  while (_node.parent) {
    _node = _node.parent
    if(_node.type == 'FRAME'){
      lastFrame = _node;
    }
  }
  return lastFrame;
}