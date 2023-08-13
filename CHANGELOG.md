## [1.3.3](https://github.com/sakurarealm/node-justchat/compare/v1.3.2...v1.3.3) (2023-08-13)


### Bug Fixes

* SendListMessage可以存在结果 ([dc477eb](https://github.com/sakurarealm/node-justchat/commit/dc477ebcb0b264a6903b207ae454719c6d7d9403))

## [1.3.2](https://github.com/sakurarealm/node-justchat/compare/v1.3.1...v1.3.2) (2023-08-13)


### Bug Fixes

* List包有一个字段名错误 ([1e21753](https://github.com/sakurarealm/node-justchat/commit/1e217537ea46902688a56030a7c3bd4ab6b380d7))
* 客户端代码错误 ([5a86bae](https://github.com/sakurarealm/node-justchat/commit/5a86baedee781282db411a6bf9aa38acd026299b))

## [1.3.1](https://github.com/sakurarealm/node-justchat/compare/v1.3.0...v1.3.1) (2023-08-11)


### Bug Fixes

* 修复了在socket断开连接时的行为不正常问题 ([62a329c](https://github.com/sakurarealm/node-justchat/commit/62a329cbce898a4cbc97aaac19b0d6efb726c875))

# [1.3.0](https://github.com/sakurarealm/node-justchat/compare/v1.2.0...v1.3.0) (2023-08-07)


### Features

* 修改客户端代码以适应变化 ([0236eb0](https://github.com/sakurarealm/node-justchat/commit/0236eb09fe118741e1ea2ace6bc97496c694a13c))
* 修改服务器端代码以适应sender类型变化 ([2954f34](https://github.com/sakurarealm/node-justchat/commit/2954f349239d6b780e4f973f76fefec619f172bc))

# [1.2.0](https://github.com/sakurarealm/node-justchat/compare/v1.1.3...v1.2.0) (2023-08-04)


### Features

* 适配新属性 ([4a763d8](https://github.com/sakurarealm/node-justchat/commit/4a763d80ca79884f3697ed703e2c268e5e5f69c7))
* 配合修改isMain为SID ([9271c83](https://github.com/sakurarealm/node-justchat/commit/9271c833a289649c304a28be314b13e7cd982ca0))

## [1.1.3](https://github.com/CJGroup/node-justchat/compare/v1.1.2...v1.1.3) (2023-07-15)


### Bug Fixes

* the 'world' param can be encoded ([cae0c18](https://github.com/CJGroup/node-justchat/commit/cae0c18ea305b260e105d30883d8421e164bedad))

## [1.1.2](https://github.com/CJGroup/node-justchat/compare/v1.1.1...v1.1.2) (2023-07-14)


### Bug Fixes

* incorrect Reg packet format ([b91a728](https://github.com/CJGroup/node-justchat/commit/b91a728afe9749a38c91248c13e94e3223c6e81b))

## [1.1.1](https://github.com/CJGroup/node-justchat/compare/v1.1.0...v1.1.1) (2023-07-03)


### Bug Fixes

* 添加了getClientList函数 ([f2a9310](https://github.com/CJGroup/node-justchat/commit/f2a93104ba6dea2e323967c6f040d970ee9ce0d0))

# [1.1.0](https://github.com/CJGroup/node-justchat/compare/v1.0.3...v1.1.0) (2023-07-01)


### Features

* add register event ([c601f6e](https://github.com/CJGroup/node-justchat/commit/c601f6ec66b7e3fe0b8eae712ba742541018a38f))

## [1.0.3](https://github.com/CJGroup/node-justchat/compare/v1.0.2...v1.0.3) (2023-06-14)


### Bug Fixes

* 修复了若干问题 ([4ff2bd1](https://github.com/CJGroup/node-justchat/commit/4ff2bd1ccfe9e83b71830334ea8df68e26634213))

## [1.0.2](https://github.com/CJGroup/node-justchat/compare/v1.0.1...v1.0.2) (2023-06-13)


### Bug Fixes

* 修复了Chat包和CMD包的type数搞反了的问题 ([dc4c3f0](https://github.com/CJGroup/node-justchat/commit/dc4c3f0ab8061ee43ac42a655710c6e90c8dc0e8))

## [1.0.1](https://github.com/CJGroup/node-justchat/compare/v1.0.0...v1.0.1) (2023-06-13)


### Bug Fixes

* 修复了sendChat和sendList需要填写version和type字段的问题 ([5304527](https://github.com/CJGroup/node-justchat/commit/5304527b0d8525a4e5239bad3ec35b90a748e778))

# 1.0.0 (2023-06-12)


### Bug Fixes

* 修复了server没有开始监听方法的问题 ([eac6928](https://github.com/CJGroup/node-justchat/commit/eac6928a9f8005a23e5d291402c95912864962ea))
* 修复了singleMode下发送数据的有关方法。 ([f9ebec3](https://github.com/CJGroup/node-justchat/commit/f9ebec32bca114a400d4568784d2329dc3583b2b))
* 修复了几个潜在的逻辑漏洞。 ([84e651e](https://github.com/CJGroup/node-justchat/commit/84e651e7a4056c01911f72c3bd68593b30ecad10))


### Features

* A few Changes ([72b6327](https://github.com/CJGroup/node-justchat/commit/72b63273adf303a4e89d01e1344b5d1712a38523))
* A Huge Change in many fields. ([498935d](https://github.com/CJGroup/node-justchat/commit/498935d703dd88ff7eedbb7944196bba4b0e9f94))
* Comprehensively fix the problem. ([48614d7](https://github.com/CJGroup/node-justchat/commit/48614d747edc06cbe0d7ae28f48f0efd543a2a66))
* Huge Changes ([753a82e](https://github.com/CJGroup/node-justchat/commit/753a82ec608ed7f3548072b76181560da000e2b0))
* Huge Changes ([8dfc918](https://github.com/CJGroup/node-justchat/commit/8dfc918a49f07aef095066cc3cc558e233c7506e))
* init server ([360a3d4](https://github.com/CJGroup/node-justchat/commit/360a3d47a1a2e3d314a0374853b0a42ce69569cc))
* 基本完成Server和Client的编写，等待测试。 ([a8f174f](https://github.com/CJGroup/node-justchat/commit/a8f174fd7f9202d2b97fdf53a399ef97837f3e96))
