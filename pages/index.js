import {useEffect,useState} from "react";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {Amplify, Auth, API, graphqlOperation } from "aws-amplify"
import awsconfig from "../src/aws-exports";
import * as mutations from '@/src/graphql/mutations';
import * as queries from '@/src/graphql/queries';
import * as subscriptions from '@/src/graphql/subscriptions';
// import { createTodo, updatedTodo, deletedTodo, readAllTodo } from '../util/db/Todo'



Amplify.configure(awsconfig);

console.log("-------Auth.configure()--------")
console.log(Auth.configure())

const todo = { name: "My first todo", description: "Hello world!" };
const todoUpdate = { id: "9e7ad069-1faa-4c33-9883-e2d188f83ecc", description: "Hello Update!" };
const todoDelte = {id: "a364f59f-5861-42e4-884f-509eea9c3b67"};

export default function Home({ formattedDate }) {
    //Subscription
    const [subValue,setSubValue]=useState(null);

    let createTodoSub;
    let updateTodoSub;
    let deleteTodoSub;

    function setupSubscriptions() {
        createTodoSub = API.graphql(
            graphqlOperation(subscriptions.onCreateTodo)
        ).subscribe({
            next: ({ provider, value }) => {
                console.log("### createTodoSub success!");
                console.log(provider, value);
                setSubValue(value);
            },
            error: (error) => {
                console.log("### createTodoSub faild...");
                console.warn(error)
            }
        });

        updateTodoSub = API.graphql(
            graphqlOperation(subscriptions.onUpdateTodo)
        ).subscribe({
            next: ({ provider, value }) => {
                console.log("### updateTodoSub success!");
                console.log(provider, value);
                setSubValue(value);
            },
            error: (error) => {
                console.log("### updateTodoSub faild...");
                console.warn(error)
            }
        });

        deleteTodoSub = API.graphql(
            graphqlOperation(subscriptions.onDeleteTodo)
        ).subscribe({
            next: ({ provider, value }) => {
                console.log("### deleteTodoSub success!");
                console.log(provider, value);
                setSubValue(value);
            },
            error: (error) => {
                console.log("### deleteTodoSub faild...");
                console.warn(error)
            }
        });
    }

    //Get Current User + Subscription
    const [user,setUser]= useState(null);

    useEffect(()=> {
    Auth.currentAuthenticatedUser({
     bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
    .then((user) => {
        console.log('### Current User Info')   
        console.log(user)
        setUser(user);
    })
    .catch((err) => {
        console.log('### Current User Error')   
        console.log(err)
    });

    //get Todo records
    

    }, []);    


    // Delete
    async function deleteTodo(){
        await API.graphql({
            query: mutations.deleteTodo,
            variables: { input: todoDelte }
        })
        .then((result) => {
            console.log('### deleteTodo success!')
            console.log(result);
        })
        .catch((error) => {
            console.log('### deleteTodo failed...')
            console.log(error);
        });
    }        

    // Update
    async function updateTodo(){
        await API.graphql({
            query: mutations.updateTodo,
            variables: { input: todoUpdate }
        })
        .then((result) => {
            console.log('### updateTodo success!')
            console.log(result);
        })
        .catch((error) => {
            console.log('### updateTodo failed...')
            console.log(error);
        });
    }    

    //Read
    const [todoList, setTodoList] = useState(null);

    useEffect(() => {
        API.graphql({ query: queries.listTodos })
        .then((result) => {
            console.log('### ListTodos success!');
            console.log(result);
            setTodoList(result.data.listTodos.items);
        })
        .catch((error) => {
            console.log('### ListTodos failed...');
            console.log(error);
        })
    },[]);


    //Create
    async function createTodo(){
        /* create a todo */
        await API.graphql({
            query: mutations.createTodo,
            variables: { input: todo }
        })
        .then((result) => {
            console.log('### createTodo success!')
            console.log(result);
        })
        .catch((error) => {
            console.log('### createTodo failed...')
            console.log(error);
        });
    }




    return (
    <>
      <Authenticator>
        <h1>Static page</h1>
        <p>This page is static. It was built on {formattedDate}.</p>
        <p>
          <a href="/ssr">View a server-side rendered page.</a>
        </p>
        <p>
        <button type="button" onClick={() => Auth.signOut()}>
                  Sign out
        </button>
        </p>
        <p>
            <li>{JSON.stringify(todoList,null,2)}</li>
        </p>


        <p>
        <button type="button" onClick={() => createTodo()}>
                  Add Todo
        </button>
        </p>
        <p>
        <button type="button" onClick={() => updateTodo()}>
                  Update Todo
        </button>
        </p>
        <p>
        <button type="button" onClick={() => deleteTodo()}>
                  Delete Todo
        </button>
        </p>
        <p>
            {/* <h3>You are signed in with <u>{user.attributes.email}</u></h3> */}
        </p>
        
      </Authenticator>
    </>
    );
  }
  
  export async function getStaticProps() {
    const buildDate = Date.now();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "long",
    }).format(buildDate);
  
    return { props: { formattedDate } };
  }