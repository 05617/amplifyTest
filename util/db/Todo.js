import { API } from "aws-amplify";
import * as queries from '../../src/graphql/queries';
import * as mutations from '../../src/graphql/mutations';

export async function readAllTodo() {
    let readResult;
    await API.graphql({ 
        query: queries.listTodos,
        authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    .then((result) => {
        console.log("### readAllTodo success!");
        console.log(result);
        readResult = result;
    })
    .catch((error) => {
        console.log("### readAllTodo faild...");
        console.log(error);
        throw new Error(`データ取得に失敗しました。`);
    })

    return readResult;
}

export async function createTodo(event) {
    event.preventDefault();
    const { value: name } = (event.target).name;
    const { value: description } = (event.target).description;
    const todoDetails = {
        name: name,
        description: description
    };

    await API.graphql({ 
        query: mutations.createTodo, 
        variables: { input: todoDetails },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    .then((result) => {
        console.log("### createTodo success!");
        console.log(result);
    })
    .catch((error) => {
        console.log("### createTodo faild...");
        console.log(error.errors);
        throw new Error(`データ追加に失敗しました。`);
    });
}

export async function updatedTodo(event) {
    event.preventDefault();
    const { value: id } = (event.target).updatedTodoId;
    const todoUpdateDetails = {
        id: id,
        description: 'Updated description'
    };

    await API.graphql({ 
        query: mutations.updateTodo, 
        variables: { input: todoUpdateDetails },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    .then((result) => {
        console.log("### updatedTodo success!");
        console.log(result);
    })
    .catch((error) => {
        console.log("### updatedTodo faild...");
        console.log(error.errors);
        throw new Error(`データ更新に失敗しました。`);
    });
}

export async function deletedTodo(event) {
    event.preventDefault();
    const { value: id } = (event.target).deleteTodoId;

    await API.graphql({ 
        query: mutations.deleteTodo, 
        variables: { input: { id: id } },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    .then((result) => {
        console.log("### deletedTodo success!");
        console.log(result);
    })
    .catch((error) => {
        console.log("### deletedTodo faild...");
        console.log(error.errors);
        throw new Error(`データ削除に失敗しました。`);
    });
}
