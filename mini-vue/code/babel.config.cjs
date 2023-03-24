// 让babel支持编译typescript  @babel/preset-typescript
module.exports={
    presets:[
        ["@babel/preset-env",{targets:{node:"current"}}],
        "@babel/preset-typescript"
    ]
}