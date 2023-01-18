import ChainProvider from "./chain_provider";
import {DocumentProperty, PropertType} from './chain_sdk';

test('Test Schemas', async() =>{
    var conn = await ChainProvider.connect();
    const schemaName = 'js-test-case1-schema';
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
    console.log('schema interfaces tested');
});

test('Test Documents', async() =>{
    const docCount = 10;
    const propertyNameAge = 'age';
    const propertyNameEnabled = 'enabled';
    const schemaName = 'js-test-case2-document';
    const docPrefix = 'js-test-case2-';
    var conn = await ChainProvider.connect();
    console.log('schema test begin...');
    {
      let result = await conn.hasSchema(schemaName);
      if (result){
        console.log('schema ' + schemaName + ' already exsits');
        await conn.deleteSchema(schemaName);
        console.log('previous schema ' + schemaName + ' deleted');
      }
    }

    var properties: DocumentProperty[] = [];
    await conn.createSchema(schemaName, properties);

    var docList: string[] = [];
    var content = '{}';
    for(let i = 0; i < docCount; i++){
        let docID = docPrefix + (i + 1);
        let respID = await conn.addDocument(schemaName, docID, content);
        console.log('doc ' + respID + ' added');
        docList.push(respID);
    }

    properties = [
        {
            name: propertyNameAge,
            type: PropertType.Integer,
        },
        {
            name: propertyNameEnabled,
            type: PropertType.Boolean,
        },
    ]
    await conn.updateSchema(schemaName, properties);
    console.log('schema updated');
    for(let i = 0; i < docCount; i++){
        let docID = docPrefix + (i + 1);
        if (0 === i % 2){
            content = JSON.stringify({
                age: 0,
                enabled: false
            });
        }else{
            content = JSON.stringify({
                age: 0,
                enabled: true
            });
        }
        await conn.updateDocument(schemaName, docID, content);
        console.log('doc ' + docID + ' updated');
    }
    for(let i = 0; i < docCount; i++){
        let docID = docPrefix + (i + 1);
        await conn.updateDocumentProperty(schemaName, docID, propertyNameAge, PropertType.Integer, i);
        console.log('property age of doc ' + docID + ' updated');
    }


    for (let docID of docList){
        await conn.removeDocument(schemaName, docID);
        console.log('doc ' + docID + ' removed');
    }

    await conn.deleteSchema(schemaName)
    console.log('test schema ' + schemaName + ' deleted')
    console.log('document interfaces tested');
})