import { DataSource } from 'apollo-datasource';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { ApolloError, ValidationError } from 'apollo-server';
import admin from '../config/firebase';
import { firestore } from 'firebase-admin';

class FirebaseDataSource extends DataSource {
  context: any;
  cache: any;

  initialize({ context = {}, cache = {} } = {}) {
    this.context = context;
    this.cache = cache || new InMemoryLRUCache();
  }

  async getDocumentById(
    docPath: string,
    query: any,
    mappingFunction: Function,
  ) {
    try {
      const collection = await admin
        .firestore()
        .collection(docPath)
        .where(query.parameter, '==', query.value)
        .get();
      return collection.docs.map(document => mappingFunction(document));
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  //Gets a All Documents from a Collection
  async getCollection(docPath: string, mappingFunction: Function) {
    try {
      const collection = await admin
        .firestore()
        .collection(docPath)
        .get();
      return collection.docs.map(document => mappingFunction(document));
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  //Get a specific Document
  async getDocument(docPath: string, mappingFunction: Function) {
    try {
      const document = await admin
        .firestore()
        .collection(docPath.split('/')[0])
        .doc(docPath.split('/')[1])
        .get();
      return mappingFunction(document);
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  async createDocument(docPath: string, data : object){
    try{
      const document = await admin
      .firestore()
      .collection(docPath)
      .add({...data, createdAt : admin.firestore.Timestamp.now() });
      return(document.id);
    } catch (err) {
      throw new ApolloError(err);
    }
  }
}

export default FirebaseDataSource;
