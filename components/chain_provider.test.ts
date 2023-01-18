import ChainProvider from "./chain_provider";
import {TaiyiClient, DocumentProperty, PropertType} from './chain_sdk';

test('Test Schemas', async() =>{
    var conn = await ChainProvider.connect();
    const schemaName = 'sample-test111';
    console.log('schema test begin...');
    {
      let result = await conn.hasSchema(schemaName);
      if (result){
        console.log('schema ' + schemaName + ' already exsits');
        await conn.deleteSchema(schemaName);
        console.log('previous schema ' + schemaName + ' deleted');
      }else{
        console.log('schema ' + schemaName + ' not exists')
      }
      console.log('test: check schema ok')
    }
    {
      let properties: DocumentProperty[] = [
        {
          name: 'name',
          type: PropertType.String
        },
        {
          name: 'age',
          type: PropertType.Integer
        },
        {
          name: 'available',
          type: PropertType.Boolean
        }
      ];
      await conn.createSchema(schemaName, properties);
      let current = await conn.getSchema(schemaName);
      console.log('test schema created ok:\n' + JSON.stringify(current))
    }
    {
      let properties: DocumentProperty[] = [
        {
          name: 'name',
          type: PropertType.String
        },
        {
          name: 'age',
          type: PropertType.Integer
        },
        {
          name: 'amount',
          type: PropertType.Currency
        },
        {
          name: 'country',
          type: PropertType.String
        }
      ];
      await conn.updateSchema(schemaName, properties);
      let current = await conn.getSchema(schemaName);
      console.log('test schema updated ok:\n' + JSON.stringify(current))
    }
    {
      await conn.deleteSchema(schemaName);
      console.log('test schema deleted ok: ' + schemaName);
    }
    console.log('schema test complete')
});