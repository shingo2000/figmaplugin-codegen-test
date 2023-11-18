

figma.codegen.on("generate", async ({ node }) => {
    const cssProps = await node.getCSSAsync();
    let code = ""
    for (const [key, value] of Object.entries(cssProps)) {

      if(key == 'color' || key == 'background'){

        // Color変数を抜き出し
        let regex = /var\((--\w+(-\w+)?)/;
        let match = value.match(regex);
        let _value;
        if(match){
          // Color定義のフォーマットを書き換え
          _value = match[1].replace(/--(\w+)/, "$$$1");
        }else{
          _value = value;
        }
        code += `${key}: ${_value}\n`

      }else{
        code += `${key}: ${value}\n`
      }
    }
    return [
      {
        language: "CSS",
        code: code,
        title: "Codegen Plugin"
      }
    ];
});
