# A Demo for the application system of corporation A

## 演示场景说明 Scenario

公司A针对客户贷款申请，向指定银行发起验资请求，通过人工或者智能合约方式验资客户是否满足资产要求。参与双方无需暴露各自的关键业务数据，比如客户贷款金额或者银行的资产情况，即可完成审批，有效促进组织间协作。

Corporation A initiates a bank verification request for the customer\'s loan request, which checks the minimum asset via manual or Smart Contract. Participants can complete the approval without exposing their critical data, such as the loan amount or the customer assets.

## 开发调试 Development

运行测试前，先将平台分配的私钥数据保存在"access_key.json"中，然后配置"package.json"的参数chain.host和chain.port设定好到网关的连接信息。

Before running the test, save the private key data allocated by the platform in "access_key.json", and then configure the parameters chain.host and chain.port of "package.json" to the service address of the gateway.

### Debug

```bash
$yarn dev
```



### Build & Run

```bash
$yarn build
$yarn start
```